import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Fn,
  uniform,
  float,
  vec3,
  instanceIndex,
  uv,
  positionGeometry,
  pow,
  smoothstep,
  mix,
  sqrt,
  select,
  hash,
  deltaTime,
  pass,
  mrt,
  output,
  normalView,
  positionViewDirection,
  storage,
} from "three/tsl";

import {
  getEffectivePixelRatio,
  getQualityRetryOrder,
  GRASS_GLOBE_QUALITY_PRESETS,
  resolveGrassGlobeQuality,
} from "./grassGlobeQuality.js";
import { initGrassGlobeLite } from "./grassGlobeLite.js";

const SPHERE_R = 20;
const FLOWER_SURFACE_OFFSET = 4;
const FLOWER_SIZE = 4.2;
const GRASS_BEND_LERP_IN = 12;
const GRASS_BEND_LERP_OUT = 2.5;

export async function initGrassGlobe(container, options = {}) {
  const detected = await resolveGrassGlobeQuality();

  if (detected.tier === "lite" || !detected.webgpuAvailable) {
    return initGrassGlobeLite(container, options);
  }

  const retryOrder = getQualityRetryOrder(detected.tier);
  let lastError;

  for (const tier of retryOrder) {
    container.replaceChildren();
    try {
      const quality = {
        tier,
        webgpuAvailable: true,
        ...GRASS_GLOBE_QUALITY_PRESETS[tier],
      };
      return await initGrassGlobeWebGPU(container, options, quality);
    } catch (err) {
      lastError = err;
      console.warn(`[GrassGlobe] ${tier} quality failed`, err);
    }
  }

  console.warn("[GrassGlobe] Falling back to lite renderer", lastError);
  container.replaceChildren();
  return initGrassGlobeLite(container, options);
}

async function initGrassGlobeWebGPU(container, options = {}, quality) {
  const { initialFlowers = [], onFlowerTooltipUpdate } = options;
  const bladeCount = quality.bladeCount;

  const golden = (1 + Math.sqrt(5)) / 2;

  const scene = new THREE.Scene();
  scene.background = null;

  const getSize = () => ({
    width: container.clientWidth || window.innerWidth,
    height: container.clientHeight || window.innerHeight,
  });

  let { width, height } = getSize();

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
  camera.position.set(0, 30, 70);
  camera.lookAt(0, 0, 0);

  const maxDPR = getEffectivePixelRatio(quality.maxPixelRatio, width);
  const renderer = new THREE.WebGPURenderer({ antialias: quality.antialias });
  renderer.setPixelRatio(maxDPR);
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);

  await renderer.init();

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.zoomSpeed = 0.65;
  controls.enablePan = false;
  controls.target.set(0, 0, 0);
  const baseCameraDistance = camera.position.distanceTo(controls.target);
  const defaultCameraDistance = baseCameraDistance * 1.18;
  controls.minDistance = baseCameraDistance * 0.82;
  controls.maxDistance = defaultCameraDistance;
  camera.position.normalize().multiplyScalar(defaultCameraDistance);
  controls.update();

  const cpuPos = new Float32Array(bladeCount * 4);
  const cpuNorm = new Float32Array(bladeCount * 4);
  const cpuT1 = new Float32Array(bladeCount * 4);
  const cpuT2 = new Float32Array(bladeCount * 4);

  for (let i = 0; i < bladeCount; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / bladeCount);
    const phi = (2 * Math.PI * i) / golden;

    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    const sp = Math.sin(phi);
    const cp = Math.cos(phi);

    const nx = st * cp;
    const ny = ct;
    const nz = st * sp;

    let t1x;
    let t1y;
    let t1z;
    if (Math.abs(ny) > 0.9) {
      t1x = ny;
      t1y = -nx;
      t1z = 0;
    } else {
      t1x = -nz;
      t1y = 0;
      t1z = nx;
    }
    let len = Math.sqrt(t1x * t1x + t1y * t1y + t1z * t1z) || 1e-5;
    t1x /= len;
    t1y /= len;
    t1z /= len;

    let t2x = ny * t1z - nz * t1y;
    let t2y = nz * t1x - nx * t1z;
    let t2z = nx * t1y - ny * t1x;
    len = Math.sqrt(t2x * t2x + t2y * t2y + t2z * t2z) || 1e-5;
    t2x /= len;
    t2y /= len;
    t2z /= len;

    const rot = Math.random() * Math.PI * 2;
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    const rt1x = t1x * cr + t2x * sr;
    const rt1y = t1y * cr + t2y * sr;
    const rt1z = t1z * cr + t2z * sr;
    const rt2x = -t1x * sr + t2x * cr;
    const rt2y = -t1y * sr + t2y * cr;
    const rt2z = -t1z * sr + t2z * cr;

    const jt = theta + (Math.random() - 0.5) * 0.003;
    const jp = phi + (Math.random() - 0.5) * 0.003;
    const px = Math.sin(jt) * Math.cos(jp) * SPHERE_R;
    const py = Math.cos(jt) * SPHERE_R;
    const pz = Math.sin(jt) * Math.sin(jp) * SPHERE_R;

    const n1 = Math.sin(phi * 2.3 + theta * 3.7) * 0.5 + 0.5;
    const n2 = Math.sin(phi * 17.1 + theta * 11.3 + 50) * 0.5 + 0.5;
    const hVar = Math.max(0, n1 * 1.85 - 0.2 + n2 * 0.4);

    const i4 = i * 4;
    cpuPos[i4] = px;
    cpuPos[i4 + 1] = py;
    cpuPos[i4 + 2] = pz;
    cpuPos[i4 + 3] = hVar;
    cpuNorm[i4] = nx;
    cpuNorm[i4 + 1] = ny;
    cpuNorm[i4 + 2] = nz;
    cpuNorm[i4 + 3] = 0;
    cpuT1[i4] = rt1x;
    cpuT1[i4 + 1] = rt1y;
    cpuT1[i4 + 2] = rt1z;
    cpuT1[i4 + 3] = 0;
    cpuT2[i4] = rt2x;
    cpuT2[i4 + 1] = rt2y;
    cpuT2[i4 + 2] = rt2z;
    cpuT2[i4 + 3] = 0;
  }

  const bladeDataAttr = new THREE.StorageBufferAttribute(cpuPos, 4);
  const bladeNormAttr = new THREE.StorageBufferAttribute(cpuNorm, 4);
  const bladeTan1Attr = new THREE.StorageBufferAttribute(cpuT1, 4);
  const bladeTan2Attr = new THREE.StorageBufferAttribute(cpuT2, 4);
  const bendStateAttr = new THREE.StorageBufferAttribute(
    new Float32Array(bladeCount * 4),
    4,
  );

  const bladeData = storage(bladeDataAttr, "vec4", bladeCount);
  const bladeNorm = storage(bladeNormAttr, "vec4", bladeCount);
  const bladeTan1 = storage(bladeTan1Attr, "vec4", bladeCount);
  const bladeTan2 = storage(bladeTan2Attr, "vec4", bladeCount);
  const bendState = storage(bendStateAttr, "vec4", bladeCount);

  const mouseWorld = uniform(new THREE.Vector3(99999, 99999, 99999));
  const mouseRadius = uniform(2.5);
  const mouseStrength = uniform(5.0);
  const outerRadius = uniform(5.0);
  const outerStrength = uniform(2.0);

  const bladeWidth = uniform(0.12);
  const bladeTipWidth = uniform(0.19);
  const bladeHeight = uniform(2.8);
  const bladeHeightVariation = uniform(0.45);
  const bladeLean = uniform(0.9);
  const bladeColorVariation = uniform(0.93);
  const bladeBaseColor = uniform(new THREE.Color("#122a04"));
  const bladeTipColor = uniform(new THREE.Color("#8abf28"));
  const goldenTipColor = uniform(new THREE.Color("#b8d440"));
  const greenTipColor = uniform(new THREE.Color("#5a9a1a"));
  const midColor = uniform(new THREE.Color("#3a6e12"));

  const computeUpdate = Fn(() => {
    const blade = bladeData.element(instanceIndex);
    const t1 = bladeTan1.element(instanceIndex);
    const t2 = bladeTan2.element(instanceIndex);
    const bend = bendState.element(instanceIndex);

    const bx = blade.x;
    const by = blade.y;
    const bz = blade.z;

    bend.x.assign(0);
    bend.y.assign(0);

    const dx = bx.sub(mouseWorld.x);
    const dy = by.sub(mouseWorld.y);
    const dz = bz.sub(mouseWorld.z);
    const dist = sqrt(dx.mul(dx).add(dy.mul(dy)).add(dz.mul(dz))).add(0.0001);

    const pushOnT1 = dx.mul(t1.x).add(dy.mul(t1.y)).add(dz.mul(t1.z));
    const pushOnT2 = dx.mul(t2.x).add(dy.mul(t2.y)).add(dz.mul(t2.z));
    const tangLen = sqrt(
      pushOnT1.mul(pushOnT1).add(pushOnT2.mul(pushOnT2)),
    ).add(0.0001);
    const pNormT1 = pushOnT1.div(tangLen);
    const pNormT2 = pushOnT2.div(tangLen);

    const falloff = float(1).sub(dist.div(mouseRadius).saturate());
    const influence = falloff.mul(falloff).mul(mouseStrength);
    const ofalloff = float(1).sub(dist.div(outerRadius).saturate());
    const oinfluence = ofalloff.mul(ofalloff).mul(outerStrength);
    const totalInfluence = influence.add(oinfluence);

    const fT1 = pNormT1.mul(totalInfluence);
    const fT2 = pNormT2.mul(totalInfluence);

    const targetMag = sqrt(fT1.mul(fT1).add(fT2.mul(fT2)));
    const currentMag = sqrt(bend.z.mul(bend.z).add(bend.w.mul(bend.w)));
    const lm = select(
      targetMag.greaterThan(currentMag),
      deltaTime.mul(GRASS_BEND_LERP_IN),
      deltaTime.mul(GRASS_BEND_LERP_OUT),
    ).saturate();

    bend.z.assign(mix(bend.z, fT1, lm));
    bend.w.assign(mix(bend.w, fT2, lm));
  })().compute(bladeCount);

  function createBladeGeometry() {
    const segs = 5;
    const W = 1.0;
    const H = 1.0;
    const v = [];
    const n = [];
    const u = [];
    const idx = [];
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const y = t * H;
      const hw = W * 0.5 * (1 - t * 0.85);
      v.push(-hw, y, 0, hw, y, 0);
      n.push(0, 0, 1, 0, 0, 1);
      u.push(0, t, 1, t);
    }
    for (let i = 0; i < segs; i++) {
      const b = i * 2;
      idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(n, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(u, 2));
    geo.setIndex(idx);
    return geo;
  }

  const grassMat = new THREE.MeshBasicNodeMaterial({ side: THREE.DoubleSide });

  grassMat.positionNode = Fn(() => {
    const blade = bladeData.element(instanceIndex);
    const norm = bladeNorm.element(instanceIndex);
    const t1 = bladeTan1.element(instanceIndex);
    const t2 = bladeTan2.element(instanceIndex);
    const bend = bendState.element(instanceIndex);

    const hVar = hash(instanceIndex.add(5555)).mul(bladeHeightVariation);
    const heightScale = float(0.35).add(blade.w).add(hVar);
    const t = uv().y;

    const taper = float(1).sub(t.mul(float(1).sub(bladeTipWidth)));
    const localX = positionGeometry.x
      .mul(bladeWidth)
      .mul(taper)
      .mul(heightScale.add(0.3).sign());
    const localY = positionGeometry.y.mul(heightScale).mul(bladeHeight);

    const bf = pow(t, 1.8);
    const sbT1 = hash(instanceIndex.add(7777)).sub(0.5).mul(bladeLean);
    const sbT2 = hash(instanceIndex.add(8888)).sub(0.5).mul(bladeLean);

    const bT1 = sbT1.add(bend.x).add(bend.z);
    const bT2 = sbT2.add(bend.y).add(bend.w);

    const bendOffT1 = bT1.mul(bf).mul(bladeHeight);
    const bendOffT2 = bT2.mul(bf).mul(bladeHeight);

    const offT1 = localX.add(bendOffT1);
    const offT2 = bendOffT2;

    const wx = blade.x
      .add(norm.x.mul(localY))
      .add(t1.x.mul(offT1))
      .add(t2.x.mul(offT2));
    const wy = blade.y
      .add(norm.y.mul(localY))
      .add(t1.y.mul(offT1))
      .add(t2.y.mul(offT2));
    const wz = blade.z
      .add(norm.z.mul(localY))
      .add(t1.z.mul(offT1))
      .add(t2.z.mul(offT2));

    const origLen = sqrt(localX.mul(localX).add(localY.mul(localY)));
    const dxB = wx.sub(blade.x);
    const dyB = wy.sub(blade.y);
    const dzB = wz.sub(blade.z);
    const newLen = sqrt(dxB.mul(dxB).add(dyB.mul(dyB)).add(dzB.mul(dzB))).add(
      0.0001,
    );
    const sc = origLen.div(newLen);

    return vec3(
      blade.x.add(dxB.mul(sc)),
      blade.y.add(dyB.mul(sc)),
      blade.z.add(dzB.mul(sc)),
    );
  })();

  grassMat.colorNode = Fn(() => {
    const t = uv().y;
    const clump = bladeData.element(instanceIndex).w.saturate();
    const isGolden = hash(instanceIndex.add(4242)).lessThan(0.25);
    const tipMix = float(1)
      .sub(bladeColorVariation)
      .add(clump.mul(bladeColorVariation));
    const greenTip = mix(greenTipColor, bladeTipColor, tipMix);
    const warmTip = mix(greenTipColor, goldenTipColor, tipMix);
    const tipFinal = mix(
      greenTip,
      warmTip,
      select(isGolden, float(1), float(0)),
    );
    const lowerC = mix(
      bladeBaseColor,
      midColor,
      smoothstep(float(0), float(0.45), t),
    );
    const grassC = mix(
      lowerC,
      tipFinal,
      smoothstep(float(0.4), float(0.85), t),
    );
    return grassC;
  })();

  const grass = new THREE.InstancedMesh(
    createBladeGeometry(),
    grassMat,
    bladeCount,
  );
  grass.name = "grassGlobe";
  grass.frustumCulled = false;
  scene.add(grass);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < bladeCount; i++) grass.setMatrixAt(i, dummy.matrix);
  grass.instanceMatrix.needsUpdate = true;

  const sphereSegments = quality.sphereSegments;
  const innerSphereGeo = new THREE.SphereGeometry(
    SPHERE_R - 0.05,
    sphereSegments,
    sphereSegments,
  );
  const innerSphereMat = new THREE.MeshBasicNodeMaterial();
  innerSphereMat.colorNode = Fn(() => vec3(0.08, 0.22, 0.03))();
  scene.add(new THREE.Mesh(innerSphereGeo, innerSphereMat));

  const skydomeGeo = new THREE.SphereGeometry(220, sphereSegments, sphereSegments);
  const skydomeMat = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide });
  skydomeMat.colorNode = Fn(() => {
    const t = positionViewDirection.y.mul(0.5).add(0.5);
    const horizonColor = vec3(0.78, 0.9, 0.97);
    const zenithColor = vec3(0.58, 0.78, 0.94);
    const nadirColor = vec3(0.72, 0.86, 0.96);
    const upperT = smoothstep(float(0.5), float(0.88), t);
    const upperC = mix(horizonColor, zenithColor, upperT);
    const lowerT = smoothstep(float(0.5), float(0.12), t);
    const lowerC = mix(horizonColor, nadirColor, lowerT);
    const isUpper = smoothstep(float(0.48), float(0.52), t);
    return mix(lowerC, upperC, isUpper);
  })();
  scene.add(new THREE.Mesh(skydomeGeo, skydomeMat));

  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  const dirLight = new THREE.DirectionalLight(0xf0f6fc, 1.2);
  dirLight.position.set(-20, 50, -20);
  scene.add(dirLight);

  const postProcessing = quality.usePostProcessing
    ? new THREE.PostProcessing(renderer)
    : null;
  if (postProcessing) {
    const scenePass = pass(scene, camera);
    scenePass.setMRT(mrt({ output, normal: normalView }));
    postProcessing.outputNode = scenePass.getTextureNode("output");
    postProcessing.needsUpdate = true;
  }

  const renderFrame = () => {
    if (postProcessing) postProcessing.render();
    else renderer.render(scene, camera);
  };

  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();
  const flowerWorldPos = new THREE.Vector3();
  let selectedFlowerMesh = null;
  let lastTooltipPayload = null;
  const hitSphereGeo = new THREE.SphereGeometry(SPHERE_R + 2.0, 32, 32);
  const hitMesh = new THREE.Mesh(
    hitSphereGeo,
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  scene.add(hitMesh);

  const flowersGroup = new THREE.Group();
  flowersGroup.name = "flowers";
  scene.add(flowersGroup);

  const flowerInstances = [];
  const textureLoader = new THREE.TextureLoader();
  let flowerCount = 0;

  function setPointerNDC(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    mouseNDC.set((x / rect.width) * 2 - 1, -(y / rect.height) * 2 + 1);
  }

  function updateGrassMouseWorld() {
    raycaster.setFromCamera(mouseNDC, camera);
    const hits = raycaster.intersectObject(hitMesh);
    if (hits.length > 0) {
      mouseWorld.value.copy(hits[0].point);
    } else {
      mouseWorld.value.set(99999, 99999, 99999);
    }
  }

  function pickFlower() {
    if (flowersGroup.children.length === 0) return [];
    raycaster.setFromCamera(mouseNDC, camera);
    return raycaster.intersectObjects(flowersGroup.children, false);
  }

  function getFlowerScreenPosition(mesh) {
    mesh.getWorldPosition(flowerWorldPos);
    flowerWorldPos.project(camera);
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + (flowerWorldPos.x * 0.5 + 0.5) * rect.width,
      y: rect.top + (-flowerWorldPos.y * 0.5 + 0.5) * rect.height,
    };
  }

  function notifyFlowerTooltip() {
    if (!onFlowerTooltipUpdate) return;
    if (!selectedFlowerMesh) {
      if (lastTooltipPayload !== null) {
        lastTooltipPayload = null;
        onFlowerTooltipUpdate(null);
      }
      return;
    }
    const meta = selectedFlowerMesh.userData.flowerMeta;
    const { x, y } = getFlowerScreenPosition(selectedFlowerMesh);
    const payload = {
      name: meta.name,
      createdAt: meta.createdAt,
      x: Math.round(x),
      y: Math.round(y),
    };
    if (
      lastTooltipPayload &&
      lastTooltipPayload.name === payload.name &&
      lastTooltipPayload.createdAt === payload.createdAt &&
      lastTooltipPayload.x === payload.x &&
      lastTooltipPayload.y === payload.y
    ) {
      return;
    }
    lastTooltipPayload = payload;
    onFlowerTooltipUpdate(payload);
  }

  function handlePointer(clientX, clientY) {
    setPointerNDC(clientX, clientY);
    updateGrassMouseWorld();
    const overFlower = pickFlower().length > 0;
    canvas.style.cursor = overFlower ? "pointer" : "";
  }

  const onMouseMove = (e) => handlePointer(e.clientX, e.clientY);
  const onMouseLeave = () => {
    mouseWorld.value.set(99999, 99999, 99999);
    canvas.style.cursor = "";
  };
  const onTouchMove = (e) => {
    const t = e.touches[0];
    handlePointer(t.clientX, t.clientY);
  };
  const onTouchEnd = () => {
    mouseWorld.value.set(99999, 99999, 99999);
    canvas.style.cursor = "";
  };
  const onCanvasPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setPointerNDC(e.clientX, e.clientY);
    const flowerHits = pickFlower();
    selectedFlowerMesh = flowerHits.length > 0 ? flowerHits[0].object : null;
    notifyFlowerTooltip();
  };

  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);
  canvas.addEventListener("touchmove", onTouchMove, { passive: true });
  canvas.addEventListener("touchend", onTouchEnd);
  canvas.addEventListener("pointerdown", onCanvasPointerDown);

  function tangentFrame(normal) {
    const n = normal.clone().normalize();
    const t1 = new THREE.Vector3();
    if (Math.abs(n.y) > 0.9) {
      t1.set(n.y, -n.x, 0);
    } else {
      t1.set(-n.z, 0, n.x);
    }
    t1.normalize();
    const t2 = new THREE.Vector3().crossVectors(n, t1).normalize();
    return { normal: n, t1, t2 };
  }

  function placementOnSphere(index) {
    const theta = Math.acos(1 - (2 * (((index * 37 + 11) % 97) + 0.5)) / 97);
    const phi = 2 * Math.PI * index * golden;
    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    const sp = Math.sin(phi);
    const cp = Math.cos(phi);
    const nx = st * cp;
    const ny = ct;
    const nz = st * sp;
    const normal = new THREE.Vector3(nx, ny, nz);
    const basePos = normal
      .clone()
      .multiplyScalar(SPHERE_R + FLOWER_SURFACE_OFFSET);
    return { basePos, ...tangentFrame(normal) };
  }

  async function addFlowerToGlobe(flowerData, index) {
    const texture = await textureLoader.loadAsync(flowerData.image);
    texture.colorSpace = THREE.SRGBColorSpace;

    const size = FLOWER_SIZE;
    const geo = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.08,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    const place = placementOnSphere(index);
    mesh.position.copy(place.basePos);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      place.normal,
    );

    mesh.userData.flowerMeta = {
      name: flowerData.name,
      message: flowerData.message,
      color: flowerData.color,
      createdAt: flowerData.createdAt,
    };

    flowersGroup.add(mesh);
    flowerInstances.push({
      mesh,
      basePos: place.basePos,
      normal: place.normal,
      t1: place.t1,
      t2: place.t2,
      bendT1: 0,
      bendT2: 0,
    });
  }

  function updateFlowerBends(dt) {
    const mx = mouseWorld.value.x;
    const my = mouseWorld.value.y;
    const mz = mouseWorld.value.z;
    const mRadius = mouseRadius.value;
    const mStrength = mouseStrength.value;
    const oRadius = outerRadius.value;
    const oStrength = outerStrength.value;

    for (const flower of flowerInstances) {
      const bx = flower.basePos.x;
      const by = flower.basePos.y;
      const bz = flower.basePos.z;
      const dx = bx - mx;
      const dy = by - my;
      const dz = bz - mz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.0001;

      const pushOnT1 = dx * flower.t1.x + dy * flower.t1.y + dz * flower.t1.z;
      const pushOnT2 = dx * flower.t2.x + dy * flower.t2.y + dz * flower.t2.z;
      const tangentialLen =
        Math.sqrt(pushOnT1 * pushOnT1 + pushOnT2 * pushOnT2) + 0.0001;
      const pNormT1 = pushOnT1 / tangentialLen;
      const pNormT2 = pushOnT2 / tangentialLen;

      const falloff = Math.max(0, 1 - dist / mRadius);
      const influence = falloff * falloff * mStrength;
      const ofalloff = Math.max(0, 1 - dist / oRadius);
      const oinfluence = ofalloff * ofalloff * oStrength;
      const totalInfluence = influence + oinfluence;

      const targetT1 = pNormT1 * totalInfluence;
      const targetT2 = pNormT2 * totalInfluence;
      const targetMag = Math.sqrt(targetT1 * targetT1 + targetT2 * targetT2);
      const currentMag = Math.sqrt(
        flower.bendT1 * flower.bendT1 + flower.bendT2 * flower.bendT2,
      );
      const lm = Math.min(
        1,
        targetMag > currentMag ? dt * GRASS_BEND_LERP_IN : dt * GRASS_BEND_LERP_OUT,
      );

      flower.bendT1 += (targetT1 - flower.bendT1) * lm;
      flower.bendT2 += (targetT2 - flower.bendT2) * lm;

      flower.mesh.position.set(
        bx + flower.t1.x * flower.bendT1 + flower.t2.x * flower.bendT2,
        by + flower.t1.y * flower.bendT1 + flower.t2.y * flower.bendT2,
        bz + flower.t1.z * flower.bendT1 + flower.t2.z * flower.bendT2,
      );
    }
  }

  let resizeObserver;
  let resizeTimeout;

  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ({ width, height } = getSize());
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(getEffectivePixelRatio(quality.maxPixelRatio, width));
      renderer.setSize(width, height);
    }, 100);
  };

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", handleResize);
  }

  function orientCameraTowardFlower(flower) {
    const viewDir = flower.basePos.clone().normalize();
    const distance = camera.position.distanceTo(controls.target);
    camera.position.copy(viewDir.multiplyScalar(distance));
    controls.update();
  }

  function pickFlowerForInitialView() {
    if (flowerInstances.length === 0) return null;
    for (const flower of flowerInstances) {
      if (Math.abs(flower.normal.y) < 0.85) return flower;
    }
    return flowerInstances[0];
  }

  for (let i = 0; i < initialFlowers.length; i++) {
    await addFlowerToGlobe(initialFlowers[i], i);
    flowerCount = i + 1;
  }

  const initialViewFlower = pickFlowerForInitialView();
  if (initialViewFlower) {
    orientCameraTowardFlower(initialViewFlower);
  }

  for (let i = 0; i < 3; i++) {
    renderer.compute(computeUpdate);
    updateFlowerBends(1 / 60);
    renderFrame();
    await new Promise((r) => requestAnimationFrame(r));
  }

  let lastFrameTime = performance.now();
  let disposed = false;

  renderer.setAnimationLoop(() => {
    if (disposed) return;
    const now = performance.now();
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    renderer.compute(computeUpdate);
    updateFlowerBends(dt);
    controls.update();
    if (selectedFlowerMesh) notifyFlowerTooltip();
    renderFrame();
  });

  return {
    addFlower(flowerData) {
      const index = flowerCount;
      flowerCount += 1;
      return addFlowerToGlobe(flowerData, index);
    },
    clearFlowerSelection() {
      selectedFlowerMesh = null;
      lastTooltipPayload = null;
      notifyFlowerTooltip();
    },
    destroy() {
      disposed = true;
      renderer.setAnimationLoop(null);
      controls.dispose();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("pointerdown", onCanvasPointerDown);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
      clearTimeout(resizeTimeout);
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    },
  };
}

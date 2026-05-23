import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const SPHERE_R = 20;
const FLOWER_SURFACE_OFFSET = 4;
const FLOWER_SIZE = 4.2;
const golden = (1 + Math.sqrt(5)) / 2;

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
  const normal = new THREE.Vector3(st * cp, ct, st * sp);
  const basePos = normal
    .clone()
    .multiplyScalar(SPHERE_R + FLOWER_SURFACE_OFFSET);
  return { basePos, ...tangentFrame(normal) };
}

export async function initGrassGlobeLite(container, options = {}) {
  const { initialFlowers = [], onFlowerTooltipUpdate } = options;

  const getSize = () => ({
    width: container.clientWidth || window.innerWidth,
    height: container.clientHeight || window.innerHeight,
  });

  let { width, height } = getSize();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
  camera.position.set(0, 30, 70);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.target.set(0, 0, 0);
  const baseCameraDistance = camera.position.distanceTo(controls.target);
  const defaultCameraDistance = baseCameraDistance * 1.18;
  controls.minDistance = baseCameraDistance * 0.82;
  controls.maxDistance = defaultCameraDistance;
  camera.position.normalize().multiplyScalar(defaultCameraDistance);
  controls.update();

  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(SPHERE_R, 48, 48),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.08, 0.22, 0.03),
      }),
    ),
  );

  const skydomeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {},
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      void main() {
        vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vec3 viewDir = normalize(worldPos - cameraPosition);
        vec3 viewDirView = mat3(viewMatrix) * viewDir;
        float t = viewDirView.y * 0.5 + 0.5;
        vec3 horizon = vec3(0.78, 0.9, 0.97);
        vec3 zenith = vec3(0.58, 0.78, 0.94);
        vec3 nadir = vec3(0.72, 0.86, 0.96);
        vec3 upper = mix(horizon, zenith, smoothstep(0.5, 0.88, t));
        vec3 lower = mix(horizon, nadir, smoothstep(0.5, 0.12, t));
        gl_FragColor = vec4(mix(lower, upper, smoothstep(0.48, 0.52, t)), 1.0);
      }
    `,
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(220, 32, 32), skydomeMat));

  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const dirLight = new THREE.DirectionalLight(0xf0f6fc, 1.1);
  dirLight.position.set(-20, 50, -20);
  scene.add(dirLight);

  const flowersGroup = new THREE.Group();
  scene.add(flowersGroup);

  const textureLoader = new THREE.TextureLoader();
  const flowerInstances = [];
  let flowerCount = 0;

  async function addFlowerToGlobe(flowerData, index) {
    const texture = await textureLoader.loadAsync(flowerData.image);
    texture.colorSpace = THREE.SRGBColorSpace;

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(FLOWER_SIZE, FLOWER_SIZE),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.08,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );

    const place = placementOnSphere(index);
    mesh.position.copy(place.basePos);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), place.normal);
    mesh.userData.flowerMeta = {
      name: flowerData.name,
      message: flowerData.message,
      color: flowerData.color,
      createdAt: flowerData.createdAt,
    };

    flowersGroup.add(mesh);
    flowerInstances.push({ mesh, basePos: place.basePos, normal: place.normal });
  }

  for (let i = 0; i < initialFlowers.length; i++) {
    await addFlowerToGlobe(initialFlowers[i], i);
    flowerCount = i + 1;
  }

  if (flowerInstances.length > 0) {
    const viewFlower =
      flowerInstances.find((f) => Math.abs(f.normal.y) < 0.85) ??
      flowerInstances[0];
    const viewDir = viewFlower.basePos.clone().normalize();
    const distance = camera.position.distanceTo(controls.target);
    camera.position.copy(viewDir.multiplyScalar(distance));
    controls.update();
  }

  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();
  const flowerWorldPos = new THREE.Vector3();
  let selectedFlowerMesh = null;
  let lastTooltipPayload = null;

  function setPointerNDC(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouseNDC.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
  }

  function pickFlower() {
    if (flowersGroup.children.length === 0) return [];
    raycaster.setFromCamera(mouseNDC, camera);
    return raycaster.intersectObjects(flowersGroup.children, false);
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
    selectedFlowerMesh.getWorldPosition(flowerWorldPos);
    flowerWorldPos.project(camera);
    const rect = canvas.getBoundingClientRect();
    const payload = {
      name: meta.name,
      createdAt: meta.createdAt,
      x: Math.round(rect.left + (flowerWorldPos.x * 0.5 + 0.5) * rect.width),
      y: Math.round(rect.top + (-flowerWorldPos.y * 0.5 + 0.5) * rect.height),
    };
    lastTooltipPayload = payload;
    onFlowerTooltipUpdate(payload);
  }

  const onPointerMove = (clientX, clientY) => {
    setPointerNDC(clientX, clientY);
    canvas.style.cursor = pickFlower().length > 0 ? "pointer" : "";
  };

  const onMouseMove = (e) => onPointerMove(e.clientX, e.clientY);
  const onMouseLeave = () => {
    canvas.style.cursor = "";
  };
  const onTouchMove = (e) => {
    const t = e.touches[0];
    onPointerMove(t.clientX, t.clientY);
  };
  const onCanvasPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setPointerNDC(e.clientX, e.clientY);
    selectedFlowerMesh = pickFlower()[0]?.object ?? null;
    notifyFlowerTooltip();
  };

  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseleave", onMouseLeave);
  canvas.addEventListener("touchmove", onTouchMove, { passive: true });
  canvas.addEventListener("pointerdown", onCanvasPointerDown);

  let resizeObserver;
  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ({ width, height } = getSize());
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(width, height);
    }, 100);
  };

  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", handleResize);
  }

  let disposed = false;
  renderer.setAnimationLoop(() => {
    if (disposed) return;
    controls.update();
    if (selectedFlowerMesh) notifyFlowerTooltip();
    renderer.render(scene, camera);
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
      canvas.removeEventListener("pointerdown", onCanvasPointerDown);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
      renderer.dispose();
      if (canvas.parentNode === container) container.removeChild(canvas);
    },
  };
}

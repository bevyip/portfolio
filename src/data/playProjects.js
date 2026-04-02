// Play Projects Data
// Size options: "tall" (2 rows), "short" (1 row)
// Images: local paths under public/ (e.g. /projects/...)
// Video: CDN (optional local /projects/<id>/demo.mp4 later)

const CDN = "https://res.cloudinary.com/djldar8hj";
const vid = (id) => `${CDN}/video/upload/f_auto,q_auto/${id}.mp4`;

export const playProjects = [
  {
    id: "block-party",
    size: "tall",
    theme: "white",
    tags: ["Gemini AI", "Creative Coding"],
    category: "digital",
    media: {
      video: vid("v1774495166/block-party_kb7spr"),
      poster: "/projects/block-party/poster.png",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://block-party-thesis.vercel.app",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2028207640124231722?s=20",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/block-party-thesis?source=copy_link",
      },
    ],
  },
  {
    id: "floral-jukebox",
    size: "tall",
    theme: "white",
    tags: ["React", "Web Audio API"],
    category: "digital",
    media: {
      video: vid("projects/floral-jukebox/demo"),
      poster: "/projects/floral-jukebox/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://floral-jukebox-visualizer.vercel.app/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2020402263144165869?s=20",
      },
    ],
  },
  {
    id: "spherical-shopping",
    size: "tall",
    theme: "white",
    tags: ["React", "Three.js"],
    category: "digital",
    media: {
      video: vid("projects/spherical-shopping/demo"),
      poster: "/projects/spherical-shopping/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://spherical-shopping.vercel.app",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004345868296900737?s=20",
      },
    ],
  },
  {
    id: "emotional-canvas",
    size: "short",
    theme: "white",
    tags: ["R3F", "Three.js"],
    category: "digital",
    media: {
      video: vid("projects/emotional-canvas/demo"),
      poster: "/projects/emotional-canvas/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://emotional-canvas.vercel.app",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004341121569399127?s=20",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-5-2b15b3e7f9e78003aeb2c9dbf1f077f8?source=copy_link",
      },
    ],
  },
  {
    id: "im-listening",
    size: "short",
    theme: "black",
    tags: ["Audio Analysis", "Three.js"],
    category: "digital",
    media: {
      video: vid("projects/im-listening/demo1"),
      poster: "/projects/im-listening/poster1.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://bevyip.github.io/dream-mirror/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004340156485324979?s=20",
      },
    ],
  },
  {
    id: "ball-slide",
    size: "tall",
    theme: "white",
    tags: ["GSAP", "Three.js"],
    category: "digital",
    media: {
      video: vid("projects/ball-slide/demo"),
      poster: "/projects/ball-slide/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://ball-slide.vercel.app",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004342996427592084?s=20",
      },
    ],
  },
  {
    id: "cat-box",
    size: "short",
    theme: "white",
    tags: ["Fabrication", "Woodworking"],
    category: "physical",
    media: {
      video: vid("projects/cat-box/demo"),
      poster: "/projects/cat-box/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View Portfolio Deck",
        url: "https://docs.google.com/presentation/d/1n0bsMJ6bRc6EFrK3dV13DUeooROi32we/edit?usp=sharing&ouid=100755772065646129206&rtpof=true&sd=true",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-1-Build-a-Box-1145b3e7f9e780a4b1a3e3d53f082f4d?source=copy_link",
      },
    ],
  },
  {
    id: "snowflake",
    size: "tall",
    theme: "white",
    tags: ["React", "Creative Coding"],
    category: "digital",
    media: {
      video: vid("projects/snowflake/demo1"),
      poster: "/projects/snowflake/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://text-snowflake.vercel.app/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004334652463726714?s=20",
      },
    ],
  },
  {
    id: "emoji-ascii-art",
    size: "short",
    theme: "white",
    tags: ["React", "Creative Coding"],
    category: "digital",
    media: {
      video: vid("projects/ascii-art/demo"),
      poster: "/projects/ascii-art/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://emoji-ascii-art.vercel.app/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004715444700405905?s=20",
      },
    ],
  },
  {
    id: "photo-collage-reveal",
    size: "tall",
    theme: "white",
    tags: ["GSAP", "OGL"],
    category: "digital",
    media: {
      video: vid("projects/photo-collage/demo1"),
      poster: "/projects/photo-collage/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://photo-collage-reveal.vercel.app/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004344350034309212?s=20",
      },
    ],
  },
  {
    id: "gravity-text",
    size: "tall",
    theme: "white",
    tags: ["Creative Coding", "Three.js"],
    category: "digital",
    media: {
      iframe: "https://gravity-text.vercel.app",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://gravity-text.vercel.app",
      },
    ],
  },
  {
    id: "neumorphic-buttons",
    size: "short",
    theme: "white",
    tags: ["React", "Interaction Design"],
    category: "digital",
    media: {
      video: vid("projects/buttons/demo"),
      poster: "/projects/buttons/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://neumorphic-buttons-psi.vercel.app/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2004346763373871338?s=20",
      },
    ],
  },
  {
    id: "five-identical-fishes",
    size: "short",
    theme: "white",
    tags: ["Fabrication", "Woodworking"],
    category: "physical",
    media: {
      video: vid("projects/five-fishes/demo"),
      poster: "/projects/five-fishes/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View Portfolio Deck",
        url: "https://docs.google.com/presentation/d/1n0bsMJ6bRc6EFrK3dV13DUeooROi32we/edit?usp=sharing&ouid=100755772065646129206&rtpof=true&sd=true",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-2-5x1-1145b3e7f9e7803283e2fa835c9638e6?source=copy_link",
      },
    ],
  },
  {
    id: "cat-figurine",
    size: "short",
    theme: "white",
    tags: ["Fabrication", "Woodworking"],
    category: "physical",
    media: {
      video: vid("projects/cat-figurine/demo"),
      poster: "/projects/cat-figurine/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View Portfolio Deck",
        url: "https://docs.google.com/presentation/d/1n0bsMJ6bRc6EFrK3dV13DUeooROi32we/edit?usp=sharing&ouid=100755772065646129206&rtpof=true&sd=true",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-5-Clay-Wood-Cat-Figurine-1185b3e7f9e7805b98dcf7b4eee1da9c?source=copy_link",
      },
    ],
  },
  {
    id: "reflections-of-monet",
    size: "short",
    theme: "white",
    tags: ["Web Art", "Interaction Design"],
    category: "digital",
    media: {
      video: vid("projects/monet/demo"),
      poster: "/projects/monet/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://bevyip.github.io/reflections-of-monet/",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-7-1cb5b3e7f9e780cf84a3e28e81f5a15d?source=copy_link",
      },
    ],
  },
  {
    id: "puzzle-feeder",
    size: "short",
    theme: "white",
    tags: ["Fabrication", "Laser Cutting"],
    category: "physical",
    media: {
      video: vid("projects/puzzle-feeder/demo"),
      poster: "/projects/puzzle-feeder/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View Portfolio Deck",
        url: "https://docs.google.com/presentation/d/1n0bsMJ6bRc6EFrK3dV13DUeooROi32we/edit?usp=sharing&ouid=100755772065646129206&rtpof=true&sd=true",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-3-Laser-Cut-Join-1145b3e7f9e780f1ab86e927967316d6?source=copy_link",
      },
    ],
  },
  {
    id: "temple-of-fortune",
    size: "short",
    theme: "black",
    tags: ["Arduino", "Unity"],
    category: "physical",
    media: {
      image: "/projects/temple-of-fortune/thumbnail.jpg",
    },
    actions: [
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://www.notion.so/bevyip/Week-14-Temple-of-Fortune-Part-III-1525b3e7f9e78005a897f7a5340ac84f?source=copy_link#1585b3e7f9e7805999e8dd3bec708acek",
      },
    ],
  },
  {
    id: "whack-a-mouse",
    size: "short",
    theme: "white",
    tags: ["Fabrication", "Laser Cutting"],
    category: "physical",
    media: {
      video: vid("projects/whack-a-mouse/demo"),
      poster: "/projects/whack-a-mouse/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View Portfolio Deck",
        url: "https://docs.google.com/presentation/d/1n0bsMJ6bRc6EFrK3dV13DUeooROi32we/edit?usp=sharing&ouid=100755772065646129206&rtpof=true&sd=true",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-4-Enclosure-1145b3e7f9e7802fb6b6edab318c4214?source=copy_link",
      },
    ],
  },
  {
    id: "words-unseen",
    size: "tall",
    theme: "white",
    tags: ["Web Art", "Creative Coding"],
    category: "digital",
    media: {
      video: vid("projects/words-unseen/demo"),
      poster: "/projects/words-unseen/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://bevyip.github.io/words-unseen/",
      },
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://www.notion.so/bevyip/Week-11-1a45b3e7f9e78021bc7bd8de9c02eaa5",
      },
      {
        type: "github",
        tooltip: "View Code",
        url: "https://github.com/bevyip/words-unseen",
      },
    ],
  },
  {
    id: "picture-distortion",
    size: "tall",
    theme: "white",
    tags: ["React", "Creative Coding"],
    category: "digital",
    media: {
      video: vid("v1775166287/picture-demo_xy11bg"),
      poster: "/projects/picture-distortion/poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://picture-distortion.vercel.app/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2011731823676801478?s=20",
      },
    ],
  },
  {
    id: "binary-pool",
    size: "tall",
    theme: "white",
    tags: ["Creative Coding", "Interactive"],
    category: "digital",
    media: {
      iframe: "https://binary-pool.vercel.app",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://binary-pool.vercel.app",
      },
    ],
  },
  {
    id: "ascii-filter",
    size: "tall",
    theme: "white",
    tags: ["React", "Creative Coding"],
    category: "digital",
    media: {
      video: vid("v1775109597/ascii-filter_sjfgw1"),
      poster: "/projects/ascii-filter/thumbnail-poster.jpg",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://ascii-filter-weld.vercel.app/",
      },
      {
        type: "X",
        tooltip: "View on X",
        url: "https://x.com/bevdesigns/status/2039584760872272200?s=20",
      },
    ],
  },
  {
    id: "sticker-cats",
    size: "tall",
    theme: "white",
    tags: ["GSAP", "Interactive"],
    category: "digital",
    media: {
      iframe: "https://sticker-cats.vercel.app",
    },
    actions: [
      {
        type: "live",
        tooltip: "View App",
        url: "https://sticker-cats.vercel.app",
      },
    ],
  },
  {
    id: "starry-night",
    size: "short",
    theme: "white",
    tags: ["P5.js", "Creative Coding"],
    category: "digital",
    media: {
      iframe: "https://editor.p5js.org/bevyip/embed/M3nIH2bcE",
    },
    actions: [
      {
        type: "notion",
        tooltip: "View Documentation",
        url: "https://bevyip.notion.site/Week-9-12f5b3e7f9e780078522ea5905ee81f1?source=copy_link",
      },
    ],
  },
];

// Work / case-study cards. Archived entries stay in the file and keep their
// routes, but are omitted from the combined homepage grid.

export const workProjects = [
  {
    id: "confido-approval-flow",
    title: "Rebuilding Confido's Approval Flow",
    role: "Design Engineer",
    tags: ["Design Systems", "Enterprise Software"],
    summary:
      "Redesigning approval workflows with smarter logic and clearer audit trails for improved enterprise usability.",
    video: "/work/confido/thumbnail.mp4",
    thumbnailImage: "/work/confido/thumbnail-frame.jpg",
    category: "case-study",
    filter: "product-design",
  },
  {
    id: "dandi-bio-smart-wearable",
    title: "Dandi: A Bio-Smart Wearable for PCOS",
    role: "Product Designer & Engineer",
    tags: ["Wearable", "Women's Health"],
    summary:
      "Making hormonal health accessible for women through emotionally-resonant design and real-time biosensing.",
    video: "/work/dandi/thumbnail.mp4",
    thumbnailImage: "/work/dandi/thumbnail-frame.png",
    category: "case-study",
    awardLine: "🏅 Most Impact Winner – FigBuild 2026",
    filter: "product-design",
  },
  {
    id: "moodle-pain-detection",
    title: "Moodle: AI-Powered Feline Pain Detection for Cat Owners",
    role: "Product Designer",
    tags: ["UX Research", "AI/ML"],
    summary:
      "Making clinical-grade pain monitoring accessible to cat owners through intuitive mobile design and privacy-first AI.",
    video: "/work/moodle/thumbnail.mp4",
    thumbnailImage: "/work/moodle/thumbnail-frame.jpg",
    category: "case-study",
    filter: "product-design",
    archived: true,
  },
  {
    id: "venmo-privacy-controls",
    title: "Redesigning Venmo's Privacy Controls",
    role: "Product Designer",
    tags: ["UX Research", "FinTech"],
    summary:
      "Transforming Venmo's public-by-default privacy model to help users make informed choices without confusion.",
    video: "/work/venmo/thumbnail.mp4",
    thumbnailImage: "/work/venmo/thumbnail-frame.jpg",
    category: "case-study",
    filter: "product-design",
    archived: true,
  },
];

export const workRouteMap = {
  "venmo-privacy-controls": "/venmo",
  "moodle-pain-detection": "/moodle",
  "confido-approval-flow": "/confido",
  "dandi-bio-smart-wearable": "/dandi",
};

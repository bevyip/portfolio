const ExperienceArrow = () => {
  return (
    <svg
      width="120"
      height="100"
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrow-left"
          markerWidth="15"
          markerHeight="16"
          refX="15"
          refY="8"
          orient="auto"
        >
          {/* Arrow pointing left - tip on right, arms extend left with wider V */}
          <path
            d="M 0 0 L 15 8 L 0 16"
            fill="none"
            stroke="#fafafa"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Main curved line with marker attached */}
      <path
        id="experience-arrow-path"
        d="M110 10C110 75 50 85 10 76"
        stroke="#fafafa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd="url(#arrow-left)"
        style={{ vectorEffect: "non-scaling-stroke" }}
      />
    </svg>
  );
};

export default ExperienceArrow;

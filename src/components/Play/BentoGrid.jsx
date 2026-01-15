import React from "react";
import BentoItem from "./BentoItem";
import { playProjects } from "../../data/playProjects";

const BentoGrid = ({ onProjectClick }) => {
  return (
    <div
      className="
        grid
        grid-cols-1
        min-[1026px]:grid-cols-3
        gap-4
        w-full
        auto-rows-[480px]
        min-[1026px]:auto-rows-[220px]
      "
      style={{ gridAutoFlow: "row dense" }}
    >
      {playProjects.map((project, index) => (
        <BentoItem
          key={project.id}
          project={project}
          onClick={onProjectClick}
          columnIndex={(index % 3) + 1}
        />
      ))}
    </div>
  );
};

export default BentoGrid;

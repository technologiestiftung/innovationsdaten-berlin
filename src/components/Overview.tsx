import React from "react";
import chapters from "../data/chapters.json";

const Overview: React.FC = () => {
  return (
    <>
      <h2 className="mb-4">Übersicht</h2>
      <div id="overview" className="grid gap-2 md:grid-cols-2">
        {chapters.map((chapter) => (
          <a
            key={chapter.link}
            href={`#${chapter.link}`}
            className={`border-blue flex cursor-pointer items-center justify-center overflow-hidden border-2 p-2 wrap-break-word break-all dark:border-white`}
          >
            <p className="bold large text-center">{chapter.title}</p>
          </a>
        ))}
      </div>
    </>
  );
};

export default Overview;

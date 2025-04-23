import React, { useRef } from "react";
import Overview from "../components/Overview";
import wordings from "../data/wordings.json";

const Welcome: React.FC = () => {
  const selfRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="welcome"
      className="sticky-section relative mt-24 grid h-[calc(100vh-6rem)] w-full grid-cols-1 gap-6 px-20 md:mt-0 md:grid-cols-2"
    >
      <div ref={selfRef} className="flex items-center">
        <div className="w-full">
          <Overview />
        </div>
      </div>
      <div className="flex items-center">
        <div
          className={`card border-blue dark:bg-dark border-2 bg-white p-6 dark:border-white`}
        >
          <h2 className="mb-4">{wordings.welcome_title}</h2>
          <p>{wordings.welcome_text}</p>
        </div>
      </div>
    </section>
  );
};

export default Welcome;

import React, { useRef } from "react";
import wordings from "../data/wordings.json";

type DataToggleProps = {
  data: string;
  setData: (value: string) => void;
  allDatas: string[];
};

const DataToggle: React.FC<DataToggleProps> = ({ data, setData, allDatas }) => {
  const SingleToggleButton = ({ item }: { item: string }) => {
    const titleRef = useRef<HTMLParagraphElement>(null);
    return (
      <div
        onClick={() => setData(item)}
        className={`${data === item ? "bg-blue dark:text-dark text-white dark:bg-white" : "text-blue dark:bg-dark bg-white dark:text-white"} flex cursor-pointer items-center justify-center px-2 md:px-4`}
      >
        <p
          ref={titleRef}
          className="box-border flex w-28 justify-center p-2 text-center font-bold text-wrap break-words text-clip hyphens-auto md:min-w-32 md:font-bold"
        >
          {wordings[item as keyof typeof wordings]}
        </p>
      </div>
    );
  };

  return (
    <div
      className={`border-blue text-blue relative flex max-w-full border-2 dark:border-white`}
    >
      {allDatas.map((item, index) => (
        <SingleToggleButton key={index} item={item} />
      ))}
    </div>
  );
};

export default DataToggle;

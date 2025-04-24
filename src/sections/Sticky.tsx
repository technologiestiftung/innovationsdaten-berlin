import data from "../data/data.json";
import React, { useEffect, useState } from "react";
import { ChapterKeys, StickyItem } from "../types/global";
import Card from "../components/Card";
import LeftStickyContent from "../components/LeftStickyContent";

type StickyProps = {
  dataKey: ChapterKeys;
};

const Sticky: React.FC<StickyProps> = ({ dataKey }) => {
  const typedData = data as Record<ChapterKeys, StickyItem[]>;
  const dataArray = typedData[dataKey];
  const [current, setCurrent] = useState<StickyItem | null>(null);

  useEffect(() => {
    if (dataArray) {
      setCurrent(dataArray[0] as StickyItem);
    }
  }, [dataArray]);

  return (
    <section
      id={dataKey}
      className="sticky-section relative grid w-full grid-cols-3 gap-6 px-4 md:grid-cols-5 md:px-20"
    >
      <div className="top-24 col-span-3 flex hidden h-[calc(100vh-var(--header-height))] items-center md:sticky md:block">
        <div className="flex h-full w-full flex-col justify-center">
          <LeftStickyContent data={current as StickyItem} />
        </div>
      </div>
      <div className="dark:bg-dark z-9 col-span-3 flex flex-col gap-8 bg-white md:col-span-2">
        {dataArray.map((item: StickyItem, index: number) => (
          <>
            <div className="block w-full md:hidden">
              <LeftStickyContent data={item} />
            </div>
            <Card
              key={item.id}
              dataKey={dataKey}
              title={item.title}
              displayNumber={item.displayNumber}
              text={item.text}
              onSetCurrent={() => setCurrent(item as StickyItem)}
              isNotCurrent={item.id !== current?.id}
              last={index === dataArray.length - 1}
              first={!index}
            />
          </>
        ))}
      </div>
    </section>
  );
};

export default Sticky;

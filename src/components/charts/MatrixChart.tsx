import React, { useEffect, useRef, useState } from "react";
import wordings from "../../data/wordings.json";
import branchen from "../../data/branchen.json";
import { useGlobalContext } from "../../GlobalContext";
import DataToggle from "../DataToggle";
import { Region } from "../../types/global";
import { LazySvg } from "../LazySVG";

type MatrixData = {
  x: string;
  y: string;
  value: number;
}[];

type MatrixChartProps = {
  data: MatrixData;
};

function getMinMax(data: MatrixData): { min: number; max: number } {
  if (data.length === 0) {
    return { min: 0, max: 0 };
  }
  let min = data[0].value;
  let max = data[0].value;
  data.forEach(({ value }) => {
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  });
  return { min, max };
}

const ValueCell = ({
  x,
  y,
  value,
  minValue,
  maxValue,
}: {
  x: string;
  y: string;
  value: number;
  minValue: number;
  maxValue: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  let widthPct: string;
  if (maxValue === minValue) {
    widthPct = value > 0 ? "100%" : "0%";
  } else {
    widthPct = `${((value - minValue) / (maxValue - minValue)) * 100}%`;
  }

  const tooltipPos = [
    "own_region",
    "different_regions_in_germany",
    "eu_foreign",
  ].includes(y)
    ? "top-full -translate-x-1/2 mt-2"
    : "bottom-full -translate-x-1/2 mb-2";

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-1 items-center justify-center">
      <div
        className="flex aspect-square w-full cursor-pointer items-center justify-center border border-gray-300 dark:border-gray-600"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen((o) => !o)}
      >
        <div
          className="bg-blue aspect-square w-full dark:bg-white"
          style={{ width: widthPct }}
        />
      </div>
      {isOpen && (
        <div
          className={`bg-blue absolute left-1/2 z-10 w-[300px] p-4 text-white select-none dark:bg-white dark:text-gray-900 ${tooltipPos}`}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center">
            <p className="mb-4 font-bold">
              {branchen.find((b) => b.id === x)?.name || y.toUpperCase()}
            </p>
            <LazySvg name="sort" className="fill-current" />
            <p
              className="my-4 text-center font-bold"
              dangerouslySetInnerHTML={{
                __html: wordings[y as keyof typeof wordings] || y,
              }}
            />
          </div>
          <div className="h-[2px] w-full bg-white dark:bg-gray-900" />
          <div className="mt-4 flex items-end justify-between gap-6">
            <p
              className="text-left"
              dangerouslySetInnerHTML={{
                __html: `${wordings[y as keyof typeof wordings] || y}:`,
              }}
            />
            <p className="min-w-[50px] text-right font-bold">{value} %</p>
          </div>
        </div>
      )}
    </div>
  );
};

const MatrixChart: React.FC<MatrixChartProps> = ({ data }) => {
  const { region, setRegion } = useGlobalContext();
  const { min: minValue, max: maxValue } = React.useMemo(
    () => getMinMax(data || []),
    [data],
  );
  const xLabels = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.x))),
    [data],
  );
  const yLabels = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.y))),
    [data],
  );

  if (!data.length) {
    return (
      <h4 className="p-4 text-center">
        Matrix Chart data is missing or empty.
      </h4>
    );
  }

  return (
    <>
      <div className="">
        {/* Header Row */}
        <div className="flex">
          <div className="w-32" />
          {xLabels.map((x) => (
            <div key={x} className="flex flex-1 items-end justify-center pb-2">
              <LazySvg
                name={x}
                className="fill-blue size-3 md:size-6 dark:fill-white"
              />
            </div>
          ))}
        </div>
        {/* Data Rows */}
        {yLabels.map((y) => (
          <div key={y} className="flex items-center">
            <div
              className="text-blue w-32 pr-2 text-right text-xs dark:text-white"
              dangerouslySetInnerHTML={{
                __html: wordings[y as keyof typeof wordings] || y,
              }}
            />
            {xLabels.map((x) => {
              const cell = data.find((d) => d.x === x && d.y === y);
              return (
                <ValueCell
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  value={cell?.value || 0}
                  minValue={minValue}
                  maxValue={maxValue}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Toggle */}
      <div className="4 mt-8 flex items-center justify-end gap-4">
        <DataToggle
          data={region}
          setData={(value: string) => setRegion(value as Region)}
          allDatas={["ber", "de"]}
        />
      </div>
    </>
  );
};

export default MatrixChart;

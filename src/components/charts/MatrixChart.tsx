import React, { useEffect, useRef, useState } from "react";
import wordings from "../../data/wordings.json";
import colors from "../../data/colors.json";
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

const sanitize = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

function getMinMax(data: MatrixData): { min: number; max: number } {
  if (data.length === 0) {
    throw new Error("Data array is empty");
  }

  let min = data[0].value;
  let max = data[0].value;

  for (const { value } of data) {
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  }

  return { min, max };
}

const MatrixChart: React.FC<MatrixChartProps> = ({ data }) => {
  const { theme, region, setRegion } = useGlobalContext();
  const [maxValue, setMaxValue] = React.useState(0);
  const [minValue, setMinValue] = React.useState(0);
  const xLabels = data ? Array.from(new Set(data.map((d) => d.x))) : [];
  const yLabels = data ? Array.from(new Set(data.map((d) => d.y))) : [];

  const templateAreas = [
    [".", ...xLabels.map((x) => `x_${sanitize(x)}`)],
    ...yLabels.map((y) => [
      `y_${sanitize(y)}`,
      ...xLabels.map((x) => `cell_${sanitize(x)}_${sanitize(y)}`),
    ]),
  ]
    .map((row) => `"${row.join(" ")}"`)
    .join("\n");

  const getWidth = (self: number) => {
    return `${((self - minValue) / (maxValue - minValue)) * 100}%`;
  };

  const ValueCell = ({
    x,
    y,
    value,
  }: {
    x: string;
    y: string;
    value: number;
    index: number;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selfRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selfRef.current &&
          !selfRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
      <div
        ref={selfRef}
        className={`matrix-cell value-cell relative flex items-center justify-center ${theme}`}
        style={{ gridArea: `cell_${sanitize(x)}_${sanitize(y)}` }}
      >
        <div
          className={`inner-value-cell flex cursor-pointer items-center justify-center ${theme}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen(true)}
        >
          <div
            className={`inner-value-cell-child ${theme}`}
            style={{ width: getWidth(value) }}
          />
        </div>
        {isOpen && (
          <div
            className={`tooltip p-4 select-none ${theme} ${y === "own_region" || y === "different_regions_in_germany" || y === "eu_foreign" ? "below" : "above"}`}
          >
            <div className="flex flex-col items-center">
              <p
                className="bold mb-4"
                style={{
                  color: theme === "dark" ? colors.dark : colors.white,
                }}
              >
                {branchen.find((findBranche: any) => findBranche.id === x)
                  ?.name || y.toUpperCase()}{" "}
              </p>
              <LazySvg name="sort" />
              <p
                className="bold my-4"
                style={{
                  color: theme === "dark" ? colors.dark : colors.white,
                }}
                // @refactor
                dangerouslySetInnerHTML={{
                  __html: wordings[y as keyof typeof wordings],
                }}
              />
            </div>
            <div className="placeholder w-full" />
            <div className="mt-4 flex items-end justify-between gap-6">
              {wordings[y as keyof typeof wordings] && (
                <p
                  className="text-left"
                  style={{
                    color: theme === "dark" ? colors.dark : colors.white,
                  }}
                  // @refactor
                  dangerouslySetInnerHTML={{
                    __html: `${wordings[y as keyof typeof wordings]}:`,
                  }}
                />
              )}
              <p
                className="bold min-w-[50px]"
                style={{
                  color: theme === "dark" ? colors.dark : colors.white,
                }}
              >
                {value} %
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (data) {
      const { min, max } = getMinMax(data);
      setMinValue(min);
      setMaxValue(max);
    }
  }, [data]);

  if (!data) {
    return <h4>Matrix Chart Data missing</h4>;
  }

  return (
    <>
      <div
        className={`matrix-grid ${theme}`}
        style={{
          display: "grid",
          gridTemplateAreas: templateAreas,
        }}
      >
        {/* X Labels */}
        {xLabels.map((x) => (
          <div
            key={x}
            className="matrix-cell label-x flex items-center justify-center"
            style={{ gridArea: `x_${sanitize(x)}` }}
          >
            <LazySvg name={x} />
          </div>
        ))}

        {/* Y Labels */}
        {yLabels.map((y) => (
          <div
            key={y}
            className="matrix-cell label-y flex items-center"
            style={{ gridArea: `y_${sanitize(y)}` }}
          >
            <p
              className="small"
              // @refactor
              dangerouslySetInnerHTML={{
                __html: wordings[y as keyof typeof wordings],
              }}
            />
          </div>
        ))}

        {/* Values */}
        {data.map(({ x, y, value }, index) => (
          <ValueCell
            key={`${x}-${y}`}
            x={x}
            y={y}
            value={value}
            index={index}
          />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-end gap-8">
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

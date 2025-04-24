import React from "react";
import branchen from "../../data/branchen.json";
import { BranchenItem } from "../../types/global";
import { LazySvg } from "../LazySVG";

const BranchenList: React.FC = () => {
  const DisplayBranche = ({ branche }: { branche: BranchenItem }) => {
    return (
      <div
        className="flex items-center gap-3 px-5 py-2"
        style={{ backgroundColor: branche.color }}
      >
        <LazySvg name={branche.id} className="size-6" />
        <p className="ignore bold line-clamp-1 break-words text-white">
          {branche.name}
        </p>
      </div>
    );
  };
  return (
    <>
      <h3 className="mb-2">Industrie</h3>
      <div className="flex flex-wrap gap-2">
        {branchen
          .filter((branche) => branche.sektor_id === "industrie")
          .map((branche) => (
            <DisplayBranche key={branche.id} branche={branche} />
          ))}
      </div>
      <h3 className="mt-8 mb-2">Dienstleistung</h3>
      <div className="flex flex-wrap gap-2">
        {branchen
          .filter((branche) => branche.sektor_id === "dienstleistungen")
          .map((branche) => (
            <DisplayBranche key={branche.id} branche={branche} />
          ))}
      </div>
    </>
  );
};

export default BranchenList;

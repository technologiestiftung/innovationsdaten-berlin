import React, { useEffect, useRef, useState } from "react";
import branchen from "../data/branchen.json";
import sektoren from "../data/sektoren.json";
import Chevron from "../assets/chevron.svg?react";
import Checked from "../assets/checked.svg?react";
import Unchecked from "../assets/unchecked.svg?react";
import wordings from "../data/wordings.json";
import { dataKeys } from "../types/global";
import { LazySvg } from "./LazySVG";

interface DropdownProps {
  type: "filter" | "sort";
  allFilters?: string[];
  activeFilters?: string[] | null;
  setFilters?: React.Dispatch<React.SetStateAction<string[] | null>>;
  activeFilter?: string;
  setActiveFilter?: React.Dispatch<React.SetStateAction<string | null>>;
  sortsAfter?: dataKeys[];
  sortBy?: string | null;
  setSortBy?: (value: string | null) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  type,
  allFilters,
  activeFilters,
  setFilters,
  activeFilter,
  setActiveFilter,
  sortsAfter,
  sortBy,
  setSortBy,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const allIndustrieBranchen: string[] = branchen
    .filter((branche) => branche.sektor_id === "industrie")
    .map((branche) => branche.id);
  const allDienstleistungenBranchen: string[] = branchen
    .filter((branche) => branche.sektor_id === "dienstleistungen")
    .map((branche) => branche.id);

  const setName = () => {
    if (
      type === "filter" &&
      allFilters?.includes("insgesamt") &&
      activeFilter
    ) {
      return activeFilter;
    }
    if (type === "filter") {
      return "Branche wählen";
    }
    if (type === "sort" && sortBy) {
      return wordings[sortBy as keyof typeof wordings] || sortBy;
    }
    return "Sortieren nach";
  };

  const toggleFilter = (filter: string) => {
    if (allFilters?.includes("insgesamt")) {
      return setActiveFilter?.(filter);
    }
    const updatedFilters = activeFilters?.includes(filter)
      ? activeFilters?.filter((f) => f !== filter)
      : [...(activeFilters || []), filter];
    if (setFilters) {
      return setFilters(updatedFilters);
    }
    return null;
  };

  const toggleAll = () => {
    if (!setFilters) {
      return;
    }
    if (activeFilters?.length === allFilters?.length) {
      setFilters([]);
    } else {
      setFilters(allFilters || []);
    }
    return;
  };

  const checkForAllSektorChecked = (id: string) => {
    let allSektorsChecked = true;
    branchen.forEach((branche) => {
      if (branche.sektor_id === id && !activeFilters?.includes(branche.id)) {
        allSektorsChecked = false;
      }
    });
    return allSektorsChecked;
  };

  const toggleSektor = (id: string) => {
    if (checkForAllSektorChecked(id)) {
      if (id === "industrie") {
        const newFilters = activeFilters?.filter(
          (singleFilter) => !allIndustrieBranchen.includes(singleFilter),
        );
        if (setFilters) {
          setFilters(newFilters || []);
        }
      } else {
        const newFilters = activeFilters?.filter(
          (singleFilter) => !allDienstleistungenBranchen.includes(singleFilter),
        );
        if (setFilters) {
          setFilters(newFilters || []);
        }
      }
      return;
    }
    if (id === "industrie") {
      const newFilters = activeFilters?.filter(
        (singleFilter) => !allIndustrieBranchen.includes(singleFilter),
      );
      if (setFilters) {
        setFilters([...(newFilters || []), ...allIndustrieBranchen]);
      }
    } else {
      const newFilters = activeFilters?.filter(
        (singleFilter) => !allDienstleistungenBranchen.includes(singleFilter),
      );
      if (setFilters) {
        setFilters([...(newFilters || []), ...allDienstleistungenBranchen]);
      }
    }
    return;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`drop-down relative inline-block`}>
      <div className="flex items-center gap-4">
        <div className="">
          <LazySvg name={type} className="fill-blue dark:fill-white" />
        </div>
        <div className="relative flex w-24 min-w-[210px] md:w-42">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border-blue flex w-24 min-w-[210px] cursor-pointer items-center justify-between gap-4 border-2 px-4 py-2 md:w-42 dark:border-white"
          >
            <p className="bold text-left select-none first-letter:capitalize">
              {setName()}
            </p>
            <Chevron
              name="chevron"
              className={`size-4 ${isOpen && "rotate-180"} fill-blue transform transition-all dark:fill-white`}
            />
          </button>
          {isOpen && (
            <div className="border-blue dark:bg-dark absolute bottom-10 z-10 w-24 w-42 min-w-[210px] border-2 border-b-0 bg-white p-4 dark:border-white">
              <ul className="overflow-y-auto">
                {type === "filter" && (
                  <>
                    {!allFilters?.includes("insgesamt") && (
                      <>
                        <li
                          className="flex cursor-pointer items-center p-2"
                          onClick={toggleAll}
                        >
                          <span className="mr-2 min-w-4">
                            {activeFilters?.length === allFilters?.length ? (
                              <Checked className="fill-blue" name="checked" />
                            ) : (
                              <Unchecked
                                className="fill-blue"
                                name="unchecked"
                              />
                            )}
                          </span>
                          <p className="bold select-none">Alle</p>
                        </li>
                        {sektoren.map((sektor) => (
                          <li
                            key={sektor.id}
                            className="flex cursor-pointer items-center p-2"
                            onClick={() => toggleSektor(sektor.id)}
                          >
                            <span className="mr-2 min-w-4">
                              {checkForAllSektorChecked(sektor.id) ? (
                                <Checked className="fill-blue" name="checked" />
                              ) : (
                                <Unchecked
                                  className="fill-blue"
                                  name="unchecked"
                                />
                              )}
                            </span>
                            <p className="bold select-none">{sektor.name}</p>
                          </li>
                        ))}

                        <hr />
                      </>
                    )}

                    {allFilters?.map(
                      (filter) =>
                        filter && (
                          <li
                            key={filter}
                            className="flex cursor-pointer items-center p-2"
                            onClick={() => toggleFilter(filter)}
                          >
                            {activeFilters?.includes(filter) ||
                            filter === activeFilter ? (
                              <Checked
                                className="fill-blue mr-2 min-w-4 dark:fill-white"
                                name="checked"
                              />
                            ) : (
                              <Unchecked
                                className="fill-blue mr-2 min-w-4 dark:fill-white"
                                name="unchecked"
                              />
                            )}
                            <p className="line-clamp-1 break-words select-none first-letter:capitalize">
                              {branchen.find((branche) => branche.id === filter)
                                ?.name || filter}
                            </p>
                          </li>
                        ),
                    )}
                  </>
                )}
                {type === "sort" && sortsAfter && (
                  <>
                    {sortsAfter.map((item: string) => (
                      <li
                        key={item}
                        className="flex cursor-pointer items-center p-2"
                        onClick={() => {
                          if (setSortBy) {
                            setSortBy(item);
                            setIsOpen(false);
                          }
                        }}
                      >
                        <span className="mr-2">
                          <LazySvg
                            className="fill-blue mr-2 dark:fill-white"
                            name={sortBy === item ? "checked" : "unchecked"}
                          />
                        </span>
                        {wordings[item as keyof typeof wordings] && (
                          <p className="bold line-clamp-1 break-words select-none">
                            {wordings[item as keyof typeof wordings]}
                          </p>
                        )}
                      </li>
                    ))}
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;

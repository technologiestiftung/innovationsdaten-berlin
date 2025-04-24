import React, { useEffect, useRef } from "react";
import { isInRange } from "../utilities";

type CardProps = {
  dataKey: string;
  title: string;
  displayNumber?: string;
  text?: string;
  onSetCurrent: () => void;
  isNotCurrent: boolean;
  last: boolean;
  first: boolean;
};

const Card: React.FC<CardProps> = ({
  dataKey,
  title,
  displayNumber,
  text,
  onSetCurrent,
  isNotCurrent,
  last,
  first,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      if (
        (isInRange(rect.top - window.innerHeight / 2) ||
          isInRange(rect.bottom - window.innerHeight / 2)) &&
        isNotCurrent
      ) {
        onSetCurrent();
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (last || first) {
      const getCard = document.querySelector(
        last
          ? `#${dataKey} .card:last-of-type`
          : `#${dataKey} .card:first-of-type`,
      );
      if (!getCard) {
        return;
      }
    }
    if (dataKey === "welcome") {
      const getCard = document.querySelector(
        last
          ? `#${dataKey} .card:last-of-type`
          : `#${dataKey} .card:first-of-type`,
      );
      if (!getCard) {
        return;
      }
    }
  }, []);
  return (
    <div
      ref={cardRef}
      className={`card border-blue dark:bg-dark border-2 bg-white p-6 break-words hyphens-auto md:mt-[calc((100vh-var(--header-height))/2)] md:mb-[calc((100vh-var(--header-height))/2)] dark:border-white`}
      // style={{
      // 	marginTop: getMarginTop(),
      // 	marginBottom: getMarginBottom(),
      // }}
    >
      {typeof window !== "undefined" && displayNumber && (
        <h4>{displayNumber}</h4>
      )}
      {/* @refactor: hypens & break-words for title */}
      <h2 className="text-wrap">{title}</h2>
      <p className="mt-4">{text}</p>
    </div>
  );
};

export default Card;

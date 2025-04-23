import React, { useState } from "react";
import Chevron from "../assets/chevron.svg?react";
import Moon from "../assets/moon.svg?react";
import Sun from "../assets/sun.svg?react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";
import InnoDatenLogo from "../assets/innodaten_logo_wording.svg?react";
const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    chapter: globalChapter,
    setChapter,
  } = useGlobalContext();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <header
        className={`dark:bg-dark border-blue fixed top-0 left-0 z-11 flex h-24 w-screen items-center justify-between border-b-2 bg-white px-6 py-6 md:px-48 dark:border-white`}
      >
        <div
          onClick={() => window.scrollTo(0, 0)}
          className="cursor-pointer dark:text-white"
        >
          <InnoDatenLogo className="fill-blue size-64 h-full dark:fill-white" />
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-8">
            <div
              className="flex cursor-pointer items-center gap-4"
              onClick={() => setOpen(!open)}
              onMouseEnter={() => setOpen(true)}
            >
              <h4>{globalChapter}</h4>
              <div className={`${open && "rotate-180"}`}>
                <Chevron className="fill-blue size-6 dark:fill-white" />
              </div>
            </div>
          </div>
          <div className={`cursor-pointer`} onClick={toggleTheme}>
            {(theme === "dark" && (
              <Sun className="fill-blue size-8 dark:fill-white" />
            )) || <Moon className="fill-blue size-8 dark:fill-white" />}
          </div>
        </div>
      </header>
      {open && (
        <div className="dark:bg-dark border-blue fixed top-24 z-12 mt-24 flex h-[calc(100vh-6rem)] w-full flex-col items-center justify-start border-t-0 bg-white px-12 py-6 text-left md:top-23.5 md:right-48 md:mt-0 md:h-auto md:w-auto md:border-2 dark:border-white">
          <ul
            className={`space-y-4 md:space-y-2`}
            onMouseLeave={() => setOpen(false)}
          >
            {chapters.map((chapter) => (
              <li key={chapter.link}>
                <a
                  href={`#${chapter.link}`}
                  onClick={() => {
                    setChapter(chapter.title);
                    setOpen(false);
                  }}
                >
                  <h4
                    className={`select-none ${globalChapter === chapter.title ? "underline" : ""}`}
                  >
                    {chapter.title}
                  </h4>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;

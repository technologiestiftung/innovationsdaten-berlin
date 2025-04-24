import React, { useEffect, useState } from "react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

interface NavProps {
  link: string;
  title: string;
}

const Menu: React.FC = () => {
  const { chapter, setChapter } = useGlobalContext();

  const NavStep: React.FC<NavProps> = ({ link, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mouseIn, setMouseIn] = useState(false);

    const scrollToIdWithOffset = (id: string, offset: number = 2) => {
      const element = document.getElementById(id);
      if (element) {
        const top =
          element.getBoundingClientRect().top + window.pageYOffset + offset;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    };

    const handleScroll = () => {
      const element = document.getElementById(link);
      if (window.pageYOffset < window.innerHeight) {
        setChapter("Willkommen");
      } else if (element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.pageYOffset;
        const bottom = top + rect.height;
        const isInRange =
          window.pageYOffset >= top && window.pageYOffset <= bottom;
        if (isInRange && chapter !== title) {
          setChapter(title);
        }
      }
    };

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <a
        onMouseEnter={() => {
          setIsOpen(true);
          setMouseIn(true);
        }}
        onMouseLeave={() => {
          setIsOpen(false);
          setMouseIn(false);
        }}
        className={`border-blue relative flex size-4 cursor-pointer items-center border-2 md:size-6 dark:border-white ${
          isOpen || chapter === title
            ? "bg-blue dark:bg-white"
            : "dark:bg-dark bg-white"
        }`}
        onClick={() => scrollToIdWithOffset(link)}
      >
        {(isOpen || mouseIn) && (
          <div
            className={`bg-blue dark:text-dark absolute top-1/2 right-full mr-2 -translate-y-1/2 p-2 whitespace-nowrap text-white dark:bg-white`}
          >
            <p className="bold">{title}</p>
          </div>
        )}
      </a>
    );
  };

  return (
    <nav className="fixed top-1/2 right-10 z-10 flex -translate-y-1/2 flex-col gap-2">
      {chapters.map((mapChapter) => (
        <NavStep
          key={mapChapter.link}
          link={mapChapter.link}
          title={mapChapter.title}
        />
      ))}
    </nav>
  );
};

export default Menu;

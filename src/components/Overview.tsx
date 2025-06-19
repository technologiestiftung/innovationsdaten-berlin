import React from "react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

const Overview: React.FC = () => {
	const { theme, isMobile } = useGlobalContext();
	return (
		<>
			{/* <h2 className="mb-4">Übersicht</h2> */}
			<div
				id="overview"
				className={`grid gap-2 max-w-[900px] ${isMobile ? "" : "grid-cols-2"}`}
			>
				{chapters
					.filter((chapter) => chapter.link !== "einleitung")
					.map((chapter) => (
						<a
							key={chapter.link}
							href={`#${chapter.link}`}
							className={`p-2 ${theme}`}
						>
							<p className="bold text-center">{chapter.title}</p>
						</a>
					))}
			</div>
		</>
	);
};

export default Overview;

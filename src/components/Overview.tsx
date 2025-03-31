import React from "react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

const Overview: React.FC = () => {
	const { theme } = useGlobalContext();
	return (
		<>
			<h2 className="mb-4">Übersicht</h2>
			<div id="overview" className="grid grid-cols-2 gap-2">
				{chapters.map((chapter) => (
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

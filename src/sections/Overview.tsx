import React from "react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

const Overview: React.FC = () => {
	const { theme } = useGlobalContext();
	return (
		<section id="overview" className="py-14">
			<h1 className="mb-4">Übersicht</h1>
			<p className="mb-14">
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
				eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
				clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
				amet. Lorem
			</p>
			<div className="grid grid-cols-2 gap-2">
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
		</section>
	);
};

export default Overview;

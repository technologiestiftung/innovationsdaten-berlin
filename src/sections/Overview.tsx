import React from "react";
import chapters from "../data/chapters.json";
import { useGlobalContext } from "../GlobalContext";

const Overview: React.FC = () => {
	const { theme, headerHeight } = useGlobalContext();
	const title = "Übersicht";
	const text =
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget";
	return (
		<section
			id="overview"
			style={{ paddingTop: headerHeight }}
			className="flex flex-col justify-center min-h-screen"
		>
			<h1 className="mb-4" dangerouslySetInnerHTML={{ __html: title }} />
			<p className="mb-14">{text}</p>
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

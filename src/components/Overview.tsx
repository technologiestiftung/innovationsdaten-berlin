import React from "react";
import chapters from "../data/chapters.json";

const Overview: React.FC = () => {
	return (
		<>
			<h2 className="mb-4">Übersicht</h2>
			<div id="overview" className="grid grid-cols-2 gap-2">
				{chapters.map((chapter) => (
					<a
						key={chapter.link}
						href={`#${chapter.link}`}
						className={`p-2 flex items-center justify-center cursor-pointer
							border-2 border-blue dark:border-white overflow-hidden wrap-break-word break-all
							`}
					>
						<p className="bold large text-center">{chapter.title}</p>
					</a>
				))}
			</div>
		</>
	);
};

export default Overview;

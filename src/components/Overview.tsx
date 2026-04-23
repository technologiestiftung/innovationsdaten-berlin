import chapters from "../data/chapters.json";

const Overview = () => (
	<div className="grid gap-2 max-w-[900px] lg:grid-cols-2">
		{chapters
			.filter((chapter) => chapter.link !== "einleitung")
			.map((chapter) => (
				<a
					key={chapter.link}
					href={`#${chapter.link}`}
					className="p-2 border-[2px] border-foreground group hover:bg-foreground"
				>
					<p className="font-bold text-center group-hover:text-background">
						{chapter.title}
					</p>
				</a>
			))}
	</div>
);

export default Overview;

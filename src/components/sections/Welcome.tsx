import Overview from "@/components/Overview";
import wordings from "@/data/wordings.json";

const Welcome = () => (
	<section
		id="welcome"
		className="flex w-full pt-[calc(var(--header-height)+10vh)] max-lg:flex-col max-lg:items-center lg:gap-8 lg:justify-center max-lg:mb-0"
	>
		<div className="max-lg:max-w-[700px] lg:flex lg:flex-col lg:gap-6 lg:max-h-[90vh]">
			<h1
				className="max-lg:mb-4"
				dangerouslySetInnerHTML={{ __html: wordings.welcome_title }}
			/>
			<p
				className="max-w-[80ch] serif lg:hidden"
				dangerouslySetInnerHTML={{ __html: wordings.welcome_text }}
			/>
			<Overview />
		</div>
		<p
			className="max-w-[80ch] serif max-lg:hidden mr-8"
			dangerouslySetInnerHTML={{ __html: wordings.welcome_text }}
		/>
	</section>
);

export default Welcome;

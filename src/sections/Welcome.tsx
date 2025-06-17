import React from "react";
import { useGlobalContext } from "../GlobalContext";
import Overview from "../components/Overview";
import wordings from "../data/wordings.json";

const Welcome: React.FC = () => {
	const { headerHeight } = useGlobalContext();
	const paddingTop = Math.round(headerHeight + window.innerHeight * 0.1);

	return (
		<section
			id="welcome"
			className={`flex flex-col items-center w-full`}
			style={{ paddingTop }}
		>
			<div className="max-w-[700px]">
				<h1
					className="mb-4"
					dangerouslySetInnerHTML={{ __html: wordings.welcome_title }}
				/>
				<p
					className="max-w-[80ch] serif mb-16"
					dangerouslySetInnerHTML={{ __html: wordings.welcome_text }}
				/>
				<Overview />
			</div>
		</section>
	);
};

export default Welcome;

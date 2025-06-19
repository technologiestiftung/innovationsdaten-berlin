import React from "react";
import { useGlobalContext } from "../GlobalContext";
import Overview from "../components/Overview";
import wordings from "../data/wordings.json";

interface WelcomeProps {
	mobile?: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ mobile }) => {
	const { headerHeight } = useGlobalContext();
	const paddingTop = Math.round(headerHeight + window.innerHeight * 0.1);

	if (mobile) {
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
	}
	return (
		<section
			id="welcome"
			className={`flex w-full gap-20 justify-center`}
			style={{ paddingTop }}
		>
			<div className="flex flex-col justify-between max-h-[90vh]">
				<h1 dangerouslySetInnerHTML={{ __html: wordings.welcome_title }} />
				<Overview />
			</div>
			<p
				className="max-w-[80ch] serif"
				dangerouslySetInnerHTML={{ __html: wordings.welcome_text }}
			/>
		</section>
	);
};

export default Welcome;

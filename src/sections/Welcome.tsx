import React from "react";
import { useGlobalContext } from "../GlobalContext";
import Overview from "../components/Overview";

const Welcome: React.FC = () => {
	const { headerHeight, theme } = useGlobalContext();
	return (
		<section
			id="welcome"
			className="sticky-section relative w-full flex gap-6"
			style={{ paddingTop: headerHeight }}
		>
			<div
				className="flex items-center basis-4/6"
				style={{
					height: window.innerHeight - headerHeight,
					// top: headerHeight,
				}}
			>
				<div className="w-full">
					<Overview />
				</div>
			</div>
			<div className="flex items-center basis-2/6">
				<div className={`card p-6 ${theme}`}>
					<h2
						className="mb-4"
						dangerouslySetInnerHTML={{ __html: "Innovationsdaten Berlin" }}
					/>
					<p>
						Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
						nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
						erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
						et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
						Lorem ipsum dolor sit amet. Lorem
					</p>
				</div>
			</div>
		</section>
	);
};

export default Welcome;

import React from "react";
import Icon from "../components/Icons";

const Welcome: React.FC = () => {
	return (
		<section
			id="welcome"
			className="min-h-screen h-screen flex flex-col justify-between pb-4 pt-10"
		>
			<div className="w-full flex justify-end">
				<Icon id="logo" size={46} />
			</div>
			<span>
				<h1 className="mb-4">Innovations&shy;daten Berlin</h1>
				<p>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
					nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
					sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
					rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
					ipsum dolor sit amet. Lorem
				</p>
			</span>
			<div className="w-full flex justify-center">
				<a href="#overview">
					<Icon id="scroll" size={46} />
				</a>
			</div>
		</section>
	);
};

export default Welcome;

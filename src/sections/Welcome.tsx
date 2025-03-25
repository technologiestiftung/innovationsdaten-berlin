import React from "react";
import Icon from "../components/Icons";
import data from "../data.json";
import { useGlobalContext } from "../GlobalContext";

const Welcome: React.FC = () => {
	const dataKey = "welcome";
	const { title, text } = data[dataKey];
	const { headerHeight, fontSize } = useGlobalContext();
	return (
		<section
			id={dataKey}
			className="min-h-screen h-screen flex flex-col justify-between pb-4"
			style={{ paddingTop: headerHeight }}
		>
			<span />
			<span>
				<h1 className="mb-4" dangerouslySetInnerHTML={{ __html: title }} />
				<p className="mb-8">{text}</p>
			</span>
			<div className="w-full flex justify-center">
				<a href="#overview">
					<Icon id="scroll" size={fontSize * 3} />
				</a>
			</div>
		</section>
	);
};

export default Welcome;

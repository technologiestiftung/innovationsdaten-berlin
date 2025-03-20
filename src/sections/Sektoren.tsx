import Icon from "../components/Icons";
import sektoren from "../data/sektoren.json";
import colors from "../data/colors.json";
import { useGlobalContext } from "../GlobalContext";
import React from "react";

const Sektoren: React.FC = () => {
	const { fontSize } = useGlobalContext();
	return (
		<section id="sektoren" className="py-14">
			<h1 className="mb-4">Die Branchen</h1>
			<p className="mb-14">
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
				eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
				clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
				amet. Lorem
			</p>
			{sektoren.map((sektor, index) => (
				<span key={index}>
					{!index && <h3 className="mb-2">Industrie</h3>}
					{index === 8 && <h3 className="mt-8 mb-2">Dienstleistung</h3>}
					<div
						key={sektor.id}
						className="flex items-center gap-3 py-2 px-5 mb-2"
						style={{ backgroundColor: sektor.color }}
					>
						<Icon
							id={sektor.id}
							setColor={colors.white}
							size={fontSize * 1.5}
						/>
						<p className="line-clamp-1 break-words ignore white bold">
							{sektor.name}
						</p>
					</div>
				</span>
			))}
		</section>
	);
};

export default Sektoren;

import React, { useState } from "react";
import { useGlobalContext } from "../GlobalContext";
import Icon from "../components/Icons";
import methodic from "../data/methodic.json";

const Footer: React.FC = () => {
	const { theme, fontSize, isMobile } = useGlobalContext();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<footer className={`${theme} max-w-screen overflow-hidden`}>
				<div
					className={`py-20 flex ${isMobile ? "flex-col px-3 gap-20" : "flex-row"}`}
				>
					<div className="basis-1/2">
						<p className="mb-4">Gefördert von</p>
						<Icon
							id="SenWEB_logo"
							size={isMobile ? fontSize * 3 : fontSize * 4}
						/>
						<p className="mb-4 mt-10">Ein Projekt der</p>
						<div className={isMobile ? "" : "mb-10"}>
							<Icon
								id="tsb_logo"
								size={isMobile ? fontSize * 3 : fontSize * 4}
							/>
						</div>
					</div>
					<div className="basis-1/2">
						<p className="serif">
							Die Technologiestiftung Berlin führt seit 2013 mit Unterstützung
							des Zentrums für Europäische Wirtschaftsforschung (ZEW) die
							Innovationserhebung Berlin durch.
							<br />
							<br />
							Die Innovationserhebung Berlin zeigt ein repräsentatives Bild der
							Forschungs- und Innovationsaktivitäten der Berliner Wirtschaft
							(„Industrieforschung“). Die Daten sind im bundesweiten Vergleich
							nach Branchen und Größenklassen auswertbar, für Berlin auch nach
							Technologieklassen.
							<br />
							<br />
							Die vom ZEW ermittelten Daten werden von der Technologiestiftung
							ausgewertet und jährlich als Report und Datensatz publiziert. Hier
							zeigen wir Ergebnisse im Zeitverlauf von bisher 10 Jahren.
						</p>
						<div
							className={`mt-10 flex ${isMobile ? "flex-col" : "justify-between max-w-[500px]"}`}
						>
							<a
								href="https://www.technologiestiftung-berlin.de/datenschutz"
								target="_blank"
							>
								<p className="underline bold">Datenschutzerklärung</p>
							</a>
							<a
								href="https://www.technologiestiftung-berlin.de/impressum"
								target="_blank"
							>
								<p className="underline bold">Impressum</p>
							</a>
							<button
								className="cursor-pointer"
								onClick={() => setIsModalOpen(true)}
							>
								<p className="underline bold text-left">Methodik</p>
							</button>
						</div>
					</div>
				</div>
			</footer>
			{isModalOpen && (
				<div
					className={`methodik p-6 overflow-scroll fixed w-screen h-screen z-50 top-0 left-0 ${theme} ${isMobile ? "" : "flex flex-col items-center"}`}
				>
					<div
						onClick={() => setIsModalOpen(false)}
						className="fixed top-[5vh] right-[5vw] left-auto p-5 cursor-pointer"
					>
						<Icon id="close" size={fontSize * 2} />
					</div>
					<h2 className="mb-4 ">Methodik</h2>
					{methodic.methodic_text &&
						Object.entries(methodic.methodic_text).map(([sectionKey, html]) => (
							<div
								key={sectionKey}
								className={`mb-8 ${theme}`}
								dangerouslySetInnerHTML={{ __html: html }}
							/>
						))}
				</div>
			)}
		</>
	);
};

export default Footer;

import React, { useState } from "react";
import { useGlobalContext } from "../GlobalContext";
import Icon from "../components/Icons";
import methodic from "../data/methodic.json";
import colors from "../data/colors.json";

const Footer: React.FC = () => {
	const { theme, fontSize, isMobile } = useGlobalContext();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<footer className={theme}>
				<div
					className={`py-20 flex ${isMobile ? "flex-col px-3 gap-20" : "flex-row"}`}
				>
					<div className="basis-1/2">
						<p className="mb-4">Gefördert von</p>
						<Icon
							id="SenWEB_logo"
							size={isMobile ? fontSize * 3 : fontSize * 5}
						/>
						<p className="mb-4 mt-10">Ein Projekt der</p>
						<div className={isMobile ? "" : "mb-10"}>
							<Icon
								id="tsb_logo"
								size={isMobile ? fontSize * 3 : fontSize * 5}
							/>
						</div>
					</div>
					<div className="basis-1/2">
						<a
							href="https://www.technologiestiftung-berlin.de/datenschutz"
							target="_blank"
						>
							<h4>Datenschutzerklärung</h4>
						</a>
						<a
							href="https://www.technologiestiftung-berlin.de/impressum"
							target="_blank"
						>
							<h4>Impressum</h4>
						</a>
						<button
							className="cursor-pointer"
							onClick={() => setIsModalOpen(true)}
						>
							<h4>Methodik</h4>
						</button>
						<p className="mt-10">
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
					</div>
				</div>
			</footer>
			{/* Modal */}
			{isModalOpen && (
				<div
					onClick={() => setIsModalOpen(false)}
					className={`fixed w-screen h-screen inset-0 bg-opacity-75 flex justify-center items-center bg-black z-50 ${theme}`}
				>
					<div
						style={{
							background: theme === "dark" ? colors.dark : colors.white,
							color: theme === "dark" ? colors.white : colors.dark,
						}}
						className="bg-white  overflow-auto p-12 flex flex-col items-center overflow-auto h-screen"
					>
						<h2 className="text-xl font-bold mb-4 ">Methodik</h2>
						{methodic.methodic_text &&
							Object.entries(methodic.methodic_text).map(
								([sectionKey, html]) => (
									<div
										key={sectionKey}
										className=" prose-lg mb-8"
										dangerouslySetInnerHTML={{ __html: html }}
									/>
								),
							)}
						<div className="flex justify-end mt-4">
							<button
								onClick={() => setIsModalOpen(false)}
								className="px-4 py-2 cursor-pointer"
							>
								<h4>Schließen</h4>
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Footer;

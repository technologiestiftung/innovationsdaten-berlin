import React, { useState } from "react";
import Icon from "@/components/Icons";
import methodic from "@/data/methodic.json";

const Footer: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<footer className="w-full px-3 lg:px-[10vw] border-t-2 border-foreground">
				<div className="py-20 flex flex-col max-lg:px-3 max-lg:gap-20 lg:flex-row">
					<div className="basis-1/2">
						<p className="mb-4">Gefördert von</p>
						<Icon id="SenWEB_logo" className="w-66 lg:w-88" />
						<p className="mb-4 mt-10">Ein Projekt der</p>
						<div className="lg:mb-10">
							<Icon id="tsb_logo" className="fill-foreground w-40 lg:w-52" />
						</div>
					</div>
					<div className="basis-1/2 lg:flex lg:flex-col lg:items-end">
						<p className="serif max-w-[80ch]">
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
						<div className="mt-10 flex max-lg:flex-col lg:gap-10 lg:justify-between lg:max-w-[500px]">
							<a
								href="https://www.technologiestiftung-berlin.de/datenschutz"
								target="_blank"
							>
								<p className="underline font-bold">Datenschutzerklärung</p>
							</a>
							<a
								href="https://www.technologiestiftung-berlin.de/impressum"
								target="_blank"
							>
								<p className="underline font-bold">Impressum</p>
							</a>
							<button
								className="cursor-pointer"
								onClick={() => setIsModalOpen(true)}
							>
								<p className="underline font-bold text-left">Methodik</p>
							</button>
						</div>
					</div>
				</div>
			</footer>
			{isModalOpen && (
				<div className="methodik py-6 overflow-scroll fixed w-full h-screen z-50 top-0 left-0 lg:flex lg:flex-col lg:items-center bg-background px-3 lg:px-[30vw]">
					<div
						onClick={() => setIsModalOpen(false)}
						className="fixed top-[5vh] right-[5vw] left-auto p-5 cursor-pointer"
					>
						<Icon id="close" className="size-8 text-foreground" />
					</div>
					<h2 className="mb-4">Methodik</h2>
					{methodic.methodic_text &&
						Object.entries(methodic.methodic_text).map(([sectionKey, html]) => (
							<div
								key={sectionKey}
								className="mb-8"
								dangerouslySetInnerHTML={{ __html: html }}
							/>
						))}
				</div>
			)}
		</>
	);
};

export default Footer;

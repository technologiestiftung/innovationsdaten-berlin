import React from "react";
import Icon from "../components/Icons";
import { useGlobalContext } from "../GlobalContext";

const Footer: React.FC = () => {
	const { theme, fontSize, isMobile } = useGlobalContext();
	return (
		<footer className={theme}>
			<div
				className={`py-20 flex ${isMobile ? "flex-col px-3 gap-20" : "flex-row"}`}
			>
				<div className="basis-1/2">
					<h3 className="mb-4">Gefördert von:</h3>
					<Icon
						id="SenWEB_logo"
						size={isMobile ? fontSize * 3 : fontSize * 5}
					/>
					<h3 className="mb-4 mt-10">Ein Projekt der:</h3>
					<div className={isMobile ? "" : "mb-10"}>
						<Icon id="tsb_logo" size={isMobile ? fontSize * 3 : fontSize * 5} />
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
					<p className="mt-10">
						Die Technologiestiftung Berlin führt seit 2013 mit Unterstützung des
						Zentrums für Europäische Wirtschaftsforschung (ZEW) die
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
	);
};

export default Footer;

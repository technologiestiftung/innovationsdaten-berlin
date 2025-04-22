import React, { useRef } from "react";
import Overview from "../components/Overview";

const Welcome: React.FC = () => {
	const selfRef = useRef<HTMLDivElement>(null);

	return (
		<section id="welcome" className="sticky-section relative w-full flex gap-6">
			<div ref={selfRef} className="flex items-center basis-1/2">
				<div className="w-full">
					<Overview />
				</div>
			</div>
			<div className="flex items-center basis-1/2">
				<div
					className={`card p-6 border-2 border-blue dark:border-white bg-white dark:bg-dark`}
				>
					<h2 className="mb-4">Innovationsdaten Berlin</h2>
					<p>
						In modernen wissensbasierten Gesellschaften ist Innovation der
						Schlüsselfaktor für Wettbewerbsfähigkeit und damit für
						Zukunftssicherung und den Erhalt des Wohlstands. Eine Region muss
						ihre Position kennen. Die Technologiestiftung stockt seit etwas über
						10 Jahren die Anzahl der in der Deutschen Innovationserhebung des
						ZEW im Auftrag des BMBF befragten Unternehmen auf, damit für Berlin
						aussagefähige Daten vorliegen, die nach Branchen und
						Unternehmensgrößen aufgeschlüsselt werden können. Innovation meint
						hier alle Anstrengungen, die auf neue Produkte, Verfahren oder
						Dienstleistungen zielen, die für einen Markt entwickelt werden.
						Befragt werden jährlich die Industrie und die wissensbasierten
						Dienstleistungen. Die Fragen sind bundesweit einheitlich und alle
						zwei Jahre auch identisch mit dem Community Innovation Survey
						(Eurostat). Die Ergebnisse sind dadurch überregional vergleichbar.
						Berlin ist ein überregional sehr bedeutender Strandort der
						öffentlichen Forschung (in Universitäten, Hochschulen,
						außeruniversitären Forschungsinstituten und einer ganzen Reihe
						forschender Bundesoberbehörden). Der Kooperationsgrad der Berliner
						Wirtschaft, insbesondere mit der öffentlichen Forschung ist deshalb
						deutlich höher als in Deutschland. Spin-offs aus der öffentlichen
						Forschung prägen bei oft noch geringer Unternehmensgröße einige
						Branchen im Bereich der Spitzentechnologien und einiger
						wissensintensiver Dienstleistungen. Basisdaten zur Berliner
						Wirtschaft (z.B. Innovationsausgaben oder Umsätze mit neuen
						Produkten) werden jährlich erhoben. In größeren Abständen werden
						spezifische Themen erfragt (z.B. Entwicklungskooperationen oder
						genutzte Quellen für neues Wissen), so dass sich über die Jahre ein
						Wissensreservoir zum Wissens- und Technologietransfer ergibt. Alle
						Daten seit 2012 stehen auf unserer Website als Publikation und
						Datensatz zur Verfügung. Diese Daten-Zusammenstellung soll
						Interessierte dazu anregen, die Daten selbst zu explorieren.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Welcome;

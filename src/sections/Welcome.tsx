import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../GlobalContext";
import Overview from "../components/Overview";

const Welcome: React.FC = () => {
	const { headerHeight, theme, verticalAligment, setWidthOfStickyContainer } =
		useGlobalContext();
	const selfRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleResize = () => {
			if (selfRef.current) {
				setWidthOfStickyContainer(selfRef.current.offsetWidth);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setWidthOfStickyContainer]);

	return (
		<section
			id="welcome"
			className="sticky-section relative w-full flex gap-6"
			style={{ paddingTop: headerHeight }}
		>
			<div
				ref={selfRef}
				className={`flex items-center ${verticalAligment[0]}`}
				style={{
					height: window.innerHeight - headerHeight,
				}}
			>
				<div className="w-full">
					<Overview />
				</div>
			</div>
			<div className={`flex items-center ${verticalAligment[1]}`}>
				<div className={`card p-6 ${theme}`}>
					<h2
						className="mb-4"
						dangerouslySetInnerHTML={{ __html: "Innovationsdaten Berlin" }}
					/>
					<p>
						In modernen wissensbasierten Gesellschaften ist Innovation der Schlüsselfaktor für Wettbewerbsfähigkeit und damit für Zukunftssicherung und den Erhalt des Wohlstands. Eine Region muss ihre Position kennen.  Die Technologiestiftung stockt seit etwas über 10 Jahren die Anzahl der in der Deutschen Innovationserhebung des ZEW im Auftrag des BMBF befragten Unternehmen auf, damit für Berlin aussagefähige Daten vorliegen, die nach Branchen und Unternehmensgrößen aufgeschlüsselt werden können. Innovation meint hier alle Anstrengungen, die auf neue Produkte, Verfahren oder Dienstleistungen zielen, die für einen Markt entwickelt werden. Befragt werden jährlich die Industrie und die wissensbasierten Dienstleistungen. Die Fragen sind bundesweit einheitlich und alle zwei Jahre auch identisch mit dem Community Innovation Survey (Eurostat). Die Ergebnisse sind dadurch überregional vergleichbar. Basisdaten (z.B. Innovationsausgaben oder Umsätze mit neuen Produkten) werden jährlich erhoben. In größeren Abständen werden spezifische Themen erfragt (z.B. Entwicklungskooperationen oder genutzte Quellen für neues Wissen), so dass sich über die Jahre ein Wissensreservoir zum Wissens- und Technologietransfer ergibt.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Welcome;

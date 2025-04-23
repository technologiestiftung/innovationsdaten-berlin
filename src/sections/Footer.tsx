import React from "react";
import TsbLogo from "../assets/tsb_logo.svg?react";
import SenWebLogo from "../assets/SenWEB_logo.svg?react";

const Footer: React.FC = () => {
  return (
    <footer className="border-blue border-t border-t-2 dark:border-white">
      <div className="container mx-auto flex grid grid-cols-1 gap-20 px-6 py-20 md:grid-cols-2">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h3>Gefördert von:</h3>
            <SenWebLogo className="fill-blue flex size-24 w-114 dark:fill-white" />
          </div>
          <div>
            <h3>Ein Projekt der:</h3>
            <TsbLogo className="fill-blue size-24 w-64 dark:fill-white" />
          </div>
        </div>
        <div className="">
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

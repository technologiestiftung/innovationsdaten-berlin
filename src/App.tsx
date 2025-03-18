import "./style.scss";
import "./index.css";
import LogoLight from "./assets/logo-light.svg";
import LogoDark from "./assets/logo-dark.svg";
import ScrollLight from "./assets/scroll-light.svg";
import ScrollDark from "./assets/scroll-dark.svg";
import Icon from "./components/Icons";
import sektoren from "./data/sektoren.json";
import TreeMapSection from "./sections/TreeMap";
import BarChartSection from "./sections/BarChart";
import { useGlobalContext } from "./GlobalContext";

function App() {
	const { theme, toggleTheme } = useGlobalContext();

	return (
		<main className={theme}>
			<img src={theme === "light" ? LogoLight : LogoDark} alt="Logo" />
			{/* <h1 className={`title bold ${theme}`}>Template</h1> */}
			<h2 className={`title bold mb-20 ${theme}`} onClick={toggleTheme}>
				Toggle
			</h2>
			<BarChartSection />
			{/* <img src={theme === "light" ? ScrollLight : ScrollDark} alt="Logo" /> */}
			{/* <section id="sektoren">
				{sektoren.map((sektor) => (
					<div
						key={sektor.id}
						className="sektor flex p-1 items-center gap-4 p-4"
						style={{ backgroundColor: sektor.color }}
					>
						<Icon id={sektor.id} theme="dark" size={16} />
						<p className="line-clamp-2 break-words ignore white">
							{sektor.name}
						</p>
					</div>
				))}
			</section>
			<TreeMapSection /> */}
		</main>
	);
}

export default App;

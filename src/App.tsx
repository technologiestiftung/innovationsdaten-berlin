import "./style.scss";
import "./index.css";
import { useGlobalContext } from "./GlobalContext";
import ThemeToggle from "./components/ThemeToggle";
import Overview from "./sections/Overview";
import Welcome from "./sections/Welcome";
import BigFact from "./sections/BigFact";
import BigFactComparison from "./sections/BigFactComparison";
import Sektoren from "./sections/Sektoren";
import TreeMap from "./sections/TreeMap";
import AreaChart from "./sections/AreaChart";

function App() {
	const { theme } = useGlobalContext();

	return (
		<>
			<main className={theme}>
				<Welcome />
				<Overview />
				<BigFact factKey="berlin" />
				<Sektoren />
				<TreeMap />
				<BigFact factKey="berliner_unternehmen" />
				<AreaChart />
				<BigFactComparison factKey="kmus" />
			</main>
			<ThemeToggle />
		</>
	);
}

export default App;

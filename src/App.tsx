import "./style.scss";
import "./index.css";
import { useGlobalContext } from "./GlobalContext";
import Overview from "./sections/Overview";
import Welcome from "./sections/Welcome";
import BigFact from "./sections/BigFact";
import Branchen from "./sections/Branchen";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Innovation from "./sections/Innovation";

function App() {
	const { theme, isMobile } = useGlobalContext();

	return (
		<>
			{isMobile ? (
				<div className="w-full p-14">
					<h2>No Mobile Version yet...</h2>
				</div>
			) : (
				<>
					<main className={theme}>
						<Welcome />
						<Overview />
						<BigFact factKey="big-fact-berlin" />
						<Branchen />
						<BigFact factKey="berliner_unternehmen" />
						<Innovation />
						<div className="w-full min-h-screen" />
					</main>
					<Header />
					<Menu />
				</>
			)}
		</>
	);
}

export default App;

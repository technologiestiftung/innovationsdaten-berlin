import "./style.scss";
import "./index.css";
import { useGlobalContext } from "./GlobalContext";
import Header from "./components/Header";
import Menu from "./components/Menu";
import ThemeToggle from "./components/ThemeToggle";
import data from "./data/data.json";
import Sticky from "./sections/Sticky";
import { ChapterKeys } from "./types/global";
import Footer from "./sections/Footer";
import Welcome from "./sections/Welcome";

function App() {
	const { theme, isMobile } = useGlobalContext();

	return (
		<>
			<>
				{isMobile ? (
					<div className="w-full p-14">
						<h2>No Mobile Version yet...</h2>
					</div>
				) : (
					<>
						<Header />
						<Menu />
						<ThemeToggle />
						<main className={theme}>
							<Welcome />
							{Object.keys(data).map((dataKey) => (
								<Sticky key={dataKey} dataKey={dataKey as ChapterKeys} />
							))}
							<div className="w-full min-h-[20vh]" />
						</main>
						<Footer />
					</>
				)}
			</>
		</>
	);
}

export default App;

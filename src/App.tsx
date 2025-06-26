import "./style.scss";
import "./index.css";
import { useGlobalContext } from "./GlobalContext";
import Header from "./components/Header";
import data from "./data/data.json";
import { ChapterKeys } from "./types/global";
import Footer from "./sections/Footer";
import Desktop from "./sections/Desktop";
import Mobile from "./sections/Mobile";
import { useEffect } from "react";

function App() {
	const { theme, isMobile } = useGlobalContext();

	useEffect(() => {
		const handleBeforeUnload = () => {
			localStorage.clear();
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	return (
		<>
			<Header />
			<main className={`${theme} ${isMobile ? "px-3" : ""}`}>
				{Object.keys(data).map((dataKey) => (
					<div key={dataKey}>
						{isMobile ? (
							<Mobile dataKey={dataKey as ChapterKeys} />
						) : (
							<Desktop dataKey={dataKey as ChapterKeys} />
						)}
					</div>
				))}
				<div className="w-full min-h-[20vh]" />
			</main>
			<Footer />
		</>
	);
}

export default App;

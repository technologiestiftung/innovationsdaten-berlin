import "./tailwind-style.css";
import "./recharts.scss";
import "./matrix.scss";
import Header from "./components/Header";
import data from "./data/data.json";
import { ChapterKeys } from "./types/global";
import Footer from "./sections/Footer";
import Desktop from "./sections/Desktop";
import Mobile from "./sections/Mobile";
import { useGlobalContext } from "./GlobalContext";

function App() {
	const { isMobile } = useGlobalContext();

	return (
		<>
			<Header />
			<main className="max-lg:px-3 pb-[20vh]">
				{Object.keys(data).map((dataKey) => (
					<div key={dataKey}>
						{isMobile ? (
							<Mobile dataKey={dataKey as ChapterKeys} />
						) : (
							<Desktop dataKey={dataKey as ChapterKeys} />
						)}
					</div>
				))}
			</main>
			{/* <main className="max-lg:px-3 bg-background mb-[20vh]">
				{Object.keys(data).map((dataKey) => (
					<div key={dataKey}>
						{isMobile ? (
							<Mobile dataKey={dataKey as ChapterKeys} />
						) : (
							<Desktop dataKey={dataKey as ChapterKeys} />
						)}
					</div>
				))}
			</main> */}
			{/* <main className="py-[20vh] px-3 h-[300vh]">
				<div className="relative bg-[#ff0000] w-full h-full">
					<p className="sticky left-0 top-[200px]">
						w: {windowMeasuresOnStart?.w} | h: {windowMeasuresOnStart?.h}
					</p>
				</div>
			</main> */}
			<Footer />
		</>
	);
}

export default App;

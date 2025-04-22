import "./style.scss";
import "./index.css";
import Header from "./components/Header";
import Menu from "./components/Menu";
import data from "./data/data.json";
import Sticky from "./sections/Sticky";
import { ChapterKeys } from "./types/global";
// import Footer from "./sections/Footer";
import Welcome from "./sections/Welcome";

function App() {
	return (
		<div className="h-full w-full">
			<Header />
			<Menu />
			<main className="pt-24 w-full relative">
				{" "}
				<div className="container mx-auto">
					<Welcome />
					{Object.keys(data).map((dataKey) => (
						<Sticky key={dataKey} dataKey={dataKey as ChapterKeys} />
					))}
					<div className="w-full min-h-[20vh]" /> {/* Spacer */}
				</div>
			</main>
			{/* <Footer /> */}
		</div>
	);
}

export default App;

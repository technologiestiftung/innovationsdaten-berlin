import "@/style.css";
import "@/recharts.css";
import Header from "@/components/Header";
import chapters from "@/data/chapters.json";
import { ChapterKeys, DataObj } from "@/types/global";
import Footer from "@/components/sections/Footer";
import Desktop from "@/components/sections/Desktop";
import Mobile from "@/components/sections/Mobile";
import { useGlobalContext } from "@/GlobalContext";

function App() {
	const { isMobile } = useGlobalContext();

	return (
		<>
			<Header />
			<main className="max-lg:px-3 pb-[20vh]">
				{/* Chapters */}
				{Object.keys(chapters as DataObj).map((chapterKey) => (
					<div key={chapterKey}>
						{isMobile ? (
							<Mobile chapterKey={chapterKey as ChapterKeys} />
						) : (
							<Desktop chapterKey={chapterKey as ChapterKeys} />
						)}
					</div>
				))}
			</main>
			<Footer />
		</>
	);
}

export default App;

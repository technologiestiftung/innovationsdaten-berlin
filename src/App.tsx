import "./style.scss";
import "./index.css";
import Header from "./components/Header";
import Menu from "./components/Menu";
import data from "./data/data.json";
import Sticky from "./sections/Sticky";
import { ChapterKeys } from "./types/global";
// import Footer from "./sections/Footer";
import Welcome from "./sections/Welcome";
import Footer from "./sections/Footer";

function App() {
  return (
    <div className="h-full w-full">
      <Header />
      <Menu />
      <main className="relative w-full pt-24">
        <div className="container mx-auto grid gap-8">
          <Welcome />
          {Object.keys(data).map((dataKey) => (
            <Sticky key={dataKey} dataKey={dataKey as ChapterKeys} />
          ))}
          <div className="min-h-[20vh] w-full" />
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default App;

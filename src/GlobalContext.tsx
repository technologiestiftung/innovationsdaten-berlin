import React, {
	createContext,
	useState,
	ReactNode,
	useContext,
	useEffect,
} from "react";
import { Region } from "./types/global";

// Define types for the global state
type Theme = "light" | "dark";

interface GlobalStateType {
	theme: Theme;
	toggleTheme: () => void;
	fontSize: number;
	breakPoint: number;
	isMobile: boolean;
	headerHeight: number;
	chapter: string;
	setChapter: (chapter: string) => void;
	axisFontStylings: {
		style: {
			fontFamily: string;
			fontSize: number;
			fontWeight: string;
		};
	};
	region: Region;
	setRegion: (region: Region) => void;
	widthOfStickyContainer: number;
	setWidthOfStickyContainer: (num: number) => void;
}

const GlobalContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<Theme>("light");
	const [region, setRegion] = useState<Region>("ber");
	const [headerHeight, setHeaderHeight] = useState<number>(0);
	const [chapter, setChapter] = useState<string>("Willkommen");
	const [widthOfStickyContainer, setWidthOfStickyContainer] =
		useState<number>(0);

	const fontSize = 16;

	const axisFontStylings = {
		style: {
			fontFamily: "Clan Pro, sans-serif",
			fontSize: fontSize,
			fontWeight: "bold",
		},
	};

	const breakPoint = window.innerWidth * 0.8;
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
	const checkIfViewPortIsMobile = () =>
		setIsMobile(
			window.innerWidth < 768 && window.innerWidth < window.innerHeight,
		);

	// Toggle theme function
	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	const measureHeaderHeight = () => {
		const header = document.querySelector("header");
		if (header) {
			const getHeaderHeight = header.getBoundingClientRect().height;
			setHeaderHeight(getHeaderHeight);
		}
	};

	const detectAndSetTheme = () => {
		if (typeof window !== "undefined" && window.matchMedia) {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
			setTheme(prefersDark.matches ? "dark" : "light");
		}
	};

	useEffect(() => {
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(theme);
	}, [theme]);

	useEffect(() => {
		detectAndSetTheme();
		measureHeaderHeight();
		window.addEventListener("resize", checkIfViewPortIsMobile);
		return () => window.removeEventListener("resize", checkIfViewPortIsMobile);
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				theme,
				toggleTheme,
				fontSize,
				breakPoint,
				isMobile,
				headerHeight,
				chapter,
				setChapter,
				axisFontStylings,
				region,
				setRegion,
				widthOfStickyContainer,
				setWidthOfStickyContainer,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

// Custom hook to use the GlobalContext
export const useGlobalContext = (): GlobalStateType => {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error("useGlobalContext must be used within a GlobalProvider");
	}
	return context;
};

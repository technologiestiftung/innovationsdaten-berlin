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
	subtractFromMobileChartsHeight: number;
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
	widthOfCardContainer: number;
	smallerDesktop: number;
}

const GlobalContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<Theme>("light");
	const [region, setRegion] = useState<Region>("ber");
	const [headerHeight, setHeaderHeight] = useState<number>(0);
	const subtractFromMobileChartsHeight = 0.1;
	const smallerDesktop = 1440;
	const maxWidthOfCardContainer = 640;

	const fontSize = 16;

	const axisFontStylings = {
		style: {
			fontFamily: "Clan Pro, sans-serif",
			fontSize: fontSize,
			fontWeight: "bold",
		},
	};

	const breakPoint = window.innerWidth * 0.8;
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
	const [widthOfCardContainer, setWidthOfCardContainer] = useState<number>(0);
	const [widthOfStickyContainer, setWidthOfStickyContainer] =
		useState<number>(0);
	const allResizeActions = () => {
		checkIfViewPortIsMobile();
		setContainerWidths();
		measureHeaderHeight();
	};
	const setContainerWidths = () => {
		let makeWidthOfCardContainer =
			window.innerWidth > smallerDesktop
				? (window.innerWidth * 0.8 - 24) * (2 / 5) - 4
				: (window.innerWidth * 0.8 - 24) * 0.5;

		let makeWidthOfStickyContainer =
			window.innerWidth > smallerDesktop
				? (window.innerWidth * 0.8 - 24) * (3 / 5)
				: (window.innerWidth * 0.8 - 24) * 0.5;

		if (makeWidthOfCardContainer > maxWidthOfCardContainer) {
			makeWidthOfCardContainer = maxWidthOfCardContainer;
			makeWidthOfStickyContainer =
				window.innerWidth * 0.8 - 24 - makeWidthOfCardContainer;
		}
		setWidthOfCardContainer(makeWidthOfCardContainer);
		setWidthOfStickyContainer(makeWidthOfStickyContainer);
	};
	const checkIfViewPortIsMobile = () => {
		const ww = localStorage.getItem("ww");
		if (ww) {
			if (ww === window.innerWidth.toString()) {
				return;
			}
			setIsMobile(
				window.innerWidth < 1024 && window.innerWidth < window.innerHeight,
			);
		}
	};

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
		allResizeActions();
		localStorage.setItem("ww", window.innerWidth.toString());
		window.addEventListener("resize", () => allResizeActions());
		return () => window.removeEventListener("resize", allResizeActions);
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
				subtractFromMobileChartsHeight,
				axisFontStylings,
				region,
				setRegion,
				widthOfStickyContainer,
				widthOfCardContainer,
				smallerDesktop,
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

import React, {
	createContext,
	useState,
	ReactNode,
	useContext,
	useEffect,
} from "react";
import { Region } from "./types/global";

type WindowMeasures = {
	w: number;
	h: number;
};

interface GlobalStateType {
	isMobile: boolean;
	axisFontStylings: {
		style: {
			fontFamily: string;
			fontSize: number;
			fontWeight: string;
		};
	};
	region: Region;
	setRegion: (region: Region) => void;
	animationDuration: number;
	windowMeasuresOnStart: WindowMeasures | null;
}

const GlobalContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	//
	// States
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);
	const [region, setRegion] = useState<Region>("ber");
	const [windowMeasuresOnStart, setWindowMeasuresOnStart] =
		useState<WindowMeasures | null>(null);
	const animationDuration = 1000;
	const axisFontStylings = {
		style: {
			fontFamily: "Clan Pro, sans-serif",
			fontSize: 16,
			fontWeight: "bold",
		},
	};

	//
	// utils
	const detectAndSetTheme = () => {
		if (typeof window !== "undefined" && window.matchMedia) {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
			if (prefersDark.matches) {
				const root = document.documentElement;
				root.setAttribute("data-theme", "dark");
			}
		}
	};
	const getWindowMeasuresOnStart = () => {
		setWindowMeasuresOnStart((prev) => {
			if (prev?.w === window.innerWidth) {
				return prev;
			}
			return {
				w: window.innerWidth,
				h: window.innerHeight,
			};
		});
	};
	useEffect(() => {
		detectAndSetTheme();
		getWindowMeasuresOnStart();
	}, []);

	const handleResize = () => {
		getWindowMeasuresOnStart();
		setIsMobile(window.innerWidth < 1024);
	};

	useEffect(() => {
		window.addEventListener("resize", () => handleResize());
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				isMobile,
				axisFontStylings,
				region,
				setRegion,
				animationDuration,
				windowMeasuresOnStart,
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

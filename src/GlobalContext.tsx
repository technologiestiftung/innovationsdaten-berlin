import React, {
	createContext,
	useState,
	ReactNode,
	useContext,
	useEffect,
} from "react";

// Define types for the global state
type Theme = "light" | "dark";

interface GlobalStateType {
	theme: Theme;
	toggleTheme: () => void;
	fontSize: number;
	breakPoint: number;
	isMobile: boolean;
	headerHeight: number;
	sectionPaddingTop: number;
}

const GlobalContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<Theme>("dark");
	const [headerHeight, setHeaderHeight] = useState<number>(0);

	const fontSize = 16;
	const additionalPaddingTop = fontSize * 4;
	const sectionPaddingTop = headerHeight + additionalPaddingTop;

	const breakPoint = 1024;
	const [isMobile, setIsMobile] = useState<boolean>(
		window.innerWidth < breakPoint,
	);
	const checkIfViewPortIsMobile = () =>
		setIsMobile(window.innerWidth < breakPoint);

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

	useEffect(() => {
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(theme);
	}, [theme]);

	useEffect(() => {
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
				sectionPaddingTop,
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

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
}

const GlobalContext = createContext<GlobalStateType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<Theme>("dark");

	const fontSize = 14;

	const breakPoint = 900;
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 900);
	const checkIfViewPortIsMobile = () => setIsMobile(window.innerWidth < 900);

	// Toggle theme function
	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	useEffect(() => {
		document.documentElement.classList.remove("light", "dark");
		document.documentElement.classList.add(theme);
	}, [theme]);

	useEffect(() => {
		window.addEventListener("resize", checkIfViewPortIsMobile);
		return () => window.removeEventListener("resize", checkIfViewPortIsMobile);
	}, []);

	return (
		<GlobalContext.Provider
			value={{ theme, toggleTheme, fontSize, breakPoint, isMobile }}
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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GlobalProvider } from "./GlobalContext.tsx";

function render() {
	const root = document.getElementById("root");

	if (!root) {
		return;
	}

	createRoot(root).render(
		<StrictMode>
			<GlobalProvider>
				<App />
			</GlobalProvider>
		</StrictMode>,
	);
}

render();

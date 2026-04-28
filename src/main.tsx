import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { GlobalProvider } from "@/GlobalContext";

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

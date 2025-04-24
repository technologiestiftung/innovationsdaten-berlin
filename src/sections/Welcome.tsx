import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../GlobalContext";
import Overview from "../components/Overview";
import wordings from "../data/wordings.json";

const Welcome: React.FC = () => {
	const { headerHeight, theme, setWidthOfStickyContainer, isMobile } =
		useGlobalContext();
	const selfRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleResize = () => {
			if (selfRef.current) {
				setWidthOfStickyContainer(selfRef.current.offsetWidth);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setWidthOfStickyContainer]);

	return (
		<section
			id="welcome"
			className={`sticky-section relative w-full flex ${isMobile ? "flex-col-reverse gap-12" : "flex-row gap-6"}`}
			style={{ paddingTop: headerHeight }}
		>
			<div
				ref={selfRef}
				className="flex items-center basis-1/2"
				style={{
					height: window.innerHeight - headerHeight,
				}}
			>
				<div className="w-full">
					<Overview />
				</div>
			</div>
			<div className="flex items-center basis-1/2">
				<div className={`card ${theme} ${isMobile ? "mt-10" : "p-6"}`}>
					<h2 className="mb-4">{wordings.welcome_title}</h2>
					<p>{wordings.welcome_text}</p>
				</div>
			</div>
		</section>
	);
};

export default Welcome;

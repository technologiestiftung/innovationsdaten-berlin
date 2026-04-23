import React from "react";
import { cn } from "../../utilities";

interface BigFactProps {
	facts: { fact: string; unit: string }[] | undefined;
}

const BigFact: React.FC<BigFactProps> = ({ facts }) => (
	<div className="flex gap-8 max-lg:flex-col max-lg:w-full">
		{facts?.map((item, index) => (
			<div className="flex-1" key={index}>
				<h2
					className={cn(
						"ignore text-center leading-none select-none text-[10rem]",
						facts?.length === 1
							? "md:text-[170px] xl:text-[260px]"
							: "md:text-[70px] xl:text-[140px]",
					)}
				>
					{item.fact}
				</h2>
				<h4 className="text-center mb-8">{item.unit}</h4>
			</div>
		))}
	</div>
);

export default BigFact;

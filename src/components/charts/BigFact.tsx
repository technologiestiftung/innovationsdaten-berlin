import React from "react";
import { cn } from "@/utilities";
import { BigFactType } from "@/types/global";

interface BigFactProps {
	bigFacts: BigFactType[];
}

const BigFact: React.FC<BigFactProps> = ({ bigFacts }) => (
	<div className="flex gap-8 max-lg:flex-col max-lg:w-full">
		{bigFacts?.map((bigFact: BigFactType, index) => (
			<div className="flex-1" key={index}>
				<h2
					className={cn(
						"ignore text-center leading-none select-none text-[10rem]",
						bigFacts?.length === 1
							? "md:text-[170px] xl:text-[260px]"
							: "md:text-[70px] xl:text-[140px]",
					)}
				>
					{bigFact.fact}
				</h2>
				<h4 className="text-center mb-8">{bigFact.unit}</h4>
			</div>
		))}
	</div>
);

export default BigFact;

import React from "react";

type Props = {
	chart_type: string;
};

const Comp: React.FC<Props> = ({ chart_type }: Props) => {
	return <>{chart_type}</>;
};

export default Comp;

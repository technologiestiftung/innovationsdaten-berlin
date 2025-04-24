import React from "react";

interface BigFactProps {
  facts: { fact: string; unit: string }[] | undefined;
}

const BigFact: React.FC<BigFactProps> = ({ facts }) => {
  const SingleFact = ({ fact, unit }: any) => {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full justify-center">
          <h1 className="text-center text-[clamp(1rem,30vw,16rem)] leading-none select-none">
            {fact}
          </h1>
        </div>
        <h3 className="mb-8 text-center">{unit}</h3>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-8">
      {facts?.map((item, index) => (
        <SingleFact key={index} fact={item.fact} unit={item.unit} />
      ))}
    </div>
  );
};

export default BigFact;

import React from "react";

interface AirConditionerTabProps {
  title: string;
  description: string;
  icon?: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}

const AirConditionerTab = ({
  title,
  description,
  icon,
  onClick,
}: AirConditionerTabProps) => {
  return (
    <div
      className="glassmorphism relative z-10 flex justify-start items-center gap-4 p-2 w-full rounded-full transition-all duration-500 group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-center items-center bg-white rounded-full w-10 h-10 transition-colors duration-500 group-hover:bg-neutral-200">
        {icon && icon}
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-black">{description}</p>
        <p className="text-sm font-normal text-neutral-500">{title}</p>
      </div>
    </div>
  );
};

export default AirConditionerTab;

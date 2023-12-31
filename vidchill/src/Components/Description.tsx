import { useState } from "react";
import { ChevronDown, ChevronUp } from "./Icons/Chevron";

const Description = ({
  text,
  length,
  border,
}: {
  text: string | null;
  length: number;
  border?: boolean;
}) => {
  const [isExpanded, setisExpanded] = useState(false);

  const toggleExpand = () => {
    setisExpanded(!isExpanded);
  };

  if (text?.length === 0 || text === null) {
    return null;
  } else if (text?.length < length) {
    return (
      <>
        {border ? <div className="border-b border-gray-200"></div> : ""}
        <p className="my-3 text-left text-sm font-semibold text-gray-600">
          {text}
        </p>
      </>
    );
  } else {
    return (
      <>
        {border ? <div className="border-b border-gray-200"></div> : ""}
        <div className="relative w-full">
          <button
            onClick={toggleExpand}
            className="flex flex-row place-content-evenly"
          >
            <p
              className={`text-left text-sm font-semibold text-gray-600 ${
                isExpanded ? "line-clamp-2" : ""
              }`}
            >
              {text}
            </p>
            <span className="items-end">
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </span>
          </button>
        </div>
      </>
    );
  }
};

export default Description;

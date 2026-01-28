import { useEffect, useState } from "react";

const PromptClamp = ({ text = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldCut, setShouldCut] = useState(false);

  useEffect(() => {
    setShouldCut(text && text.length > 100);
  }, [text]);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <p>
      {isExpanded || !shouldCut ? text : text.substring(0, 100)}
      {shouldCut && (
        <span
          className="text-blue-800 hover:text-blue-700 cursor-pointer"
          onClick={handleClick}
        >
          {isExpanded ? " ...See Less" : " ...See More"}
        </span>
      )}
    </p>
  );
};

export default PromptClamp;

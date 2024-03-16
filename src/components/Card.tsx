import { useState } from "react";

function Card({
  front,
  back,
  onClick,
  onDbClick,
}: {
  front: string;
  back: string;
  onClick?: () => void;
  onDbClick?: () => void;
}) {
  const [isFront, setIsFront] = useState(true);

  const handleClick = () => {
    setIsFront((prev) => !prev);
  };

  const Leaf = (text: string) => {
    return (
      <div className="bg-slate-300 w-full h-[200px] mb-3 flex items-center justify-center border-solid border-1 rounded-lg overflow-hidden">
        {text}
      </div>
    );
  };

  return <div onClick={handleClick}>{isFront ? Leaf(front) : Leaf(back)}</div>;
}

export default Card;

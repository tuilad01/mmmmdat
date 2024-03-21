import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export interface CardRef {
  getCards: () => Card[];
}

export interface Card {
  sentence: string;
  meaning: string;
  color: string;
  isHidden: boolean;
  isFront: boolean;
}

function mappingCard(item: any, index: number) {
  const color = index % 2 ? "rgb(226 232 240)" : "rgb(203 213 225)";
  return {
    sentence: item.sentence,
    meaning: item.meaning,
    color: color,
    isHidden: false,
    isFront: false,
  };
}

const random = (list: Card[]) => {
  let index = list.length;

  while (index > 0) {
    const newIndex = Math.floor(Math.random() * list.length);
    index--;

    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;
  }

  return list;
};

const CardList = forwardRef<CardRef, { data: any[] }>(({ data }, ref) => {
  const [cards, setCards] = useState<Card[]>([]);
  useImperativeHandle(
    ref,
    () => ({
      getCards: () => {
        return cards;
      },
    }),
    [cards]
  );

  useEffect(() => {
    setCards(random(data.map(mappingCard)));
  }, [data]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, card: Card) => {
    // double click
    if (event.detail === 2) {
      handleDbClick(card);
      return;
    }

    // click
    card.isFront = !card.isFront;
    setCards([...cards]);
  };

  const handleDbClick = (card: Card) => {
    card.isHidden = true;
    setCards([...cards]);
  };

  return (
    <ul className="mt-4 flex gap-2 flex-wrap flex-col md:flex-row">
      {cards.map((card) => (
        <li key={card.sentence} className={card.isHidden ? "hidden" : ""}>
          <div
            onClick={(event) => handleClick(event, card)}
            className="w-full md:w-[336px] h-[200px] mb-3 p-4 flex items-center justify-center border-solid border-1 rounded-lg overflow-hidden cursor-pointer"
            style={{ backgroundColor: card.color }}
          >
            {card.isFront ? (
              <div className="text-2xl font-sans">{card.sentence}</div>
            ) : (
              <div className="text-2xl font-sans">{card.meaning}</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
});
// function Card({ data }: { data: any[] }) {
//   const [cards, setCards] = useState<Card[]>([]);

//   useEffect(() => {
//     setCards(random(data.map(mappingCard)));
//   }, [data]);

//   const handleClick = (event: React.MouseEvent<HTMLDivElement>, card: Card) => {
//     // double click
//     if (event.detail === 2) {
//       handleDbClick(card);
//       return;
//     }

//     // click
//     card.isFront = !card.isFront;
//     setCards([...cards]);
//   };

//   const handleDbClick = (card: Card) => {
//     card.isHidden = true;
//     setCards([...cards]);
//   };

//   return (
//     <ul className="mt-4 flex gap-2 flex-wrap flex-col md:flex-row ">
//       {cards.map((card) => (
//         <li className={card.isHidden ? "hidden" : ""}>
//           <div
//             onClick={(event) => handleClick(event, card)}
//             className="w-full md:w-[336px] h-[200px] mb-3 flex items-center justify-center border-solid border-1 rounded-lg overflow-hidden cursor-pointer"
//             style={{ backgroundColor: card.color }}
//           >
//             {card.isFront ? (
//               <div>{card.sentence}</div>
//             ) : (
//               <div>{card.meaning}</div>
//             )}
//           </div>
//         </li>
//       ))}
//     </ul>
//   );
// }

export default CardList;

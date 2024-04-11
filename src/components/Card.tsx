import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Sentence } from "../group/group";

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

export function convertCardToSentence(card: Card): Sentence {
  return {
    sentence: card.sentence,
    meaning: card.meaning,
    state: 0,
  };
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

export interface CardListProps {
  data: any[];
  onEdit?: (card: Card) => void;
}

function CardList({ data, onEdit }: CardListProps, ref: React.Ref<CardRef>) {
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
    setCards(data.map(mappingCard) as Card[]);
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
  const handleEdit = (event: React.MouseEvent<SVGSVGElement>, card: Card) => {
    event.preventDefault();
    event.stopPropagation();
    if (onEdit) {
      onEdit(card);
    }
  };
  return (
    <ul className="mt-4 flex gap-2 flex-wrap flex-col md:flex-row">
      {cards.map((card) => (
        <li key={card.sentence} className={card.isHidden ? "hidden" : ""}>
          <div
            onClick={(event) => handleClick(event, card)}
            className="w-full md:w-[336px] mb-3 p-4 border-solid border-1 rounded-lg overflow-hidden cursor-pointer"
            style={{ backgroundColor: card.color }}
          >
            <div className="w-full flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 p-1 hover:bg-gray-500 active:bg-gray-600 rounded-lg  select-none"
                onClick={(e) => handleEdit(e, card)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </svg>
            </div>
            {card.isFront ? (
              <div className="h-[130px] flex justify-center items-center text-2xl font-sans">
                {card.sentence}
              </div>
            ) : (
              <>
                <div className="h-[130px] flex justify-center items-center text-2xl font-sans">
                  <span>{card.meaning}</span>
                </div>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default forwardRef<CardRef, CardListProps>(CardList);

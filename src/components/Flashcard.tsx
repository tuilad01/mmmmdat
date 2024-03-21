import { useLoaderData, useLocation } from "react-router-dom";
import { Group, Sentence } from "./Group";
import CardList, { CardRef, Card } from "./Card";
import Button from "./Button";
import Anchor from "./Anchor";
import { useEffect, useRef, useState } from "react";
import { setGroupByName } from "../common";

interface Flashcard {
  sentence: string;
  meaning: string;
  color: string;
  isFront: boolean;
  state: number;
  isHidden: boolean;
}
// 0 => 1, 1 => 2, 2 => 2
const PASSED = [1, 2, 2];

function Flashcard() {
  const { search } = useLocation();
  const parameters = new URLSearchParams(search);
  //let selectedState = parameters.get("state");
  const { name, sentences: data } = useLoaderData() as Group;
  const [state, setState] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const cardRef = useRef<CardRef | null>(null);

  useEffect(() => {
    setFlashcards([
      ...data.filter((s) => s.state === undefined || s.state === state),
    ]);
  }, []);

  // useEffect(() => {
  //   if (selectedState) {
  //     setState(parseInt(selectedState ?? 0));
  //   }
  // }, [selectedState]);

  const handleNextState = () => {
    const newState = (state + 1) % 3;

    setState(newState);
    let cards = cardRef?.current?.getCards() || [];
    // save data to local
    const newData = saveState(cards, data);
    setGroupByName(name, newData);
    setFlashcards(newData.filter((item) => item.state <= newState));
  };

  const saveState = (cards: Card[], sentences: Sentence[]) => {
    if (cards.length === 0) {
      return sentences;
    }
    const newSentences = sentences.map((item) => {
      const card = cards.find((c) => c.sentence === item.sentence);
      if (!card) {
        return item;
      }

      let state = item.state || 0;
      state = card.isHidden ? PASSED[state] : 0;
      item.state = state;
      return item;
    });
    setGroupByName(name, newSentences);

    return newSentences;
  };

  return (
    <section className="p-4">
      <Anchor toUrl={"/"} name="Home" />
      <h1 className="text-2xl text-gray-900 font-bold mb-4 mx-1 truncate">
        {name}
      </h1>
      <Button name={`Next (${state + 1})`} onClick={handleNextState} />
      <ul className="mt-4 flex gap-2 flex-wrap flex-col md:flex-row ">
        <CardList ref={cardRef} data={flashcards} />
      </ul>
    </section>
  );
}

export default Flashcard;

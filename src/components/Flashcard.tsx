import { useLoaderData } from "react-router-dom";
import { Group, Sentence } from "./group";
import Card from "./Card";
import Button from "./Button";
import Anchor from "./Anchor";
import { useEffect, useState } from "react";
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
let timeOutClick: any = null;
let click = 0;

function Flashcard() {
  const { name, sentences: data } = useLoaderData() as Group;
  const [state, setState] = useState(0);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const flashcards = data.map((flashcard, index) => {
      const color = index % 2 ? "rgb(226 232 240)" : "rgb(203 213 225)";
      return {
        sentence: flashcard.sentence,
        meaning: flashcard.meaning,
        color: color,
        isFront: true,
        state: flashcard.state === undefined ? 0 : flashcard.state,
        isHidden: false,
      };
    });
    setFlashcards((prev) => [...flashcards]);
  }, []);

  useEffect(() => {
    save();
  }, [state]);

  const handleClick = (flashcard: Flashcard) => {
    click += 1;

    if (!timeOutClick) {
      timeOutClick = setTimeout(() => {
        const fc = flashcards.find((d) => d.sentence === flashcard.sentence);
        if (!fc) {
          return false;
        }
        fc.isFront = !fc.isFront;
        setFlashcards([...flashcards]);

        clearTimeout(timeOutClick);
        timeOutClick = null;
        click = 0;
      }, 200);
    }

    if (click === 2) {
      clearTimeout(timeOutClick);
      timeOutClick = null;
      click = 0;

      handleDbClick(flashcard);
    }
  };

  const handleDbClick = (flashcard: Flashcard) => {
    const fc = flashcards.find((d) => d.sentence === flashcard.sentence);
    if (!fc) {
      return false;
    }
    const newState = PASSED[fc.state];
    fc.state = newState;
    fc.isHidden = true;

    setFlashcards([...flashcards]);
  };

  const handleNextState = () => {
    const failed = flashcards.map((flashcard) => {
      if (flashcard.state === state && !flashcard.isHidden) {
        flashcard.state = 0;
      }
      flashcard.isHidden = false;
      return flashcard;
    });
    setFlashcards((prev) => [...failed]);
    setState((prev) => (prev + 1) % 3);
  };
  const save = () => {
    const sentences = data.map((sentence) => {
      const flashcard = flashcards.find(
        (fc) => fc.sentence === sentence.sentence
      );
      if (!flashcard) {
        return sentence;
      }
      return {
        ...sentence,
        state: flashcard.state,
      };
    });
    setGroupByName(name, sentences);
  };

  return (
    <section className="p-4">
      <Anchor toUrl={"/"} name="Home" />
      <h1 className="text-2xl text-gray-900 font-bold mb-4 mx-1 truncate">
        {name}
      </h1>
      <Button name={`Next (${state + 1})`} onClick={handleNextState} />
      <ul className="mt-4 flex gap-2 flex-wrap flex-col md:flex-row ">
        {flashcards
          .filter((d) => d.state === state)
          .map((flashcard) => (
            <li className={flashcard.isHidden ? "hidden" : ""}>
              <div
                onClick={() => handleClick(flashcard)}
                className="w-full md:w-[336px] h-[200px] mb-3 flex items-center justify-center border-solid border-1 rounded-lg overflow-hidden cursor-pointer"
                style={{ backgroundColor: flashcard.color }}
              >
                {flashcard.isFront ? (
                  <div>{flashcard.sentence}</div>
                ) : (
                  <div>{flashcard.meaning}</div>
                )}
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}

export default Flashcard;

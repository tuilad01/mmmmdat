import { useLoaderData, useLocation } from "react-router-dom";
import { Group, Sentence } from "./Group";
import CardList, { CardRef, Card } from "./Card";
import Button from "./Button";
import Anchor from "./Anchor";
import { useEffect, useRef, useState } from "react";
import { saveState, updateSetence } from "../common";
import Modal from "./Modal";
import TextBox from "./TextBox";
import FormGroup from "./FormGroup";

interface Flashcard {
  sentence: string;
  meaning: string;
  color: string;
  isFront: boolean;
  state: number;
  isHidden: boolean;
}

function Flashcard() {
  // const { search } = useLocation();
  // const parameters = new URLSearchParams(search);
  // //let selectedState = parameters.get("state");
  const { name, sentences: data } = useLoaderData() as Group;
  const [state, setState] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const cardRef = useRef<CardRef | null>(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [cardEdit, setCardEdit] = useState<Card | undefined>();

  useEffect(() => {
    setFlashcards([
      ...data.filter((s) => s.state === undefined || s.state === state),
    ]);
  }, []);

  const handleNextState = () => {
    const newState = (state + 1) % 3;

    setState(newState);
    let cards = cardRef?.current?.getCards() || [];
    // save data to local
    const newData = saveState(name, cards, data);
    setFlashcards(newData.filter((item) => item.state <= newState));
  };

  const handleEdit = (card: Card) => {
    setIsShowModal(true);
    setCardEdit(card);
  };

  const handleOk = () => {
    if (!cardEdit) {
      return false;
    }

    if (updateSetence(name, cardEdit.sentence, cardEdit.meaning)) {
      // const flashcard = flashcards.find(
      //   (d) => d.sentence === cardEdit.sentence
      // );
      // if (flashcard) {
      //   flashcard.meaning = cardEdit.meaning;
      //   setFlashcards([...flashcards]);
      // }
    }
    setIsShowModal(false);
    setCardEdit(undefined);
  };

  return (
    <section className="p-4">
      <Anchor toUrl={"/"} name="Home" />
      <h1 className="text-2xl text-gray-900 font-bold mb-4 mx-1 truncate">
        {name}
      </h1>
      <Button name={`Next (${state + 1})`} onClick={handleNextState} />
      <ul className="mt-4 flex gap-2 flex-wrap flex-col md:flex-row ">
        <CardList ref={cardRef} data={flashcards} onEdit={handleEdit} />
      </ul>

      {isShowModal && (
        <Modal
          title="Edit"
          onCancel={() => setIsShowModal(false)}
          onOk={handleOk}
        >
          <div className="mb-2">
            <FormGroup
              label={cardEdit?.sentence || ""}
              textBoxProps={{
                value: cardEdit?.meaning,
                onChange: (value: string) => {
                  console.log(value);
                  setCardEdit((prev) => prev && { ...prev, meaning: value });
                },
              }}
            ></FormGroup>
          </div>
        </Modal>
      )}
    </section>
  );
}

export default Flashcard;

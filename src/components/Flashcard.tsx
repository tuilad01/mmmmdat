import { useLoaderData, useLocation } from "react-router-dom";
import CardList, { CardRef, Card } from "./Card";
import Button from "./Button";
import Anchor from "./Anchor";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import TextBox from "./TextBox";
import FormGroup from "./FormGroup";
import { Group, Sentence } from "../group/group";
import { shuffle } from "../common/common";

interface Flashcard {
  sentence: string;
  meaning: string;
  color: string;
  isFront: boolean;
  state: number;
  isHidden: boolean;
}

interface LoaderData {
  name: string;
  sentences: Sentence[];
}

function Flashcard() {
  // const { search } = useLocation();
  // const parameters = new URLSearchParams(search);
  // //let selectedState = parameters.get("state");
  const { name, sentences: data } = useLoaderData() as LoaderData;
  const [state, setState] = useState<number>(0);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const cardRef = useRef<CardRef | null>(null);
  const [isShowModal, setIsShowModal] = useState(false);
  const [cardEdit, setCardEdit] = useState<Card | undefined>();

  useEffect(() => {
    const cards = data.filter(
      (s) => s.state === undefined || s.state === state
    );
    setFlashcards(shuffle([...cards]));
  }, []);

  const handleNextState = () => {
    const newState = (state + 1) % 3;
    setState(newState);

    // select remembered sentences
    let cards = cardRef?.current?.getCards() || [];
    const lose = cards
      .filter((card) => card.isHidden === false)
      .map((card) => card.sentence);
    const remembered = flashcards.filter(
      (fc) => lose.indexOf(fc.sentence) === -1
    );

    // calculate sentence states for next state
    const group = new Group({ name: name }).loadSentences();
    group.updateNextState(lose, remembered);
    group.save();

    const nextStateSentences = group
      .getSentences({ isLocal: false })
      .filter((sentence) => sentence.state <= newState);

    setFlashcards(shuffle(nextStateSentences));
  };

  const handleEdit = (card: Card) => {
    setIsShowModal(true);
    setCardEdit(card);
  };

  const handleOk = () => {
    if (!cardEdit) {
      return false;
    }

    const flashcard = flashcards.find(
      (fc) => fc.sentence === cardEdit.sentence
    );
    if (!flashcard) {
      return false;
    }

    const group = new Group({ name: name }).loadSentences();
    group.update({
      sentence: cardEdit.sentence,
      meaning: cardEdit.meaning,
      state: flashcard.state,
    });
    group.save();

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

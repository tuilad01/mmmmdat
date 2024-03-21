import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { setGroupByName } from "../common";
import Anchor from "./Anchor";
import Button from "./Button";

export interface Sentence {
  sentence: string;
  meaning: string;
  state: number;
}
export interface Group {
  name: string;
  sentences: Sentence[];
}

function Group() {
  const { name, sentences: data } = useLoaderData() as Group;
  const [sentences, setSentences] = useState<Sentence[]>(data);
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setGroupByName(name, sentences);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value.toString();
    setSentences((state) => {
      const newSentences = [...state];
      newSentences[index].meaning = value;
      return newSentences;
    });
  };

  const handleExport = () => {
    copyToClipboard(JSON.stringify(sentences));
  };
  const goToFlashcard = () => {
    navigate(`/flashcard/${name}`);
  };

  const handleImport = () => {
    navigator.clipboard.readText().then((text) => {
      if (!text) {
        return false;
      }
      const sentences = JSON.parse(text);
      if (!Array.isArray(sentences)) {
        return false;
      }
      setGroupByName(name, sentences);
      toast("imported", { icon: () => "😆" });
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("copied", { icon: () => "🤪" });
  };

  return (
    <section className="p-4">
      <Anchor toUrl={"/"} name="Home" />
      <h1 className="text-2xl text-gray-900 font-bold mb-4 mx-1 truncate">
        {name}
      </h1>

      <div className="mb-4">
        <Button name="Export" onClick={handleExport} />
        <Button name="Import" onClick={handleImport} className="ml-1" />
        <Button name="Flashcard" className="ml-1" onClick={goToFlashcard} />
      </div>
      <ul>
        {sentences.map((item, index) => (
          <li key={`${item.sentence}`} className="px-2 mb-2">
            <span className="text-lg">
              {index + 1}. {item.sentence}
            </span>
            <span
              className="inline-block text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
              onClick={(e) => copyToClipboard(item.sentence)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="meaning..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-1"
              value={item.meaning}
              onChange={(event) => handleInputChange(event, index)}
            />

            <Button name="Save" onClick={handleSave} />
          </li>
        ))}
      </ul>
      <ToastContainer
        style={{ width: "200px" }}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </section>
  );
}

export default Group;

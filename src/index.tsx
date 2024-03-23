import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { getGroupByName } from "./common";
import Group from "./components/Group";
import "react-toastify/dist/ReactToastify.css";
import Flashcard from "./components/Flashcard";

function sortByState(
  sentence: { state: number | undefined },
  nextSentence: { state: number | undefined }
) {
  sentence.state = sentence.state || 0;
  nextSentence.state = nextSentence.state || 0;
  return sentence.state - nextSentence.state;
}

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "group/:name",
    loader: async ({ params }) => {
      return {
        name: params.name,
        sentences: getGroupByName(params.name || ""),
      };
    },
    element: <Group />,
  },
  {
    path: "flashcard/:name",
    loader: async ({ params }) => {
      let sentences = getGroupByName(params.name || "");

      // Get 40 items only
      const MAX_ITEMS = 40;
      if (sentences.length - MAX_ITEMS > 0) {
        sentences.sort(sortByState);
        sentences = sentences.splice(0, MAX_ITEMS);
      }

      return {
        name: params.name,
        sentences: sentences,
      };
    },
    element: <Flashcard />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
//serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

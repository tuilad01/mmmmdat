import React, { useEffect } from "react";
import "./App.css";
import {
  GROUP_NAMES,
  PUBLIC_JSON_PATH,
  ROOT_LOCAL_STORAGE_PATH,
  seedLocalStorage,
} from "./common";
import { Link, Outlet } from "react-router-dom";

function App() {
  useEffect(() => {
    seedLocalStorage(GROUP_NAMES, PUBLIC_JSON_PATH, ROOT_LOCAL_STORAGE_PATH);
  }, []);

  return (
    <div>
      <ul className="p-4">
        {GROUP_NAMES.map((groupName, index) => (
          <li key={groupName} className="mb-2">
            <Link
              to={`/group/${groupName}`}
              className="font-medium text-blue-600 dark:text-blue-500 hover:bg-slate-100 active:bg-slate-200 border-solid border-2 border-indigo-600 rounded-lg block p-4 md:w-[398px]"
            >
              {index + 1}. {groupName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

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
          <li key={groupName}>
            <Link
              to={`/group/${groupName}`}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
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

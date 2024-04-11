import React, { useEffect } from "react";
import "./App.css";
import { Link, Outlet } from "react-router-dom";
import { GroupManagement } from "./group/group-management";

function App() {
  const groupManagement = new GroupManagement();
  useEffect(() => {
    groupManagement.seed();
  }, []);

  return (
    <div>
      <ul className="p-4">
        <li className="mb-2">
          <Link
            to={"/settings"}
            className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-600 active:bg-slate-200 border-l-4 hover:border-indigo-500 p-2"
          >
            Settings
          </Link>
        </li>
        {groupManagement.getGroupNames().map((groupName, index) => (
          <li key={groupName} className="mb-2">
            <Link
              to={`/group/${groupName}`}
              className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-600 active:bg-slate-200 border-l-4 hover:border-indigo-500 p-2"
            >
              {groupName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

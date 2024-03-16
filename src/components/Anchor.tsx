import { Link } from "react-router-dom";

function Anchor({ toUrl, name }: { toUrl: string; name: string }) {
  return (
    <Link
      to={toUrl}
      className="font-medium text-blue-600 dark:text-blue-500 hover:underline text-lg"
    >
      {name}
    </Link>
  );
}

export default Anchor;

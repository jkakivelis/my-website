import Link from "next/link";

const Header = () => {
  return (
    <ul className="flex gap-x-1 list-none bg-gray-200 p-4 rounded-lg">
      <li className="bg-white px-4 py-2 rounded shadow">
        <Link href="/" className="hover:underline">
          <b>HOME</b>
        </Link>
      </li>
      <li className="bg-white px-4 py-2 rounded shadow">
        <Link href="/archive" className="hover:underline">
          <b>ARCHIVE</b>
        </Link>
      </li>
    </ul>
  );
};

export default Header;
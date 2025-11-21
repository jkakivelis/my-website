import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col items-center space-y-2 py-4 bg-gray-100">
      <ul className="flex space-x-1 bg-gray-200">
        <li key="0" className="bg-white px-4 py-2 rounded shadow">
          <Link href="/" className="hover:underline">
            <b>HOME</b>
          </Link>
        </li>
        <li key="1" className="bg-white px-4 py-2 rounded shadow">
          <Link href="/archive" className="hover:underline">
            <b>ARCHIVE</b>
          </Link>
        </li>
        <li key="2" className="bg-white px-4 py-2 rounded shadow">
          <Link href="https://github.com/jkakivelis" className="hover:underline">
            <b>GITHUB</b>
          </Link>
        </li>
      </ul>
      <div className="text-sm text-gray-500">
        A website by James Kakivelis 
      </div>
      <div className="text-xs text-gray-400">
        © {new Date().getFullYear()} James Kakivelis. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
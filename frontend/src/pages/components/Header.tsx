import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 w-full h-28 bg-black bg-opacity-75 text-custom-color">
      <div className="flex items-center justify-between px-28 py-2">
        <Link to="/" className="text-custom-color">
          <img src="/public/logo fix.png" alt="logo ZV" className="w-24" />
        </Link>

        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="text-custom-color focus:outline-none"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        <nav className="hidden md:flex flex-grow justify-end space-x-4">
          <Link to="/" className="text-custom-color">
            Home
          </Link>
          <Link to="/profil" className="text-custom-color">
            Profile
          </Link>
          <Link to="/login" className="text-custom-color">
            Login
          </Link>
        </nav>
      </div>

      <div
        className={`fixed inset-y-0 right-0 w-1/2 h-1/3 bg-black bg-opacity-75 z-40 transform transition-transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
        aria-labelledby="menu"
      >
        <div className="flex flex-col items-center mt-10 space-y-4">
          <button
            type="button"
            className="absolute top-4 right-4 text-custom-color"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <Link
            to="/profil"
            className="text-custom-color text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/login"
            className="text-custom-color text-xl"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}

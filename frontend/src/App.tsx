import { createContext, useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import ScrollToTopButton from "./pages/components/ButtonScroll";
import { RiArrowUpDoubleFill } from "react-icons/ri";

export const TemaContext = createContext({
  tema: null,
  setTema: () => {},
});

export default function App() {
  const ref = useRef<HTMLDivElement>(null); // Tentukan tipe HTML yang benar

  const [tema, setTema] = useState("dark");
  const upClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" }); // Gunakan scrollIntoView dengan aman
  };

  useEffect(() => {
    console.log(`Tema berhasil Diubah keMode ${tema}`);
  }, [tema]);

  return (
    <>
      {/* <TemaContext.Provider value={{tema,setTema}}>
    <div className={tema === "light" ? "bg-gradient-to-r from-pink-400 to-pink-700" : "bg-gradient-to-b from-gray-800 to-black text-pink-400"}> */}
      <header>
        <Link to="/"></Link>
      </header>
      <Outlet />
      <button
        className="hidden sm:flex flex-col bottom-4 right-1 fixed  rounded-xl z-50"
        onClick={upClick}
      >
        <RiArrowUpDoubleFill />
      </button>
      {/* </div>
      </TemaContext.Provider>      */}
    </>
  );
}

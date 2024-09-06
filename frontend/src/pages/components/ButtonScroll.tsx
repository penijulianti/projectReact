import { useRef } from "react";
import { RiArrowUpDoubleFill } from "react-icons/ri";


export default function ButtonScroll() {
  const ref = useRef<HTMLDivElement>(null); // Tentukan tipe HTML yang benar

  const upClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" }); // Gunakan scrollIntoView dengan aman
  };

  return (
    <>
      <div ref={ref} /> {/* Ref dipasang pada elemen yang ingin di-scroll */}
      <button
        className="hidden sm:flex flex-col bottom-0 right-1 fixed"
        onClick={upClick}
      >
        <RiArrowUpDoubleFill />
      </button>
    </>
  );
}
}

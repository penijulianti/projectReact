import ListVideo from "../ListVideo";
import Footer from "../components/Footer";
import HeaderAdmin from "./HeaderAdmin";

export default function AllVideo(){
    return(
    <div className="relative flex flex-col min-h-screen">
      <HeaderAdmin/>
      <ListVideo />
      <Footer/>
    </div>
    )
}
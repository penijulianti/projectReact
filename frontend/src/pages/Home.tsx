
import ListVideo from './ListVideo';
import Footer from './components/Footer';
import Header from './components/Header';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <ListVideo />
      <Footer />
    </div>
  );
}

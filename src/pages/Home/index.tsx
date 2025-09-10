import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Products from "../../components/Items";
import { CartProvider } from "../../components/context/CartContext";
import Checkout from "../../components/Checkout";

export type ItemGato = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  foto: string;
  quantidade: number;
};

const Home = () => {
  return (
    <>
      <Header />
      <CartProvider>
        <Products />
        <Checkout />
      </CartProvider>
      <Footer />
    </>
  );
};

export default Home;

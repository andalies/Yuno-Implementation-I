import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Products from "../../components/Items";
import { AppProvider } from "../../components/context/app-context"; // <-- Provider
import Checkout from "../../components/Checkout";

const Home = () => {
  return (
    <>
      <Header />
      <AppProvider>
        <Products />
        <Checkout />
      </AppProvider>
      <Footer />
    </>
  );
};

export default Home;
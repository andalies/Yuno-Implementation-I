import { Provider } from "react-redux";
import { YunoProvider } from "./lib/yuno";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalCss } from "./styles";
import "./fonts.css";
import { store } from "./store";
import Home from "./pages/Home"; // evite .js numa app TS

function App() {
  return (
    <Provider store={store}>
      <YunoProvider>
        <BrowserRouter>
          <GlobalCss />
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </YunoProvider>
    </Provider>
  );
}

export default App;
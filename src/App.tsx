import { Provider } from "react-redux"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GlobalCss } from "./styles"
import "./fonts.css"
import { store } from "./store"
import Home from "./pages/Home"


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <GlobalCss />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import CreatePokemon from "./pages/CreatePokemon";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pokemon/:id" element={<Detail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/create" element={<CreatePokemon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

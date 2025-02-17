import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import FeedMain from "./pages/FeedMain";
import MyPage from "./pages/MyPage";
import FeedDetail from "./pages/FeedDetail";
import FeedAdd from "./pages/FeedAdd";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/feedmain" element={<FeedMain />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/feeddetail/:id" element={<FeedDetail />} />
        <Route path="/feedadd" element={<FeedAdd />} />
      </Routes>
    </>
  );
}

export default App;

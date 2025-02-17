import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Join from "./pages/Join";
import FeedMain from "./pages/FeedMain";
import MyPage from "./pages/MyPage";
import FeedAdd from "./pages/FeedAdd";
import FeedEdit from "./pages/FeedEdit";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/feedmain" element={<FeedMain />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/feededit/:feedId" element={<FeedEdit />} />
        <Route path="/feedadd" element={<FeedAdd />} />
      </Routes>
    </>
  );
}

export default App;

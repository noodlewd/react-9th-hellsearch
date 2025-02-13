import React, { useEffect, useState } from "react";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await supabase.from("user").select("*");

        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    await supabase.from("user").insert([{ e_mail: emailInput, password: pwInput }]);
  };

  const handleMoveJoin = () => {
    navigate("/join");
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <label>
          ID
          <input
            type="text"
            placeholder="아이디를 입력하세요."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </label>
        <label>
          PW
          <input
            type="text"
            placeholder="비밀번호를 입력하세요."
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
          />
        </label>
        <button onClick={handleLogin}>로그인</button>
        <button onClick={handleMoveJoin}>회원가입</button>
      </form>
    </div>
  );
};

export default Home;

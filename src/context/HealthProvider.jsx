import React, { createContext, useState } from "react";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";

export const HealthContext = createContext(null);
const HealthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNum, setPhoneNum] = useState(0);
  const navigate = useNavigate();

  // 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: emailInput, password: pwInput });
      if (error) {
        throw error;
      }

      alert("로그인 성공");

      const userId = data.user.id;
      const userEmail = data.user.email;

      const { data: existData, error: selectError } = await supabase
        .from("users")
        .select("nickname")
        .eq("user_id", userId);

      if (selectError) {
        console.log("user 테이블 조회 오류", selectError);
        return;
      }

      if (existData) {
        setNickname(existData[0].nickname);
      }

      alert(`${existData[0].nickname}님 환영합니다!`);
      navigate("/feedmain");
    } catch (error) {
      console.log("로그인 오류", error);
    }
  };

  const handleMoveJoin = () => {
    navigate("/join");
  };

  const value = {
    email,
    setEmail,
    password,
    setPassword,
    nickname,
    setNickname,
    phoneNum,
    setPhoneNum,
    handleLogin,
    emailInput,
    setEmailInput,
    pwInput,
    setPwInput,
    handleMoveJoin,
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};

export default HealthProvider;

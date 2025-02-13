import { useContext, useState } from "react";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";
import { HealthContext } from "../context/HealthProvider";

const Join = () => {
  const { email, setEmail, password, setPassword } = useContext(HealthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await supabase.auth.signUp({
        email,
        password,
      });

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/");
    } catch (error) {
      alert(error.message);
      console.error("회원가입 오류:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h2>회원가입 페이지</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">회원가입</button>
        <button onClick={handleBack}>뒤로가기</button>
      </form>
    </div>
  );
};

export default Join;

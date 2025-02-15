import React, { useContext } from "react";
import { HealthContext } from "../context/HealthProvider";
import { LoginBox, LoginForm, LoginInput, LoginLabel, LoginLogo } from "../styled/UserComponent";
import { UserButton } from "../styled/StyledComponents";
import loginlogo from "../assets/loginlogo.png";
const Home = () => {
  const { handleLogin, emailInput, setEmailInput, pwInput, setPwInput, handleMoveJoin } = useContext(HealthContext);

  // 로그인

  // 회원가입 페이지 이동

  return (
    <LoginBox>
      <LoginLogo src={loginlogo} alt="logo" />
      <h2>로그인</h2>
      <LoginForm onSubmit={handleLogin}>
        <LoginLabel>
          ID
          <LoginInput
            type="text"
            placeholder="아이디를 입력하세요."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
        </LoginLabel>
        <LoginLabel>
          PW
          <LoginInput
            type="text"
            placeholder="비밀번호를 입력하세요."
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            required
          />
        </LoginLabel>
        <UserButton type="submit">로그인</UserButton>
        <UserButton type="button" onClick={handleMoveJoin}>
          회원가입
        </UserButton>
      </LoginForm>
    </LoginBox>
  );
};

export default Home;

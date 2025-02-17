import React, { useContext } from "react";
import { HealthContext } from "../context/HealthProvider";
import { LoginBox, LoginForm, LoginInput, LoginLabel, LoginLogo, LoginTitle } from "../styled/UserLoginComponent";
import { UserButton } from "../styled/StyledComponents";
import loginlogo from "../assets/loginlogo.png";

const Home = () => {

  // context api 사용하여 가져오기
  const { handleLogin, emailInput, setEmailInput, pwInput, setPwInput, handleMoveJoin } = useContext(HealthContext);

  return (
    <LoginBox>
      <LoginLogo src={loginlogo} alt="logo" />
      <LoginTitle>로그인</LoginTitle>
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
            type="password"
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

import { useContext, useState } from "react";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";
import { HealthContext } from "../context/HealthProvider";
import { JoinBox, JoinForm, JoinInput, JoinLabel, JoinTitle } from "../styled/UserJoinComponent";
import { UserButton } from "../styled/StyledComponents";
import Swal from "sweetalert2";

const Join = () => {
  const { email, setEmail, password, setPassword, nickname, setNickname, phoneNum, setPhoneNum } =
    useContext(HealthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error; // 회원가입 오류 발생 시 예외 처리
      }

      if (!data.user) {
        throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
      }

      // 회원가입이 성공한 경우에만 user_id 사용
      const { data: userInfo, error: insertError } = await supabase.from("users").insert([
        {
          user_id: data.user.id,
          e_mail: email,
          nickname: nickname,
          phone_num: phoneNum,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setNickname(nickname);
      Swal.fire("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
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
    <JoinBox>
      <JoinTitle>회원가입 페이지</JoinTitle>
      <JoinForm onSubmit={handleSignup}>
        <JoinLabel>
          <JoinInput
            type="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </JoinLabel>
        <JoinLabel>
          <JoinInput
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </JoinLabel>
        <JoinLabel>
          <JoinInput
            type="text"
            placeholder="사용하실 닉네임을 입력해주세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </JoinLabel>
        <JoinLabel>
          <JoinInput
            type="number"
            placeholder="사용하시는 휴대폰 번호를 입력해주세요."
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
        </JoinLabel>
        <UserButton type="submit">회원등록</UserButton>
        <UserButton onClick={handleBack}>뒤로가기</UserButton>
      </JoinForm>
    </JoinBox>
  );
};

export default Join;

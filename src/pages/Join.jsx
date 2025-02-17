import { useContext, useState } from "react";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";
import { HealthContext } from "../context/HealthProvider";
import { JoinBox, JoinForm, JoinInput, JoinLabel, JoinTitle } from "../styled/UserJoinComponent";
import { UserButton } from "../styled/StyledComponents";
import Swal from "sweetalert2";

const Join = () => {
  // context api 사용하여 가져오기
  const { email, setEmail, password, setPassword, nickname, setNickname, phoneNum, setPhoneNum } =
    useContext(HealthContext);
  // 페이지 이동(useNavigate hook)
  const navigate = useNavigate();

  // 회원가입 로직
  const handleSignup = async (e) => {
    // 폼 기본동작 방지
    e.preventDefault();
    // supabase의 email,password를 이용하여 회원가입 요청
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      // 회원가입 오류 발생 시 예외 처리
      if (error) {
        throw error;
      }
      // 예외 발생
      if (!data.user) {
        throw new Error("회원가입에 실패했습니다. 다시 시도해주세요.");
      }

      // 회원가입이 성공 시 users 테이블에 데이터 저장
      const { data: userInfo, error: insertError } = await supabase.from("users").insert([
        {
          user_id: data.user.id,
          e_mail: email,
          nickname: nickname,
          phone_num: phoneNum,
        },
      ]);

      // 데이터 저장 중 예외 처리
      if (insertError) {
        throw insertError;
      }

      // 닉네임 상태 업데이트
      setNickname(nickname);
      // sweetalert2 를 이용하여 알림창 스타일 설정
      Swal.fire("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      // 로그인 페이지 이동
      navigate("/");
    } catch (error) {
      alert(error.message);
      console.error("회원가입 오류:", error);
    }
  };
  // 뒤로가기 버튼 클릭 시 이전 페이지 이동
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

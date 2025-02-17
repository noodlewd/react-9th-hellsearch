import React, { useContext, useEffect } from "react";
import { HealthContext } from "../context/HealthProvider";
import supabase from "../supabase/client";
import { useNavigate } from "react-router-dom";

const FeedMain = () => {
  const navigate = useNavigate();
  const { nickname } = useContext(HealthContext);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/");
    } catch (error) {
      console.log("로그아웃 오류", error);
    }
  };

  useEffect(() => {
    // 사용자가 세션정보가 없는 경우 리다이렉션
    const session = supabase.auth.getSession();
    if (!session) {
      alert("비정상적인 접근입니다. 로그인을 먼저 해주세요.");
      navigate("/");
    }
    // 인증 상태 변경시 확인하는 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        alert("세션이 만료 되었습니다. 다시 로그인 해주세요.");
        navigate("/");
      }
    });
    return () => {
      authListener();
    };
  }, [navigate]);
  return (
    <div>
      <h2>{nickname}페이지</h2>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default FeedMain;

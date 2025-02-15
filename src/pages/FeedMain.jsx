import React, { useContext } from "react";
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

  return (
    <div>
      <h2>{nickname}페이지</h2>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
};

export default FeedMain;

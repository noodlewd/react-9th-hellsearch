import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HealthContext } from "./context/HealthProvider";
import supabase from "./supabase/client";

const FeedContent = ({ feed }) => {
  const [likes, setLikes] = useState(0); // 좋아요 상태 관리
  const [isToggled, setIsToggled] = useState(false); // 버튼 토글 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  //드롭다운 버튼
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // 좋아요 버튼 핸들러
  const likeBtnHandler = (id) => {
    e.stopPropagation();
    setIsToggled((prevState) => ({
      ...prevState[id],
    }));

    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: prevLikes[id] ? prevLikes[id] - 1 : 1, //좋아요 증가/감소
    }));
  };
  const id = 1;

  const navigateDetailHandler = (e) => {
    e.stopPropagation();
    navigate(`/feedDetail/:${id}`);
  };

  const feedDeleteHandler = async (e, feed_Id) => {
    try {
      e.stopPropagation();

      // 현재 로그인한 유저 가져오기
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      console.log("현재 로그인한 유저 ID:", user.user.id);
      console.log("삭제 요청할 feed_id:", feed_Id);

      // 삭제 요청 (user_id 조건 추가)
      const { data, error } = await supabase
        .from("feeds")
        .delete()
        .eq("feed_id", feed_Id);
      // .eq("user_id", user.user.id); // 👉 user_id 조건 추가
      // .select(); // 삭제된 데이터 반환

      if (error) throw error;

      console.log("🗑️ 삭제된 데이터:", data);
    } catch (error) {
      console.error("❌ 삭제 오류:", error.message);
    }
  };

  return (
    <div onClick={navigateDetailHandler}>
      <div key={feed.feed_id} style={{ border: "1px solid green" }}>
        <p>{feed.nickname}</p>
        {/* 이미지가 있으면 출력하고 없으면 아무것도 출력안함 */}
        {feed.content_img && (
          <img
            src={feed.content_img}
            alt="피드 이미지"
            style={{ width: "600px" }}
          />
        )}
        <div>
          <p>{feed.title}</p>
          <p>좋아요: {likes[feed.id] || 0}</p>
          <button onClick={() => likeBtnHandler(feed.id)}>
            {isToggled[feed.id] ? "좋아요 취소" : "좋아요"}
          </button>
          <button>댓글 달기</button>
        </div>
        <button onClick={toggleDropdown}>{isOpen ? "닫기" : "..."}</button>
        {isOpen && (
          <div>
            <button>수정</button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                console.log("삭제할 feed_id:", feed.feed_id);
                feedDeleteHandler(event, feed.feed_id);
              }}
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedContent;

import React, { useEffect, useState } from "react";
import supabase from "./supabase/client";

const FeedContent = ({ feed }) => {
  const [feeds, setFeeds] = useState([]); // 피드 담을 배열
  const [likes, setLikes] = useState(0); // 좋아요 상태 관리
  const [isToggled, setIsToggled] = useState(false); // 버튼 토글 상태 관리
  const [isOpen, setIsOpen] = useState(false);

  // feed 테이블에서 userid를 가진 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const { data: feedsData, error } = await supabase
        .from("feeds")
        .select("*");
      if (error) {
        console.error("데이터 불러오기 실패:", error);
      } else {
        setFeeds(feedsData);
      }
    };
    fetchData();
  }, []);

  //드롭다운 버튼
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  // 좋아요 버튼 핸들러
  const likeBtnHandler = (id) => {
    setIsToggled((prevState) => ({
      ...prevState[id],
    }));

    setLikes((prevLikes) => ({
      ...prevLikes,
      [id]: prevLikes[id] ? prevLikes[id] - 1 : 1, //좋아요 증가/감소
    }));
  };

  return (
    <div>
      <div key={feed.id}>
        <p>{feed.nickname}</p>
        {/* 이미지가 있으면 출력하고 없으면 아무것도 출력안함 */}
        {feed.content_img && <img src={feed.content_img} alt="피드 이미지" />} 
        <div>
          <p>{feed.title}</p>
          <p>좋아요: {likes[feed.id] || 0}</p>
          <button onClick={() => likeBtnHandler(feed.id)}>
            {isToggled[feed.id] ? "좋아요 취소" : "좋아요"}
          </button>
          <button>댓글 달기</button>
        </div>
        <button onClick={toggleDropdown}>
        {isOpen ? '닫기' : '...'}
      </button>
      {isOpen && (
        <div>
          <button>수정</button>
          <button>삭제</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default FeedContent;

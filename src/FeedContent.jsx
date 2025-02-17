import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HealthContext } from "./context/HealthProvider";
import supabase from "./supabase/client";
const FeedContent = ({ feed, onDeleteFeed }) => {
  const [likes, setLikes] = useState(0); // 좋아요 상태 관리
  const [isToggled, setIsToggled] = useState(false); // 버튼 토글 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  //드롭다운 버튼
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  // 좋아요 버튼 핸들러
  const likeBtnHandler = (e, id) => {
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
        .eq("feed_id", feed_Id)
        .eq("user_id", user.user.id); // :오른쪽을_가리키는_손_모양: user_id 조건 추가
      if (error) throw error;
      console.log("삭제된 데이터:", data);
      onDeleteFeed(feed_Id);
    } catch (error) {
      console.error("삭제 오류:", error.message);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      console.log(user);
      if (error) {
        console.error("유저 정보 가져오기 실패:", error.message);
      } else {
        setUserId(user.user.id);
      }
    };
    fetchUser();
  }, []);
  return (
    <Container>
      <FeedCard onClick={navigateDetailHandler}>
        <div key={feed.feed_id}>
          <p>{feed.nickname}</p>
          {/* 이미지가 있으면 출력하고 없으면 아무것도 출력안함 */}
          {feed.content_img && (
            <FeedImage src={feed.content_img} alt="피드 이미지" />
          )}
          <div>
            <p>{feed.title}</p>
            <p>좋아요: {likes[feed.id] || 0}</p>
            <button onClick={(e) => likeBtnHandler(e, feed.id)}>
              {isToggled[feed.id] ? "좋아요 취소" : "좋아요"}
            </button>
            <button>댓글 달기</button>
          </div>
          <button onClick={toggleDropdown}>{isOpen ? "닫기" : "..."}</button>
          {isOpen && (
            <Dropdown>
              <button>수정</button>
              {userId === feed.user_id && (
                <button
                  onClick={(event) => feedDeleteHandler(event, feed.feed_id)}
                >
                  삭제
                </button>
              )}
            </Dropdown>
          )}
        </div>
      </FeedCard>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  background-color: rgb(217, 217, 217);
`;

const FeedCard = styled.div`
  border: 1px solid green;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  padding: 10px;
  margin: 10px auto;
  background-color: #fff;
  border-radius: 10px;

  button {
    margin: 5px;
    padding: 5px;
  }
`;

const FeedImage = styled.img`
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
`;

const Dropdown = styled.div`
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
export default FeedContent;

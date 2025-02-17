import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import supabase from "./supabase/client";

const FeedContent = ({ feed, onDeleteFeed, onUpdateFeed }) => {
  const [likes, setLikes] = useState(0);
  const [isToggled, setIsToggled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const likeBtnHandler = (e, id) => {
    e.stopPropagation();
    setIsToggled((prevState) => ({ ...prevState[id] }));
    setLikes((prevLikes) => ({ ...prevLikes, [id]: prevLikes[id] ? prevLikes[id] - 1 : 1 }));
  };

  const feedDeleteHandler = async (e, feed_Id) => {
    try {
      e.stopPropagation();
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const { data, error } = await supabase.from("feeds").delete().eq("feed_id", feed_Id).eq("user_id", user.user.id);
      if (error) throw error;
      onDeleteFeed(feed_Id);
    } catch (error) {
      console.error("삭제 오류:", error.message);
    }
  };

  const navigateEditHandler = (e, feedId) => {
    e.stopPropagation();
    navigate(`/feededit/${feedId}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser();
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
      <FeedCard>
        <div key={feed.feed_id}>
          <p>{feed.nickname}</p>
          {feed.content_img && <FeedImage src={feed.content_img} alt="피드 이미지" />}
          <div>
            <p>{feed.title}</p>
            <p>좋아요: {likes[feed.id] || 0}</p>
            <div>{feed.content}</div>
            <button onClick={(e) => likeBtnHandler(e, feed.id)}>{isToggled[feed.id] ? "좋아요 취소" : "좋아요"}</button>
            <button>댓글 달기</button>
          </div>
          <button onClick={toggleDropdown}>{isOpen ? "닫기" : "..."}</button>
          {isOpen && userId && userId === feed.user_id && (
            <Dropdown>
              <button onClick={(event) => navigateEditHandler(event, feed.feed_id)}>수정</button>
              <button onClick={(event) => feedDeleteHandler(event, feed.feed_id)}>삭제</button>
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

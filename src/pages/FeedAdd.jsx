import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import supabase from "../supabase/client";
import Swal from "sweetalert2";

const FeedAdd = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  //  로그인 여부 확인
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        Swal.fire("로그인이 필요합니다.");
        navigate("/"); // 로그인 페이지로 이동
      } else {
        setUser(data.user);
      }
    };

    checkUser();
  }, [navigate]);

  //  피드 등록 핸들러
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setNickname(user.nickname);

    // 로그인 여부 다시 체크
    if (!user) {
      Swal.fire("로그인이 필요합니다.");
      return;
    }

    let imageUrl = null;

    //  이미지 업로드 처리
    if (image) {
      const filePath = `public/${Date.now()}_${image.name}`;
      const { data, error: uploadError } = await supabase.storage.from("feed_img").upload(filePath, image);

      if (uploadError) {
        console.error("이미지 업로드 실패:", uploadError);
        return;
      }

      //  업로드된 이미지 URL 가져오기
      const { data: urlData } = supabase.storage.from("feed_img").getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    //  피드 데이터 삽입 (user_id 추가)
    const { error } = await supabase.from("feeds").insert({
      title: title,
      content_img: imageUrl,
      content: content,
      user_id: user.id, // 현재 로그인한 사용자 ID 추가
      nickname: nickname,
    });

    if (error) {
      console.error("피드 등록 실패:", error);
      return;
    }

    Swal.fire("피드가 성공적으로</br> 등록되었습니다.");
    navigate("/feedmain");
  };

  const goMainClick = () => {
    navigate("/feedmain");
  };

  return (
    <>
      <Container onSubmit={onSubmitHandler}>
        <AddTitle>피드 추가 페이지</AddTitle>
        <AddLabel>
          제목
          <AddInput
            type="text"
            value={title}
            placeholder="제목을 입력하세요."
            onChange={(e) => setTitle(e.target.value)}
          />
        </AddLabel>
        <AddLabel>
          내용
          <AddInput
            type="text"
            value={content}
            placeholder="내용을 입력하세요."
            onChange={(e) => setContent(e.target.value)}
          />
        </AddLabel>
        <AddInput type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <div>
          <AddButton type="submit">등록하기</AddButton>
          <AddButton type="button" onClick={goMainClick}>
            뒤로가기
          </AddButton>
        </div>
      </Container>
    </>
  );
};

const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 3rem;
  justify-content: center;
  align-items: center;
  min-height: 50vh;

  button {
    padding: 10px;
    margin: 5px;
  }
`;

const AddTitle = styled.h2`
  margin-top: 100px;
`;

const AddLabel = styled.label`
  display: flex;
  flex-direction: column;
  line-height: 30px;
`;

const AddInput = styled.input`
  width: 400px;
  height: 50px;
`;

const AddButton = styled.button`
  margin-top: 20px;
  background-color: rgb(216, 216, 216);
  width: 200px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(0.95);
  }
`;

export default FeedAdd;

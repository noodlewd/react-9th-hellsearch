import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/client";

const FeedAdd = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //  로그인 여부 확인
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        alert("로그인이 필요합니다.");
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

    // 로그인 여부 다시 체크
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    let imageUrl = null;

    //  이미지 업로드 처리
    if (image) {
      const filePath = `public/${Date.now()}_${image.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("feed_img")
        .upload(filePath, image);

      if (uploadError) {
        console.error("이미지 업로드 실패:", uploadError);
        return;
      }

      //  업로드된 이미지 URL 가져오기
      const { data: urlData } = supabase.storage
        .from("feed_img")
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    //  피드 데이터 삽입 (user_id 추가)
    const { error } = await supabase.from("feeds").insert({
      title: title,
      content_img: imageUrl,
      content: content,
      user_id: user.id, // 현재 로그인한 사용자 ID 추가
      nickname: user.nickname,
    });

    if (error) {
      console.error("피드 등록 실패:", error);
      return;
    }

    alert("피드가 성공적으로 등록되었습니다.");
    navigate("/feedmain");
  };

  const goMainClick = () => {
    navigate("/feedmain");
  };

  return (
    <>
      <h1>피드 추가 페이지</h1>
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          value={title}
          placeholder="제목을 입력하세요."
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <input
          type="text"
          value={content}
          placeholder="내용을 입력하세요."
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">등록하기</button>
        <button type="button" onClick={goMainClick}>
          뒤로가기
        </button>
      </form>
    </>
  );
};

export default FeedAdd;

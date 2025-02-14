import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/client";

const FeedAdd = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let imageUrl = null;

    if (image) {
      const { data, error: uploadError } = await supabase.storage
        .from("feed_img")
        .upload(`public/${Date.now()}${image.name}`, image);

      if (uploadError) {
        console.error("이미지 업로드 실패:", uploadError);
        return;
      } else {
        console.log("이미지 업로드 성공:", data);
        imageUrl = `${supabase.storage
          .from("feed_img")
          .getPublicUrl(`public/${image.name}`)}`;
      }
    }

    const { data, error } = await supabase.from("feeds").insert({
      title: title,
      content_img: imageUrl,
      content: content,
    });
    if (error) throw error;

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
// 제목, 이미지, 내용 인풋데이터

export default FeedAdd;

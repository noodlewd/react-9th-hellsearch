import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase/client";
import { HealthContext } from "../context/HealthProvider";

// 댓글 수정삭제 넣어야함 // 머지시급

const MyDetail = () => {
  const { nickname } = useContext(HealthContext);
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // 게시글 정보 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();
      if (error) console.log("게시글 불러오기 오류:", error);
      else setPost(data);
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId);
      if (error) console.log("댓글 불러오기 오류:", error);
      else setComments(data);
    };

    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId);
      if (error) console.log("좋아요 불러오기 오류:", error);
      else {
        setLikes(data.length);
        setIsLiked(data.some((like) => like.user_id === nickname));
      }
    };

    fetchPost();
    fetchComments();
    fetchLikes();
  }, [postId, nickname]);

  // 댓글 추가하기
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert([
        { post_id: postId, writer_id: nickname, nickname, content: newComment },
      ]);

    if (error) console.log("댓글 추가 오류:", error);
    else {
      setComments([...comments, data[0]]);
      setNewComment("");
    }
  };

  // 좋아요 버튼 클릭
  const handleLike = async () => {
    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", nickname);
      setLikes(likes - 1);
    } else {
      await supabase
        .from("likes")
        .insert([{ post_id: postId, user_id: nickname }]);
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  if (!post) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>{post.nickname}님의 게시글</h2>
      <img
        src={post.image_url || "/default.png"}
        alt="게시글 이미지"
        style={{ width: "100%" }}
      />
      <p>{post.content}</p>

      <button onClick={handleLike}>
        {isLiked ? "❤️" : "🤍"} {likes}
      </button>

      <h3>댓글</h3>
      {nickname && (
        <form onSubmit={handleAddComment}>
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">댓글 작성</button>
        </form>
      )}

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <strong>{comment.nickname}</strong>: {comment.content}
          </div>
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}
    </div>
  );
};

export default MyDetail;

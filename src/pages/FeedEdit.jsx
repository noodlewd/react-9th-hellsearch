import { useLocation, useNavigate, useParams } from "react-router-dom";
import supabase from "../supabase/client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { EditArea, EditBox, EditButton, EditForm, EditInput, EditLabel } from "../styled/FeedEditComponent";

const FeedEdit = () => {
  const { feedId } = useParams();
  const [feed, setFeed] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const backEditBtn = () => {
    navigate(-1); // 뒤로가기
  };

  // useLocation을 사용해 state 받아오기
  const location = useLocation();
  const { onUpdateFeed } = location.state || {}; // state가 없을 수도 있으므로 기본값을 설정

  useEffect(() => {
    const fetchFeed = async () => {
      const { data, error } = await supabase.from("feeds").select("*").eq("feed_id", feedId);

      if (error) {
        console.log("피드 불러오기 오류", error);
      } else if (data && data.length > 0) {
        setFeed(data[0]); // 수정할 피드 데이터를 받아옴
        setTitle(data[0].title);
        setContent(data[0].content);
      } else {
        console.log("피드가 없습니다.");
      }
    };
    fetchFeed();
  }, [feedId]);

  const handleUpdateEdit = async () => {
    try {
      Swal.fire(`게시글 수정이 완료되었습니다.`);
      console.log("업데이트 요청 시작:", { title, content, feedId });

      // 첫 번째: feedId로 데이터를 조회하여 해당 피드가 있는지 확인
      const { data: currentFeed, error: fetchError } = await supabase
        .from("feeds")
        .select("*")
        .eq("feed_id", feedId)
        .single(); // 단일 항목만 반환

      if (fetchError) {
        console.log("피드 데이터 조회 오류", fetchError);
        return; // 데이터 조회 오류가 있을 경우 업데이트 처리하지 않음
      }

      // 데이터가 없으면 해당 feedId에 대한 피드가 없다는 메시지 출력
      if (!currentFeed) {
        console.log("해당 feedId에 대한 피드가 존재하지 않습니다.");
        return;
      }

      console.log("현재 피드 데이터:", currentFeed); // 데이터를 확인해봄

      // 두 번째: 업데이트 쿼리 실행
      const { data, error } = await supabase.from("feeds").update({ title, content }).eq("feed_id", feedId).single(); // 단일 항목만 반환

      if (error) {
        console.log("업데이트 오류", error);
      } else {
        console.log("업데이트된 데이터:", data);

        if (data) {
          console.log("업데이트 성공:", data);

          if (onUpdateFeed) {
            onUpdateFeed(data); // onUpdateFeed 호출하여 FeedMain에서 업데이트 반영
          }

          // 네비게이션: 피드 수정 완료 후 이전 페이지로 돌아가기
          navigate(-1); // 뒤로 가기 (FeedMain으로 돌아가기)
        } else {
          console.log("업데이트된 데이터가 없습니다.");
        }
      }
    } catch (error) {
      console.log("업데이트 처리 오류", error);
    }
  };

  return (
    <EditBox>
      <h2>게시글 수정</h2>
      <EditForm>
        <EditLabel>제목</EditLabel>
        <EditInput type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </EditForm>
      <EditForm>
        <EditLabel>내용</EditLabel>
        <EditArea value={content} onChange={(e) => setContent(e.target.value)}></EditArea>
      </EditForm>
      <EditButton onClick={handleUpdateEdit}>수정 완료</EditButton>
      <EditButton onClick={backEditBtn}>뒤로가기</EditButton>
    </EditBox>
  );
};

export default FeedEdit;

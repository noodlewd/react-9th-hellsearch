import { useContext, useEffect, useState } from "react";
import supabase from "../supabase/client";
import CommonNavBar from "../Common Components/CommonNavBar";
import { HealthContext } from "../context/HealthProvider";
import { StFeedAddIcon } from "../styled/StyledComponents";
import { Link, useNavigate } from "react-router-dom";
import { BottomScrollListener } from "react-bottom-scroll-listener";

const FeedMain = () => {
  const [allFeed, setAllFeed] = useState([]);
  const { searchedFeed } = useContext(HealthContext);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const getFeeds = async (page) => {
    try {
      const { data, error } = await supabase
        .from("feeds")
        .select("*")
        .range((page - 1) * 8, page * 8 - 1); //슈베에서 8개씩 범위를 지정하여 data에 할당
      if (error) throw error;
      setAllFeed([...allFeed, ...data]); //함수형으로 작성시 글이 중복 랜더링된 문제 수정
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //page가 증가할때마 getFeeds호출
    getFeeds(page);
  }, [page]);

  const handelBottomScroll = () => {
    //BottomScrollListener를 통해 페이지의 하단일 경우 호출되는함수(페이지를 한개 추가)
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    // 사용자가 세션정보가 없는 경우 리다이렉션 && notice: 테스트시에는 이 부붑을 주석 처리할것
    const session = supabase.auth.getSession(); //!잘은 이해 못했지만 session을 사용하면 세션객체가 null인경우 undefined가 리턴되어 예상치 못한 경우가 생겨서 getSession사용

    if (!session) {
      alert("비정상적인 접근입니다. 로그인을 먼저 해주세요.");
      navigate("/");
    }

    // 인증 상태 변경시 확인하는 리스너
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          alert("세션이 만료 되었습니다. 다시 로그인 해주세요.");
          navigate("/");
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, [navigate]);

  return (
    <>
      <CommonNavBar allFeed={allFeed} setAllFeed={setAllFeed} />
      {(searchedFeed.length > 0 ? searchedFeed : allFeed).map((e) => {
        return (
          /*여기를 나중에 feedContetn로 대체하고 propdrilling*/
          <div key={e.feed_id} style={{ border: "1px solid green" }}>
            <span>제목:{e.title}</span>
            <br />
            <span>작성자:{e.nickname}</span>
            <br />
            <img src={e.content_img} style={{ width: "500px" }} />
            <br />
            <span>내용:{e.content}</span>
            <br />
            <span>created_at:{e.created_at}</span>
            <br />
            <span>updated_at:{e.updated_at}</span>
          </div>
        );
      })}
      {/* <FeedContent feed_id={feed_id} title={e.title} nickname={e.nickname} 
      content_img={e.content_img} content={e.content} updated_at={e.updated_at}/>
      이 부분을map함수안에 할당*/}
      <BottomScrollListener onBottom={handelBottomScroll} />
      <Link to={"/feedadd"}>
        <StFeedAddIcon />
      </Link>
    </>
  );
};

export default FeedMain;
import { useContext, useEffect, useState } from "react";
import supabase from "../supabase/client";
import CommonNavBar from "../Common Components/CommonNavBar";
import { HealthContext } from "../context/HealthProvider";
import { StFeedAddIcon } from "../styled/StyledComponents";
import { Link, useNavigate } from "react-router-dom";
import { BottomScrollListener } from "react-bottom-scroll-listener";
import FeedContent from "../FeedContent";
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
  const handleDeleteFeed = (feedId) => {
    setAllFeed((prevFeeds) =>
      prevFeeds.filter((feed) => feed.feed_id !== feedId)
    );
  };
  useEffect(() => {
    //   // 사용자가 세션정보가 없는 경우 리다이렉션 && notice: 테스트시에는 이 부붑을 주석 처리할것
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        alert("세션이 만료 되었습니다. 다시 로그인 해주세요.");
        navigate("/");
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  return (
    <>
      <CommonNavBar allFeed={allFeed} setAllFeed={setAllFeed} />
      {(searchedFeed.length > 0 ? searchedFeed : allFeed).map((e) => {
        return <FeedContent feed={e} onDeleteFeed={handleDeleteFeed} />;
      })}
      <BottomScrollListener onBottom={handelBottomScroll} />
      <Link to={"/feedadd"}>
        <StFeedAddIcon />
      </Link>
    </>
  );
};
export default FeedMain;

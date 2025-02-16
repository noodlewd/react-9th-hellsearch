import { useContext, useEffect, useState } from "react";
import supabase from "../supabase/client";
import CommonNavBar from "../Common Components/CommonNavBar";
import { HealthContext } from "../context/HealthProvider";
import { StFeedAddIcon } from "../styled/StyledComponents";
import { Link } from "react-router-dom";
import { BottomScrollListener } from "react-bottom-scroll-listener";

const FeedMain = () => {
  const [allFeed, setAllFeed] = useState([]);
  const { searchedFeed } = useContext(HealthContext);
  const [page, setPage] = useState(1);

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

  return (
    <>
      <CommonNavBar allFeed={allFeed} setAllFeed={setAllFeed} />
      {(searchedFeed.length > 0 ? searchedFeed : allFeed).map((e) => {
        return (
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
      <BottomScrollListener onBottom={handelBottomScroll} />
      <Link to={"/feedadd"}>
        <StFeedAddIcon>+글작성</StFeedAddIcon>
      </Link>
    </>
  );
};

export default FeedMain;

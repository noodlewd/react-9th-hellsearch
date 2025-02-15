import { useContext, useEffect, useState } from "react";
import supabase from "../supabase/client";
import CommonNavBar from "../Common Components/CommonNavBar";
import { HealthContext } from "../context/HealthProvider";
import { StFeedAddIcon } from "../styled/StyledComponents";
import { Link } from "react-router-dom";

const FeedMain = () => {
  const [allFeed, setAllFeed] = useState([]);
  const { searchedFeed } = useContext(HealthContext);

  useEffect(() => {
    const getFeeds = async () => {
      try {
        const { data, error } = await supabase.from("feeds").select("*");
        if (error) throw error;
        console.log(data);
        setAllFeed(data);
      } catch (error) {
        console.log(error);
      }
    };
    getFeeds();
  }, []);

  return (
    <>
      <CommonNavBar allFeed={allFeed} setAllFeed={setAllFeed} />
      {(searchedFeed.length > 0 ? searchedFeed : allFeed).map((e) => {
        return (
          <div key={e.feed_id} style={{ border: "1px solid green" }}>
            <span>제목:{e.title}</span>
            <br />
            <span>이미지:{e.img}</span>
            <br />
            <span>내용:{e.content}</span>
            <br />
            <span>created_at:{e.created_at}</span>
            <br />
            <span>updated_at:{e.updated_at}</span>
          </div>
        );
      })}
      <Link to={"/feedadd"}>
        <StFeedAddIcon>+글작성</StFeedAddIcon>
      </Link>
    </>
  );
};

export default FeedMain;

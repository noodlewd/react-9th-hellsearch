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
        .range((page - 1) * 8, page * 8 - 1);
      if (error) throw error;
      setAllFeed([...allFeed, ...data]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeeds(page);
  }, [page]);

  const handelBottomScroll = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleDeleteFeed = (feedId) => {
    setAllFeed((prevFeeds) => prevFeeds.filter((feed) => feed.feed_id !== feedId));
  };

  const handleUpdateFeed = (updatedFeed) => {
    setAllFeed((prevFeeds) => prevFeeds.map((feed) => (feed.feed_id === updatedFeed.feed_id ? updatedFeed : feed)));
  };

  useEffect(() => {
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
      {(searchedFeed.length > 0 ? searchedFeed : allFeed).map((e) => (
        <div key={e.feed_id}>
          <FeedContent feed={e} onDeleteFeed={handleDeleteFeed} onUpdateFeed={handleUpdateFeed} />
        </div>
      ))}
      <BottomScrollListener onBottom={handelBottomScroll} />
      <Link to="/feedadd">
        <StFeedAddIcon />
      </Link>
    </>
  );
};

export default FeedMain;

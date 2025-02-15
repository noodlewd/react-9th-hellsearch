import React, { useState } from "react";

const FeedDetail = () => {
  const [allFeed, setAllFeed] = useState([]);
  
  return (
    <>
      {allFeed.map((e) => {
        <FeedContent />;
      })}
    </>
  );
};

export default FeedDetail;

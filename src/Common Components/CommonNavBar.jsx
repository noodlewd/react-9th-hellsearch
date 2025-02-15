import { useContext, useEffect } from "react";
import { HealthContext } from "../context/HealthProvider";
import { Link } from "react-router-dom";
import { StLogoIcon, StMyPageIcon } from "../styled/StyledComponents";
import logo from "../assets/logoIcon.png";
import log from "../assets/mypageIcon.png";

const CommonNavBar = ({ allFeed, setAllFeed }) => {
  const { searchKey, setSearchKey, setSearchedFeed } =
    useContext(HealthContext);

  const handleSearchBtn = () => {
    //검색 버튼 클릭시
    const searchedData = allFeed.filter((e) => {
      return e.title.includes(searchKey) || e.content.includes(searchKey);
    });

    setSearchedFeed(searchedData);
  };

  return (
    <nav>
      <span>
        <Link to={"/feedmain"}>
          <StLogoIcon src={logo} />
        </Link>
      </span>
      <span>
        <input
          type="text"
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
        ></input>
        <button onClick={handleSearchBtn}>검색</button>
      </span>
      <Link to={"/mypage"}>
        <StMyPageIcon src={log} />
      </Link>
    </nav>
  );
};

export default CommonNavBar;

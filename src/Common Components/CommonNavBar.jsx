import { useContext, useEffect } from "react";
import { HealthContext } from "../context/HealthProvider";
import { Link } from "react-router-dom";
import {
  StLogoIcon,
  StMyPageIcon,
  StNavBarWrapper,
  StSearchBarWrapper,
} from "../styled/StyledComponents";
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
    <StNavBarWrapper>
      <span>
        <Link to={"/feedmain"}>
          <StLogoIcon src={logo} />
        </Link>
      </span>
      <StSearchBarWrapper>
        <input
          type="text"
          value={searchKey}
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
          placeholder="검색어를 입력해주세요"
        ></input>
        <button onClick={handleSearchBtn}>검색</button>
      </StSearchBarWrapper>
      <Link to={"/mypage"}>
        <StMyPageIcon src={log} />
      </Link>
    </StNavBarWrapper>
  );
};

export default CommonNavBar;

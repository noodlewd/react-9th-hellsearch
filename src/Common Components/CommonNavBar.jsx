import { useContext, useEffect, useRef, useState } from "react";
import { HealthContext } from "../context/HealthProvider";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import {
  StDropdownButton,
  StDropdownItem,
  StDropdownMenu,
  StDropdownWrapper,
  StLogoIcon,
  StMyPageIcon,
  StNavBarWrapper,
  StSearchBarWrapper,
} from "../styled/StyledComponents";
import logo from "../assets/logoIcon.png";
import log from "../assets/mypageIcon.png";
import supabase from "../supabase/client";

const CommonNavBar = ({ allFeed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { searchKey, setSearchKey, setSearchedFeed } =
    useContext(HealthContext);

  const isToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    //검색 버튼 클릭시
    const searchedData = allFeed.filter((e) => {
      return e.title.includes(searchKey) || e.content.includes(searchKey);
    });

    setSearchedFeed(searchedData);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      // 드롭다운 리스트가 아닌 다른 곳을 클릭했을때 === 컴포넌트 언마운트시
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut(); //notice: merge후 로그아웃 처리 되는지 체크해봐야함
      if (error) throw error;

      navigate("/");
    } catch (error) {
      console.log("로그아웃 오류", error);
    }
  };

  const onClickHandler = () => {
    //로고를 눌렀을때 검색창을 초기화하고 검색결과를 초기화하하는 함수
    setSearchKey("");
    setSearchedFeed([]);
  };

  return (
    <StNavBarWrapper>
      <span>
        <Link to={"/feedmain"} onClick={onClickHandler}>
          <StLogoIcon src={logo} />
        </Link>
      </span>
      <StSearchBarWrapper>
        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            placeholder="제목 & 내용 기반으로 검색"
          ></input>
          <button>검색</button>
        </form>
      </StSearchBarWrapper>
      <Link to={"/mypage"}>
        <StMyPageIcon src={log} />
      </Link>
      <StDropdownWrapper ref={dropdownRef}>
        <StDropdownButton onClick={isToggle} />
        <StDropdownMenu show={isOpen ? "true" : "false"}>
          <StDropdownItem onClick={handleLogout}>로그아웃</StDropdownItem>
        </StDropdownMenu>
      </StDropdownWrapper>
    </StNavBarWrapper>
  );
};

export default React.memo(CommonNavBar);

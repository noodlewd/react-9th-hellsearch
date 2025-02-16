import styled from "styled-components";
//페이지 메인 로고 크기
export const StLogoIcon = styled.img`
  width: 200px;
  height: 50px;
`;
//글쓰기 버튼 디자인
export const StFeedAddIcon = styled.div`
  border: 1px solid rgb(216, 216, 216);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 50px;
  right: 40px;
  position: fixed;
  background-color: rgb(216, 216, 216);
`;
//마이페이지 아이콘 크기 설정
export const StMyPageIcon = styled.img`
  width: 50px;
  height: 50px;
`;
//검색 창 위치선정
export const StSearchBarWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  input {
    padding: 5px;
    margin-right: 5px;
    width: 300px;
    height: 20px;
  }
`;
//네비게이션 바
export const StNavBarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
  width: calc(100% - 60px);
  background-color: rgb(216, 216, 216);
  padding: 10px;
  position: relative;
  height: 50px;
`;


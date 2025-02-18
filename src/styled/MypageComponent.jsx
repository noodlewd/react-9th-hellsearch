import styled from "styled-components";

export const MypageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

export const MypageTitle = styled.h2``;

export const MypageImg = styled.img`
  width: 300px;
  height: 200px;
`;

export const MypageButton = styled.button`
  margin-top: 20px;
  background-color: rgb(216, 216, 216);
  width: 408px;
  height: 50px;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:hover {
    transform: scale(0.95);
  }
`;

export const MypageLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

export const MypageInput = styled.input`
  width: 400px;
  height: 50px;
`;

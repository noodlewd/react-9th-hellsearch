import styled from "styled-components";

export const EditBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

export const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const EditLabel = styled.label`
  margin-top: 50px;
`;

export const EditInput = styled.input`
  width: 400px;
  height: 50px;
`;

export const EditArea = styled.textarea`
  width: 400px;
  height: 50px;
`;

export const EditButton = styled.button`
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

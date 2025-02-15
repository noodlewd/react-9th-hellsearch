import React from "react";
import styled from "styled-components";

export const LoginBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  line-height: 150px;
`;
export const LoginLogo = styled.img`
  width: 200px;
  height: 200px;
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const LoginLabel = styled.label`
  display: flex;
  flex-direction: column;
  line-height: 30px;
`;

export const LoginInput = styled.input`
  width: 400px;
  height: 50px;
`;

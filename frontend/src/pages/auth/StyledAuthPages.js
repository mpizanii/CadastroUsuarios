import styled from "styled-components";
import { Container } from "react-bootstrap";

export const CustomContainer = styled(Container)`
  width: 100vw;
  height: 100vh;
  background-color: #e9ecef;
`;

export const LeftSectionLogin = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #000;
`;

export const RightSectionLogin = styled.div`
  background-color: #8B0000;
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;
  text-align: center;
`;

export const Message = styled.div`
  margin-top: 20px;
  color: ${(props) => (props.type === "success" ? "green" : "red")};
`;

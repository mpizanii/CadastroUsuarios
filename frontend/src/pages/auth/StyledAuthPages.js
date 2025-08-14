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
  color: #162521;
`;

export const RightSectionLogin = styled.div`
  background-color: #162521;
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  color: white;
  text-align: center;
`;

export const LeftSectionRegister = styled.div`
  background-color: #162521;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
`;

export const RightSectionRegister = styled.div`
  background-color: white;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #162521;
  text-align: center;
  padding: 2rem;
`;

export const Message = styled.div`
  margin-top: 20px;
  color: ${(props) => (props.type === "success" ? "green" : "red")};
`;

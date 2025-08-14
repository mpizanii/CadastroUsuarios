import styled from "styled-components";
import { Container } from "react-bootstrap";

export const CustomContainer = styled(Container)`
  width: 100vw;
  height: 100vh;
  background-color: #e9ecef;
`;

export const LeftSection = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #162521;
`;

export const RightSection = styled.div`
  background-color: #162521;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: white;
  text-align: center;
`;

export const LeftSectionDark = styled.div`
  background-color: #162521;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
`;

export const RightSectionLight = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #162521;
  text-align: center;
  padding: 2rem;
`;

export const LeftSectionLight = styled.div`
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #162521;
  text-align: center;
  padding: 2rem;
`;

export const RightSectionDark = styled.div`
  background-color: #162521;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
`;


export const IconWrapper = styled.i`
  position: absolute;
  left: 20px;
  top: 35%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 18px;
`;

export const Message = styled.div`
  margin-top: 20px;
  color: ${(props) => (props.type === "success" ? "green" : "red")};
`;

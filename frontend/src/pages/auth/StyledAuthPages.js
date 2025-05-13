import styled from "styled-components";

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #e9ecef;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-family: Roboto, sans-serif;
`;

export const Card = styled.div`
    width: 70%;
    height: 70%;
    background-color: #fff;
    display: flex;
    border-radius: 10px;
`;

export const LoginLeftCard = styled.div`
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #162521;
`;

export const LoginRightCard = styled.div`
    background-color: #162521;
    width: 40%;
    height: 100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 8px;
    text-align: center; 
`;

export const RegisterLeftCard = styled.div`
    background-color: #162521;
    width: 40%;
    height: 100%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 8px;
    text-align: center; 
`;

export const RegisterRightCard = styled.div`
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #162521;
`;

export const InputDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 70%;
    position: relative;
    height: 30px;
    background: transparent;
    padding: 10px;
`;

export const Icon = styled.i`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 20px;
`;

export const RightCardInput = styled.input`
    background-color: #e9ecef;
    width: 100%;
    padding: 10px 10px 10px 36px;
    height: 100%;
    border: none;
    border-radius: 10px;
`;

export const Button = styled.button`
    width: 40%;
    height: 35px;
    background-color: #355352;
    margin-top: 10px;
    border: none;
    border-radius: 20px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
`;

export const Message = styled.div`
  margin-top: 20px;
  color: ${(props) => (props.type === "success" ? "green" : "red")};
`;
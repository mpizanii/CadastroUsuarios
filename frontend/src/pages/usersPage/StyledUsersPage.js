import styled from "styled-components";

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: Roboto, sans-serif;

    &.blur{
        filter: blur(2px);
        transition: filter 0.5s ease;
    }
`;

export const Card = styled.div`
    width: calc(100% - 372px);
    height: 85%;
    padding: 32px;
    margin: 32px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #162521;
    `;
    
export const CardButtons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    marginBottom: 10px
`;

export const SearchWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const SearchInput = styled.input`
    border: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    outline: none;
`;

export const SearchButton = styled.button`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #355352;
    color: white;
    padding: 10px;
    border: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
`;

export const AddUserButton = styled.button`
    background-color: #355352; 
    color: white; 
    border: none; 
    border-radius: 5px; 
    height: 35px; 
    cursor: pointer; 
    width: 120px  
`;

export const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: #a9a6a6;
    padding: 0px 5px;
    color: white
`;

export const DivFormAddUser = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    font-family: Roboto, sans-serif;
    align-items: center;
    height: 100vh;
    width: 100vw;
    opacity: ${prop => prop.$visible ? 1 : 0};
    pointer-events: ${prop => prop.$visible ? 'auto' : 'none'};
    transition: all 0.5 ease;
`;

export const FormAddUser = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #162521;
    color: white;
    border-radius: 10px;
    width: 30%;
    height: 60%;
    padding: 10px;
    gap: 10px;
    opacity: ${prop => prop.$visible ? 1 : 0};
    pointer-events: ${prop => prop.$visible ? 'auto' : 'none'};
    transition: all 0.5s ease;
    box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
`;

export const FormAddUserInput = styled.input`
    display: flex;
    width: 100%;
    height: 20px;
    border-radius: 10px;
    border: none;
    padding: 5px;
    outline: none;
`;

export const FormAddUserCancelButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    width: 40%;
    height: 20px;
    background-color: red;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

export const FormAddUserSubmitButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    width: 40%;
    height: 20px;
    background-color: green;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

export const Message = styled.div`
  margin-top: 20px;
  color: ${(props) => (props.type === "success" ? "green" : "red")};
`;
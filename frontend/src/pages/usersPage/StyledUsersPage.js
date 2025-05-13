import styled from "styled-components";

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: Roboto, sans-serif;
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
import styled from "styled-components";

export const Container = styled.div`
    width: 100vw;
    min-height: 100vh;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: Roboto, sans-serif;
    overflow-y: auto;
`;

export const Card = styled.div`
    width: calc(100% - 372px);
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
    margin-bottom: 10px;
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
    background-color: #a9a6a6;
    color: white;
    width: 100%;
    display: grid;
    grid-template-columns: 80px 250px 300px 200px 250px 80px;
    height: 40px;
    align-items: center;
    text-align: center;
`;

export const TableBody = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 80px 250px 300px 200px 250px 80px;
    min-height: 50px;
    overflow-y: auto;
    align-items: center;
    border-bottom: 1px solid #162521;
    text-align: center;
`;

export const TableEditUserButton = styled.button`
    width: 30%;
    height: 25px;
    background-color: #355352;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    color: white;   
`;

export const TableDeleteUserButton = styled.button`
    width: 30%;
    height: 25px;
    background-color:rgb(92, 4, 4);
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    color: white;
`;
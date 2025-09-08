import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: auto;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Roboto, sans-serif;
    flex-direction: column;
`;

export const CardTable = styled.div`
    width: 85%;
    padding: 25px;
    display: flex;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    color: #212121;
    box-shadow: 0 8px 10px rgba(0, 0, 0, 0.1);
    flex-direction: column;
    text-align: start;
`;

export const CardTableHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
`;

export const SearchInput = styled.input`
    width: 85%;
    padding: 5px 10px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border: 1px solid #ccc;
    outline: none;
`;

export const SearchButton = styled.button`
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #8B0000;
    color: white;
    padding: 5px 10px;
    border: 1px solid #8B0000;
    cursor: default;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
`;

export const DivActionsButtons = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    height: 100%;
    align-items: center;
`;

export const TableActionButton = styled.button`
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: #212121;   
`;
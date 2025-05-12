import styled from "styled-components";

const MenuLateralContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    background-color: #162521;
    color: white;
    -webkit-box-shadow: 1px 0px 8px 0px rgba(0, 0, 0, 0.71);
    -moz-box-shadow: 1px 0px 8px 0px rgba(0, 0, 0, 0.71);
    box-shadow: 1px 0px 8px 0px rgba(0, 0, 0, 0.71);
`;

const Titulo = styled.div`
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
    -moz-box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
    box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
`;

export default function MenuLateral() {
    return(
        <MenuLateralContainer>
            <Titulo><h2>Cadastro de Clientes</h2></Titulo>
        </MenuLateralContainer>
    )
}
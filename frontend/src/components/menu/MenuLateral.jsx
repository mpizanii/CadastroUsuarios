import styled from "styled-components";
import { supabase } from "../../services/supabase";

const MenuLateralContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 240px;
    background-color: #162521;
    color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 30px;
    align-items: center;
    -webkit-box-shadow: 1px 0px 8px 0px rgba(0, 0, 0, 0.71);
    -moz-box-shadow: 1px 0px 8px 0px rgba(0, 0, 0, 0.71);
    box-shadow: 1px 0px 8px 0px rgba(0, 0, 0, 0.71);
`;

const Titulo = styled.div`
    width: 240px;
    height: 10%;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
    -moz-box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
    box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
`;

const Button = styled.button`
    display: flex;
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: white;
`;

export default function MenuLateral() {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Erro ao deslogar:", error.message);
        } else {
            alert("Logout realizado com sucesso!");
            window.location.href = "/";
        }
    };

    return (
        <MenuLateralContainer>
            <Titulo><h2>Cadastro de Clientes</h2></Titulo>
            <Button style={{ color: "green" }}><h2>Clientes</h2></Button>
            <Button style={{ color: "white" }}><h2>Produtos</h2></Button>
            <Button onClick={handleLogout} 
            style={{ 
                color: "red", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                gap: "5px",
                position: "fixed",
                bottom: 30
            }}>
                <i className="bi bi-box-arrow-left"></i>
                <h2>Logout</h2>
            </Button>
        </MenuLateralContainer>
    );
}

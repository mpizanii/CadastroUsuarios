import styled from "styled-components";
import { useState } from "react";
import { supabase } from "../../services/supabase";
import axios from "axios";

const StyledDivFormDeleteUser = styled.div`
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
    transition: all 0.5s ease;
`;

const StyledFormDeleteUser = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #162521;
    color: white;
    border-radius: 10px;
    width: 30%;
    height: 30%;
    padding: 10px;
    gap: 10px;
    opacity: ${prop => prop.$visible ? 1 : 0};
    pointer-events: ${prop => prop.$visible ? 'auto' : 'none'};
    transition: all 0.5s ease;
    box-shadow: -2px 6px 4px 0px rgba(0, 0, 0, 0.47);
    text-align: center;   
`;

const StyledFormDeleteUserCancelButton = styled.button`
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

const StyledFormDeleteUserSubmitButton = styled.button`
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

const Message = styled.div`
  margin-top: 20px;
  color: ${(props) => (props.type === "success" ? "green" : "red")};
`;

export default function FormDeleteUser( { visible, setVisible, getUsersFunction, userID } ){
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const api_url = import.meta.env.VITE_API_URL;

    async function deleteUsers(e) {
        e.preventDefault();

        try {
            const response = await axios.delete(`${api_url}/Clientes/${userID}`);

            if (response.status === 200 || response.status === 201) {
                setMessageType("success");
                setMessage("Cliente deletado com sucesso.");

                await getUsersFunction();
                setVisible(false);
                setMessage("");
            }
        } catch (error) {
            setMessageType("error");
            setMessage("Erro: " + (error.response?.data?.message || error.message));
        }
    }

    return(
        <StyledDivFormDeleteUser $visible={visible}>
            <StyledFormDeleteUser $visible={visible} onSubmit={deleteUsers}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: "80%",
                    gap: "5px"
                }}>

                <h2>Tem certeza que deseja deletar o cliente? <br />Essa ação não pode ser desfeita</h2>
                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px" }}>
                    <StyledFormDeleteUserSubmitButton type="submit">Confirmar</StyledFormDeleteUserSubmitButton>
                    <StyledFormDeleteUserCancelButton type="button" onClick={() => { setVisible(false) }}>
                    Cancelar
                    </StyledFormDeleteUserCancelButton>
                </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                    {message && <Message type={messageType}>{message}</Message>}
                </div>
            </StyledFormDeleteUser>
        </StyledDivFormDeleteUser>
    )
}
import styled from "styled-components";
import { useState } from "react";
import { supabase } from "../../services/supabase";
import axios from "axios";

const StyledDivFormEditUser = styled.div`
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

const StyledFormEditUser = styled.form`
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

const StyledFormEditUserInput = styled.input`
    display: flex;
    width: 100%;
    height: 20px;
    border-radius: 10px;
    border: none;
    padding: 5px;
    outline: none;
`;

const StyledFormEditUserCancelButton = styled.button`
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

const StyledFormEditUserSubmitButton = styled.button`
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

export default function FormEditUser( { visible, setVisible, userID, userName, userEmail, userPhone, userAddress, getUsersFunction } ){
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newAddress, setNewAddress] = useState("");

    const api_url = import.meta.env.VITE_API_URL;

    async function EditUser(e) {
        e.preventDefault()
        
        try {
            const response = await axios.patch(`${api_url}/Clientes/${userID}`, {
                nome: newName || userName,
                email: newEmail || userEmail,
                telefone: newPhone || userPhone,
                endereco: newAddress || userAddress
            });

            if (response.status === 200 || response.status === 201) {
                setMessageType("success");
                setMessage("Informações atualizadas com sucesso!");
                setNewName("");
                setNewEmail("");
                setNewPhone("");
                setNewAddress("");

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
        <StyledDivFormEditUser $visible={visible}>
            <StyledFormEditUser $visible={visible} onSubmit={EditUser}>
                <h1>Editar Cliente</h1>
                <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "60%",
                gap: "5px"
                }}>
                <label htmlFor="name" style={{ marginLeft: "5px" }}>Nome</label>
                <StyledFormEditUserInput
                    id="name"
                    type="text"
                    placeholder={userName}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />

                <label htmlFor="email" style={{ marginLeft: "5px" }}>E-mail</label>
                <StyledFormEditUserInput
                    id="email"
                    type="email"
                    placeholder={userEmail}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />

                <label htmlFor="phone" style={{ marginLeft: "5px" }}>Telefone</label>
                <StyledFormEditUserInput
                    id="phone"
                    type="text"
                    placeholder={userPhone}
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                />

                <label htmlFor="address" style={{ marginLeft: "5px" }}>Endereço</label>
                <StyledFormEditUserInput
                    id="address"
                    type="text"
                    placeholder={userAddress}
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                />

                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px" }}>
                    <StyledFormEditUserSubmitButton type="submit">Confirmar</StyledFormEditUserSubmitButton>
                    <StyledFormEditUserCancelButton type="button" onClick={() => { setVisible(false) }}>
                    Cancelar
                    </StyledFormEditUserCancelButton>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                    {message && <Message type={messageType}>{message}</Message>}
                </div>
                </div>
            </StyledFormEditUser>
        </StyledDivFormEditUser>
    )
}
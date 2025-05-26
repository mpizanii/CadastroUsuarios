import styled from "styled-components";
import { useState } from "react";
import { supabase } from "../../services/supabase";

const StyledDivFormAddUser = styled.div`
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

const StyledFormAddUser = styled.form`
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

const StyledFormAddUserInput = styled.input`
    display: flex;
    width: 100%;
    height: 20px;
    border-radius: 10px;
    border: none;
    padding: 5px;
    outline: none;
`;

const StyledFormAddUserCancelButton = styled.button`
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

const StyledFormAddUserSubmitButton = styled.button`
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

export default function FormAddUser( { visible, setVisible, getUsersFunction } ){
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    async function AddUser(e) {
        e.preventDefault();

        const { error } = await supabase
            .from('users')
            .insert([
            {
                nome: name,
                email: email,
                telefone: phone,
                endereco: address
            }
            ]);

        if (error) {
            setMessageType("error");
            setMessage("Erro: " + error.message);
        } else {
            setMessageType("success");
            setMessage("Cliente adicionado com sucesso.");
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            
            await getUsersFunction()
            setVisible(false);
            setMessage("")
        }
    }

    return(
        <StyledDivFormAddUser $visible={visible}>
            <StyledFormAddUser $visible={visible} onSubmit={AddUser}>
                <h1>Cadastrar Cliente</h1>
                <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                width: "60%",
                gap: "5px"
                }}>
                <label htmlFor="name" style={{ marginLeft: "5px" }}>Nome</label>
                <StyledFormAddUserInput
                    id="name"
                    type="text"
                    placeholder="Obrigatório"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="email" style={{ marginLeft: "5px" }}>E-mail</label>
                <StyledFormAddUserInput
                    id="email"
                    type="email"
                    placeholder="Opcional"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="phone" style={{ marginLeft: "5px" }}>Telefone</label>
                <StyledFormAddUserInput
                    id="phone"
                    type="text"
                    placeholder="Opcional"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <label htmlFor="address" style={{ marginLeft: "5px" }}>Endereço</label>
                <StyledFormAddUserInput
                    id="address"
                    type="text"
                    placeholder="Opcional"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px" }}>
                    <StyledFormAddUserSubmitButton type="submit">Confirmar</StyledFormAddUserSubmitButton>
                    <StyledFormAddUserCancelButton type="button" onClick={() => { setVisible(false) }}>
                    Cancelar
                    </StyledFormAddUserCancelButton>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                    {message && <Message type={messageType}>{message}</Message>}
                </div>
                </div>
            </StyledFormAddUser>
        </StyledDivFormAddUser>
    )
}
import styled from "styled-components";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const StyledFormEditUserInput = styled.input`
    width: 80%;
    height: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
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
        <Modal
            show={visible}
            onHide={() => setVisible(false)}
            keyboard={false}
            centered
        >   
            <Modal.Header closeButton>
                <Modal.Title>Editar Cliente</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form $visible={visible} onSubmit={EditUser} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="name">Nome</label>
                        <StyledFormEditUserInput
                            id="name"
                            type="text"
                            placeholder={userName}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="email">E-mail</label>
                        <StyledFormEditUserInput
                            id="email"
                            type="email"
                            placeholder={userEmail}
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="phone">Telefone</label>
                        <StyledFormEditUserInput
                            id="phone"
                            type="text"
                            placeholder={userPhone}
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                        />
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="address">Endereço</label>
                        <StyledFormEditUserInput
                            id="address"
                            type="text"
                            placeholder={userAddress}
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                    </div>

                        <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px", width: "100%" }}>
                            <Button variant="success" type="submit">Confirmar</Button>
                            <Button variant="danger" type="button" onClick={() => { setVisible(false) }}>Cancelar</Button>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                            {message && <Message type={messageType}>{message}</Message>}
                        </div>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
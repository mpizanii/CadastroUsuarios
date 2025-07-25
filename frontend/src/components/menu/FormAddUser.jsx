import styled from "styled-components";
import { useState } from "react";
import { supabase } from "../../services/supabase";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const StyledFormAddUserInput = styled.input`
    width: 90%;
    height: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
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

    const api_url = import.meta.env.VITE_API_URL;

    async function AddUser(e) {
        e.preventDefault();

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const novoCliente = {
            nome: name,
            email: email,
            telefone: phone,
            endereco: address,
            user_id: user.id
            };

            const response = await axios.post(`${api_url}/Clientes`, novoCliente);

            if (response.status === 200 || response.status === 201) {
                setMessageType("success");
                setMessage("Cliente adicionado com sucesso.");
                setName("");
                setEmail("");
                setPhone("");
                setAddress("");

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
                <Modal.Title>Cadastrar Cliente</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form $visible={visible} onSubmit={AddUser} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="name">Nome</label>
                        <StyledFormAddUserInput
                            id="name"
                            type="text"
                            placeholder="Obrigatório"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="email">E-mail</label>
                        <StyledFormAddUserInput
                            id="email"
                            type="email"
                            placeholder="Opcional"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="phone">Telefone</label>
                        <StyledFormAddUserInput
                            id="phone"
                            type="text"
                            placeholder="Opcional"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <label htmlFor="address">Endereço</label>
                        <StyledFormAddUserInput
                            id="address"
                            type="text"
                            placeholder="Opcional"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                        <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px", whidth: "100%" }}>
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
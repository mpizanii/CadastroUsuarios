import styled from "styled-components";
import { useState } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import axios from "axios";

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
        <Modal
            show={visible}
            onHide={() => setVisible(false)}
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Deletar Cliente</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form $visible={visible} onSubmit={deleteUsers} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                    <h6>Tem certeza que deseja deletar o cliente? <br />Essa ação não pode ser desfeita</h6>
                </Form> 
            </Modal.Body>

            <Modal.Footer>
                <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px", width: "100%" }}>
                        <Button variant="success" type="submit">Confirmar</Button>
                        <Button variant="danger" type="button" onClick={() => { setVisible(false) }}>Cancelar</Button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                        {message && <Message type={messageType}>{message}</Message>}
                    </div>
            </Modal.Footer>
        </Modal>
    )
}
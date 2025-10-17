import styled from "styled-components";
import { Modal, Button, Form } from "react-bootstrap";

const StyledFormInput = styled.input`
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

export default function ModalForm( { title, visible, setVisible, fields, onSubmit, message, messageType = "success", action } ){
    return(
        <Modal
            show={visible}
            onHide={() => setVisible(false)}
            centered
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            {action == "delete" ? (
                <>
                    <Modal.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h6>Tem certeza que deseja deletar? <br />Essa ação não pode ser desfeita</h6>
                    </Modal.Body>

                    <Modal.Footer>
                        <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px", width: "100%" }}>
                                <Button variant="success" type="button" onClick={onSubmit}>Confirmar</Button>
                                <Button variant="danger" type="button" onClick={() => { setVisible(false) }}>Cancelar</Button>
                            </div>
        
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                                {message && <Message type={messageType}>{message}</Message>}
                            </div>
                    </Modal.Footer>
                </>
            ) : (
                <Modal.Body>
                    <Form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {fields.map((field, index) => (
                            <div key={index} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <label htmlFor="name">{field.label}</label>
                                <StyledFormInput
                                    id={field.id}
                                    type={field.type || "text"} 
                                    placeholder={field.placeholder || ""}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    required={field.required || false}
                                />
                            </div>
                        ))}

                        <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px", width: "100%" }}>
                            <Button variant="success" type="submit">Confirmar</Button>
                            <Button variant="danger" type="button" onClick={() => { setVisible(false) }}>Cancelar</Button>
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
                            {message && <Message type={messageType}>{message}</Message>}
                        </div>
                    </Form>
                </Modal.Body>
            )}
        </Modal>
    )
}
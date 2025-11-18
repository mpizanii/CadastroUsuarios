import styled from "styled-components";
import { Modal, Button, Form } from "react-bootstrap";

const StyledFormInput = styled.input`
    width: 80%;
    height: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
`;

const StyledFormSelect = styled.select`
    width: 80%;
    height: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
`;

const StyledFormTextarea = styled.textarea`
    width: 80%;
    min-height: 80px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
    resize: vertical;
    font-family: inherit;
`;

const IngredientRow = styled.div`
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
`;

const SmallInput = styled.input`
    flex: 2;
    height: 30px;
    width: 100%;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
`;

const AddButton = styled(Button)`
    border: none;
    background: none;
    color: green;
    width: 30px;    
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const RemoveButton = styled(Button)`
    border: none;
    width: 30px;    
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
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
                                {field.type === "select" ? (
                                    <>
                                        <label htmlFor={field.id}>{field.label}</label>
                                        <StyledFormSelect
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                        >
                                            <option value="">{field.placeholder || "Selecione..."}</option>
                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </StyledFormSelect>
                                    </>
                                ) : field.type === "textarea" ? (
                                    <>
                                        <label htmlFor={field.id}>{field.label}</label>
                                        <StyledFormTextarea
                                            id={field.id}
                                            placeholder={field.placeholder || ""}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                            rows={field.rows || 3}
                                        />
                                    </>
                                ) : field.type === "ingredients-list" ? (
                                    <>
                                        <div style={{ width: "80%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                                            <div></div>
                                            <label htmlFor={field.id}>{field.label}</label>
                                            <AddButton 
                                                variant="outline-success" 
                                                type="button"
                                                onClick={field.onAdd}
                                            >
                                                <i className="bi bi-plus-circle" />
                                            </AddButton>
                                        </div>
                                        <div style={{ width: "80%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            {field.value.map((ingredient, idx) => (
                                                <IngredientRow key={idx}>
                                                    <SmallInput
                                                        placeholder="Nome"
                                                        value={ingredient.nome || ""}
                                                        onChange={(e) => field.onUpdate(idx, 'nome', e.target.value)}
                                                        required
                                                    />
                                                    <SmallInput
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Qtd"
                                                        value={ingredient.quantidade || ""}
                                                        onChange={(e) => field.onUpdate(idx, 'quantidade', e.target.value)}
                                                        required
                                                    />
                                                    <SmallInput
                                                        placeholder="Un"
                                                        value={ingredient.unidade || ""}
                                                        onChange={(e) => field.onUpdate(idx, 'unidade', e.target.value)}
                                                    />
                                                    {field.value.length > 1 && (
                                                        <RemoveButton 
                                                            variant="danger" 
                                                            type="button"
                                                            onClick={() => field.onRemove(idx)}
                                                        >
                                                            <i class="bi bi-x-lg"></i>
                                                        </RemoveButton>
                                                    )}
                                                </IngredientRow>
                                            ))}
                                            
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor={field.id}>{field.label}</label>
                                        <StyledFormInput
                                            id={field.id}
                                            type={field.type || "text"} 
                                            placeholder={field.placeholder || ""}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                        />
                                    </>
                                )}
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
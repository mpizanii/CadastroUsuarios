import styled from "styled-components";
import { Modal, Button, Form } from "react-bootstrap";

const StyledFormInput = styled.input`
    width: 100%;
    height: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
`;

const StyledFormSelect = styled.select`
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 0 10px;
    box-sizing: border-box;
    cursor: pointer;
`;

const StyledFormTextarea = styled.textarea`
    width: 100%;
    min-height: 80px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
    resize: vertical;
    font-family: inherit;
`;

const IngredientRow = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    > input, > select {
        box-sizing: border-box;
    }
`;

const SmallInput = styled.input`
    height: 30px;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 5px;
    box-sizing: border-box;
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
                            <div key={index} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                {field.type === "radio" ? (
                                    <>
                                        <label style={{ alignSelf: 'flex-start', fontWeight: "bold"}}>{field.label}</label>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 6 }}>
                                            {field.options?.map((option) => (
                                                <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <input
                                                        type="radio"
                                                        name={field.id}
                                                        value={option.value}
                                                        checked={String(field.value) === String(option.value)}
                                                        onChange={() => field.onChange(option.value)}
                                                    />
                                                    <span>{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </>
                                ) : field.type === "select" ? (
                                    <>
                                        <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                        <StyledFormSelect
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                        >
                                            <option value={0}>{field.placeholder || "Selecione..."}</option>
                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </StyledFormSelect>
                                    </>
                                ) : field.type === "textarea" ? (
                                    <>
                                        <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                        <StyledFormTextarea
                                            id={field.id}
                                            placeholder={field.placeholder || ""}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                            rows={field.rows || 3}
                                        />
                                    </>
                                ) : field.type === "checkbox" ? (
                                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                        <label style={{ margin: 0, fontWeight: "bold" }}>{field.label}</label>
                                        <Form.Check 
                                            type="switch"
                                            id={field.id}
                                            checked={Boolean(field.value)}
                                            onChange={(e) => field.onChange(e.target.checked)}
                                        />
                                    </div>
                                ) : field.type === "ingredients-list" ? (
                                    <>
                                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                                            <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                            <AddButton 
                                                variant="outline-success" 
                                                type="button"
                                                onClick={field.onAdd}
                                            >
                                                <i className="bi bi-plus-circle" />
                                            </AddButton>
                                        </div>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            {field.value.map((ingredient, idx) => (
                                                <IngredientRow key={idx}>
                                                    <SmallInput
                                                        placeholder="Nome do ingrediente"
                                                        value={ingredient.nome || ""}
                                                        onChange={(e) => field.onUpdate(idx, 'nome', e.target.value)}
                                                        style={{ width:"70%" }}
                                                        required
                                                    />
                                                    <SmallInput
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Qtd"
                                                        value={ingredient.quantidade || ""}
                                                        onChange={(e) => field.onUpdate(idx, 'quantidade', e.target.value)}
                                                        style={{ width:"15%" }}
                                                        required
                                                    />
                                                    <StyledFormSelect
                                                        value={ingredient.unidade || "g"}
                                                        onChange={(e) => field.onUpdate(idx, 'unidade', e.target.value)}
                                                        style={{ width:"15%" }}
                                                    >
                                                        {field.unitOptions.map((u) => (
                                                            <option key={u} value={u}>{u}</option>
                                                        ))}
                                                    </ StyledFormSelect>
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
                                ) : field.type === "produtos-list" ? (
                                    <>
                                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                                            <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                            <AddButton 
                                                variant="outline-success" 
                                                type="button"
                                                onClick={field.onAddProduto}
                                            >
                                                <i className="bi bi-plus-circle" />
                                            </AddButton>
                                        </div>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                            {field.value.map((produto, idx) => (
                                                <div key={idx} style={{ display: "flex", gap: "8px", width: "100%", alignItems: "center" }}>
                                                    <StyledFormSelect
                                                        value={produto.produtoId || ""}
                                                        onChange={(e) => field.onProdutoChange(idx, 'produtoId', e.target.value)}
                                                        style={{ flex: 2 }}
                                                        required
                                                    >
                                                        <option value="">Selecione um produto...</option>
                                                        {field.produtosDisponiveis.map((p) => (
                                                            <option key={p.id} value={p.id}>{p.nome}</option>
                                                        ))}
                                                    </StyledFormSelect>
                                                    <SmallInput
                                                        type="number"
                                                        min="1"
                                                        placeholder="Qtd"
                                                        value={produto.quantidade || ""}
                                                        onChange={(e) => field.onProdutoChange(idx, 'quantidade', e.target.value)}
                                                        style={{ width: "80px" }}
                                                        required
                                                    />
                                                    <SmallInput
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Preço"
                                                        value={produto.precoUnitario || ""}
                                                        onChange={(e) => field.onProdutoChange(idx, 'precoUnitario', e.target.value)}
                                                        style={{ width: "100px" }}
                                                        required
                                                    />
                                                    {field.value.length > 1 && (
                                                        <RemoveButton 
                                                            variant="danger" 
                                                            type="button"
                                                            onClick={() => field.onRemoveProduto(idx)}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </RemoveButton>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : field.disabled ? (
                                    <>
                                        <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                        <StyledFormInput
                                            id={field.id}
                                            type={field.type || "text"} 
                                            value={field.value}
                                            disabled
                                            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                        <StyledFormInput
                                            id={field.id}
                                            type={field.type || "text"} 
                                            placeholder={field.placeholder || ""}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                            step={field.step}
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
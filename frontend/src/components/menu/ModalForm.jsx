import { Modal, Button, Form } from "react-bootstrap";

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
                                {message && <div style={{ marginTop: "20px", color: messageType === "success" ? "green" : "red" }}>{message}</div>}
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
                                        <Form.Select
                                            id={field.id}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                            style={{ height: "30px", lineHeight: "30px", fontSize: "14px", borderRadius: "10px", padding: "0 10px" }}
                                        >
                                            <option value={0}>{field.placeholder || "Selecione..."}</option>
                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </>
                                ) : field.type === "textarea" ? (
                                    <>
                                        <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                        <Form.Control
                                            as="textarea"
                                            id={field.id}
                                            placeholder={field.placeholder || ""}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                            rows={field.rows || 3}
                                            style={{ minHeight: "80px", borderRadius: "10px", resize: "vertical" }}
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
                                            <Button 
                                                variant="outline-success" 
                                                type="button"
                                                onClick={field.onAdd}
                                                style={{ border: "none", background: "none", color: "green", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            >
                                                <i className="bi bi-plus-circle" />
                                            </Button>
                                        </div>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            {field.value.map((ingredient, idx) => (
                                                <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "10px", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
                                                    <Form.Control
                                                        placeholder="Nome do ingrediente"
                                                        value={ingredient.nome || ""}
                                                        onChange={(e) => field.onUpdate(idx, 'nome', e.target.value)}
                                                        style={{ width:"70%", height: "30px", borderRadius: "10px", padding: "5px" }}
                                                        required
                                                    />
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Qtd"
                                                        value={ingredient.quantidade || ""}
                                                        onChange={(e) => field.onUpdate(idx, 'quantidade', e.target.value)}
                                                        style={{ width:"15%", height: "30px", borderRadius: "10px", padding: "5px" }}
                                                        required
                                                    />
                                                    <Form.Select
                                                        value={ingredient.unidade || "g"}
                                                        onChange={(e) => field.onUpdate(idx, 'unidade', e.target.value)}
                                                        style={{ width:"15%", height: "30px", borderRadius: "10px", padding: "0 10px", fontSize: "14px" }}
                                                    >
                                                        {field.unitOptions.map((u) => (
                                                            <option key={u} value={u}>{u}</option>
                                                        ))}
                                                    </Form.Select>
                                                    {field.value.length > 1 && (
                                                        <Button 
                                                            variant="danger" 
                                                            type="button"
                                                            onClick={() => field.onRemove(idx)}
                                                            style={{ border: "none", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                        >
                                                            <i class="bi bi-x-lg"></i>
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            
                                        </div>
                                    </>
                                ) : field.type === "produtos-list" ? (
                                    <>
                                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                                            <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                            <Button 
                                                variant="outline-success" 
                                                type="button"
                                                onClick={field.onAddProduto}
                                                style={{ border: "none", background: "none", color: "green", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                            >
                                                <i className="bi bi-plus-circle" />
                                            </Button>
                                        </div>
                                        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                            {field.value.map((produto, idx) => (
                                                <div key={idx} style={{ display: "flex", gap: "8px", width: "100%", alignItems: "center" }}>
                                                    <Form.Select
                                                        value={produto.produtoId || ""}
                                                        onChange={(e) => field.onProdutoChange(idx, 'produtoId', e.target.value)}
                                                        style={{ flex: 2, height: "30px", borderRadius: "10px", padding: "0 10px", fontSize: "14px" }}
                                                        required
                                                    >
                                                        <option value="">Selecione um produto...</option>
                                                        {field.produtosDisponiveis.map((p) => (
                                                            <option key={p.id} value={p.id}>{p.nome}</option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Control
                                                        type="number"
                                                        min="1"
                                                        placeholder="Qtd"
                                                        value={produto.quantidade || ""}
                                                        onChange={(e) => field.onProdutoChange(idx, 'quantidade', e.target.value)}
                                                        style={{ width: "80px", height: "30px", borderRadius: "10px", padding: "5px" }}
                                                        required
                                                    />
                                                    <Form.Control
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Preço"
                                                        value={produto.precoUnitario || ""}
                                                        onChange={(e) => field.onProdutoChange(idx, 'precoUnitario', e.target.value)}
                                                        style={{ width: "100px", height: "30px", borderRadius: "10px", padding: "5px" }}
                                                        required
                                                    />
                                                    {field.value.length > 1 && (
                                                        <Button 
                                                            variant="danger" 
                                                            type="button"
                                                            onClick={() => field.onRemoveProduto(idx)}
                                                            style={{ border: "none", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : field.disabled ? (
                                    <>
                                        <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                        <Form.Control
                                            id={field.id}
                                            type={field.type || "text"} 
                                            value={field.value}
                                            disabled
                                            style={{ height: "30px", borderRadius: "10px", backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor={field.id} style={{ fontWeight: "bold" }}>{field.label}</label>
                                        <Form.Control
                                            id={field.id}
                                            type={field.type || "text"} 
                                            placeholder={field.placeholder || ""}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            required={field.required || false}
                                            step={field.step}
                                            style={{ height: "30px", borderRadius: "10px", padding: "5px" }}
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
                            {message && <div style={{ marginTop: "20px", color: messageType === "success" ? "green" : "red" }}>{message}</div>}
                        </div>
                    </Form>
                </Modal.Body>
            )}
        </Modal>
    )
}
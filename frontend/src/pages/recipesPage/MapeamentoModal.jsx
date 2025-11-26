import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styled from "styled-components";

const StyledFormSelect = styled.select`
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #ccc;
    padding: 0 12px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: #0d6efd;
    }
`;

const StyledFormInput = styled.input`
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #ccc;
    padding: 0 12px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: #0d6efd;
    }
`;

export default function MapeamentoModal({ 
    visible, 
    setVisible, 
    ingrediente, 
    insumos, 
    onMapear 
}) {
    const [selectedInsumoId, setSelectedInsumoId] = useState("");
    const [fatorConversao, setFatorConversao] = useState(1.0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    useEffect(() => {
        if (ingrediente && visible) {
            setSelectedInsumoId(ingrediente.insumoId || "");
            setFatorConversao(ingrediente.fatorConversao || 1.0);
            setMessage("");
        }
    }, [ingrediente, visible]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedInsumoId) {
            setMessageType("error");
            setMessage("Selecione um insumo");
            return;
        }

        setLoading(true);
        try {
            await onMapear(ingrediente.id, parseInt(selectedInsumoId), parseFloat(fatorConversao));
            setMessageType("success");
            setMessage("Ingrediente mapeado com sucesso!");
            setTimeout(() => {
                setVisible(false);
                setMessage("");
            }, 1500);
        } catch (error) {
            setMessageType("error");
            setMessage("Erro ao mapear ingrediente: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={visible}
            onHide={() => setVisible(false)}
            centered
            size="md"
        >
            <Modal.Header closeButton>
                <Modal.Title>Mapear Ingrediente</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "#6c757d", marginBottom: "4px" }}>Ingrediente</div>
                    <div style={{ fontSize: "16px", fontWeight: "600" }}>{ingrediente?.nome}</div>
                    <div style={{ fontSize: "14px", color: "#6c757d", marginTop: "4px" }}>
                        {ingrediente?.quantidade} {ingrediente?.unidade}
                    </div>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Insumo do Estoque</Form.Label>
                        <StyledFormSelect
                            value={selectedInsumoId}
                            onChange={(e) => setSelectedInsumoId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um insumo...</option>
                            {insumos.map((insumo) => (
                                <option key={insumo.id} value={insumo.id}>
                                    {insumo.nome} ({insumo.quantidade} {insumo.unidade})
                                </option>
                            ))}
                        </StyledFormSelect>
                        <Form.Text className="text-muted">
                            Selecione o insumo do estoque que corresponde a este ingrediente
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fator de Conversão</Form.Label>
                        <StyledFormInput
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={fatorConversao}
                            onChange={(e) => setFatorConversao(e.target.value)}
                            required
                        />
                        <Form.Text className="text-muted">
                            Quantidade do ingrediente que equivale a 1 unidade do insumo (ex: 1.5 significa que 1.5 {ingrediente?.unidade} do ingrediente = 1 {insumos.find(i => i.id === parseInt(selectedInsumoId))?.unidade || 'un'} do insumo)
                        </Form.Text>
                    </Form.Group>

                    {message && (
                        <div 
                            className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'} mb-3`}
                            style={{ padding: "10px", fontSize: "14px" }}
                        >
                            {message}
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                        <Button 
                            variant="outline-secondary" 
                            onClick={() => setVisible(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Mapeando..." : "Mapear"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
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

const WarningBox = styled.div`
    background: #fff3cd;
    border: 1px solid #ffc107;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #856404;
`;

const SuccessBox = styled.div`
    background: #d1e7dd;
    border: 1px solid #28a745;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 14px;
    color: #0f5132;
`;

export default function MapeamentoModal({ 
    visible, 
    setVisible, 
    ingrediente, 
    insumos, 
    onMapear 
}) {
    const [selectedInsumoId, setSelectedInsumoId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [unidadesCompativeis, setUnidadesCompativeis] = useState(true);

    useEffect(() => {
        if (ingrediente && visible) {
            setSelectedInsumoId(ingrediente.insumoId || "");
            setMessage("");
        }
    }, [ingrediente, visible]);

    useEffect(() => {
        if (selectedInsumoId && ingrediente) {
            const insumoSelecionado = insumos.find(i => i.id === parseInt(selectedInsumoId));
            if (insumoSelecionado) {
                // Verifica se as unidades são iguais
                const unidadeIngrediente = ingrediente.unidade?.toLowerCase().trim();
                const unidadeInsumo = insumoSelecionado.unidade?.toLowerCase().trim();
                setUnidadesCompativeis(unidadeIngrediente === unidadeInsumo);
            }
        } else {
            setUnidadesCompativeis(true);
        }
    }, [selectedInsumoId, ingrediente, insumos]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedInsumoId) {
            setMessageType("error");
            setMessage("Selecione um insumo");
            return;
        }

        if (!unidadesCompativeis) {
            setMessageType("error");
            setMessage("As unidades devem ser iguais para mapear");
            return;
        }

        setLoading(true);
        try {
            // Agora sempre passa fator de conversão 1.0 (não é mais usado)
            await onMapear(ingrediente.id, parseInt(selectedInsumoId), 1.0);
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

    const insumoSelecionado = insumos.find(i => i.id === parseInt(selectedInsumoId));

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
                    <div style={{ fontSize: "12px", color: "#6c757d", marginBottom: "4px" }}>Ingrediente da Receita</div>
                    <div style={{ fontSize: "16px", fontWeight: "600" }}>{ingrediente?.nome}</div>
                    <div style={{ fontSize: "14px", color: "#6c757d", marginTop: "4px" }}>
                        Quantidade necessária: {ingrediente?.quantidade} {ingrediente?.unidade}
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
                                    {insumo.nome} ({insumo.quantidade} {insumo.unidade} disponível)
                                </option>
                            ))}
                        </StyledFormSelect>
                    </Form.Group>

                    {insumoSelecionado && (
                        <>
                            {unidadesCompativeis ? (
                                <SuccessBox>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                        <strong>Unidades compatíveis!</strong>
                                    </div>
                                    <div>
                                        Ingrediente: {ingrediente?.quantidade} {ingrediente?.unidade}<br/>
                                        Insumo: {insumoSelecionado.quantidade} {insumoSelecionado.unidade} disponível
                                    </div>
                                    <div style={{ marginTop: "8px", fontSize: "13px", fontStyle: "italic" }}>
                                        Ao criar um pedido, será descontado automaticamente do estoque.
                                    </div>
                                </SuccessBox>
                            ) : (
                                <WarningBox>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                        <span style={{ fontSize: "18px" }}>⚠️</span>
                                        <strong>Unidades incompatíveis!</strong>
                                    </div>
                                    <div>
                                        Ingrediente usa: <strong>{ingrediente?.unidade}</strong><br/>
                                        Insumo usa: <strong>{insumoSelecionado.unidade}</strong>
                                    </div>
                                    <div style={{ marginTop: "8px", fontSize: "13px" }}>
                                        Você precisa ajustar as unidades para serem iguais antes de mapear.
                                    </div>
                                </WarningBox>
                            )}
                        </>
                    )}

                    {message && (
                        <Alert 
                            variant={messageType === 'success' ? 'success' : 'danger'}
                            className="mb-3"
                        >
                            {message}
                        </Alert>
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
                            disabled={loading || !unidadesCompativeis}
                        >
                            {loading ? "Mapeando..." : "Mapear"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
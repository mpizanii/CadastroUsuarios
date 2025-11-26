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

const CalculationBox = styled.div`
    background: #e7f3ff;
    border: 1px solid #b3d9ff;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 16px;
    font-size: 14px;
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
    const [calculoAutomatico, setCalculoAutomatico] = useState(null);

    const converterParaBase = (quantidade, unidade) => {
        const conversoes = {
            'g': 1,
            'kg': 1000,
            'mg': 0.001,
            
            'ml': 1,
            'l': 1000,
            'litro': 1000,
            'litros': 1000,
            
            'un': 1,
            'unidade': 1,
            'unidades': 1,
            'und': 1,
        };

        const unidadeLower = unidade.toLowerCase().trim();
        const fator = conversoes[unidadeLower] || 1;
        return quantidade * fator;
    };

    const getTipoUnidade = (unidade) => {
        const unidadeLower = unidade.toLowerCase().trim();
        if (['g', 'kg', 'mg'].includes(unidadeLower)) return 'massa';
        if (['ml', 'l', 'litro', 'litros'].includes(unidadeLower)) return 'volume';
        if (['un', 'unidade', 'unidades', 'und'].includes(unidadeLower)) return 'unidade';
        return 'outro';
    };

    const calcularFatorConversao = (ingrediente, insumo) => {
        const ingredienteBase = converterParaBase(ingrediente.quantidade, ingrediente.unidade);
        const insumoBase = converterParaBase(1, insumo.unidade);
        
        const tipoIngrediente = getTipoUnidade(ingrediente.unidade);
        const tipoInsumo = getTipoUnidade(insumo.unidade);
        
        if (tipoIngrediente === tipoInsumo) {
            const fator = ingredienteBase / insumoBase;
            return {
                fator: fator,
                automatico: true,
                explicacao: `${ingrediente.quantidade}${ingrediente.unidade} = ${fator.toFixed(4)} ${insumo.unidade}`
            };
        }
        
        return {
            fator: 1.0,
            automatico: false,
            explicacao: "Conversão manual necessária (unidades incompatíveis)"
        };
    };

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
                const calculo = calcularFatorConversao(ingrediente, insumoSelecionado);
                setCalculoAutomatico(calculo);
                setFatorConversao(calculo.fator);
            }
        } else {
            setCalculoAutomatico(null);
            setFatorConversao(1.0);
        }
    }, [selectedInsumoId, ingrediente, insumos]);

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
                                    {insumo.nome} (disponível: {insumo.quantidade} {insumo.unidade})
                                </option>
                            ))}
                        </StyledFormSelect>
                    </Form.Group>

                    {calculoAutomatico && (
                        <CalculationBox>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                <span style={{ fontSize: "18px" }}>
                                    {calculoAutomatico.automatico ? "🎯" : "⚠️"}
                                </span>
                                <strong>
                                    {calculoAutomatico.automatico ? "Cálculo Automático" : "Conversão Manual"}
                                </strong>
                            </div>
                            <div style={{ color: "#0056b3" }}>
                                {calculoAutomatico.explicacao}
                            </div>
                        </CalculationBox>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Fator de Conversão
                            {calculoAutomatico?.automatico && (
                                <span style={{ color: "#28a745", marginLeft: "8px", fontSize: "12px" }}>
                                    ✓ Calculado automaticamente
                                </span>
                            )}
                        </Form.Label>
                        <StyledFormInput
                            type="number"
                            step="0.0001"
                            min="0.0001"
                            value={fatorConversao}
                            onChange={(e) => setFatorConversao(e.target.value)}
                            required
                        />
                        <Form.Text className="text-muted">
                            {calculoAutomatico?.automatico 
                                ? "Valor calculado automaticamente. Você pode ajustar se necessário."
                                : "Informe quanto do ingrediente consome 1 unidade do insumo"
                            }
                        </Form.Text>
                    </Form.Group>

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

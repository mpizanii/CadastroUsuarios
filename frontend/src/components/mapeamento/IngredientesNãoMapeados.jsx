import { FiAlertTriangle } from "react-icons/fi";
import { Modal, Alert, Button } from "react-bootstrap";

export default function IngredientesNaoMapeados({ ingredientesNaoMapeados, showMapeamentoModal, setShowMapeamentoModal, handleIrParaMapeamento, handleConfirmarPedidoSemBaixa }) {
    return (
        <Modal show={showMapeamentoModal} onHide={() => setShowMapeamentoModal(false)} centered size="lg">
            <Modal.Header closeButton>
            <Modal.Title className="fw-bold gap-2 d-flex align-items-center"><FiAlertTriangle /> Ingredientes Não Mapeados</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Alert variant="warning">
                <strong>Atenção!</strong> Alguns ingredientes não estão mapeados com insumos do estoque. 
                Sem o mapeamento, não será possível dar baixa automática no estoque.
            </Alert>

            <div className="mb-3">
                <h6 className="fw-bold mb-3">Ingredientes sem mapeamento:</h6>
                {ingredientesNaoMapeados.map((ing, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-2 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div>
                    <div className="fw-bold">{ing.ingredienteNome}</div>
                    <small className="text-muted">Produto: {ing.produtoNome}</small>
                    </div>
                    <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleIrParaMapeamento(ing)}
                    >
                    Mapear Agora
                    </Button>
                </div>
                ))}
            </div>

            <p className="text-muted mb-0">
                <strong>Opções:</strong>
            </p>
            <ul className="text-muted small">
                <li>Clique em "Mapear Agora" para mapear os ingredientes</li>
                <li>Ou continue sem dar baixa no estoque</li>
            </ul>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMapeamentoModal(false)}>
                Cancelar
            </Button>
            <Button variant="warning" onClick={handleConfirmarPedidoSemBaixa}>
                Continuar Sem Baixa
            </Button>
            </Modal.Footer>
        </Modal>
    )
}
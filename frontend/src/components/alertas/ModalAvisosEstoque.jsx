import { Modal, Button, Alert } from 'react-bootstrap';
import { FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ModalAvisosEstoque = ({ visible, setVisible, avisos, onConfirmar, onCancelar }) => {
    const getIcone = (tipo) => {
        switch (tipo) {
            case 'CRITICO':
                return <FiAlertTriangle size={20} />;
            case 'ALERTA':
                return <FiAlertCircle size={20} />;
            default:
                return <FiInfo size={20} />;
        }
    };

    const getVariant = (tipo) => {
        switch (tipo) {
            case 'CRITICO':
                return 'danger';
            case 'ALERTA':
                return 'warning';
            default:
                return 'info';
        }
    };

    return (
        <Modal show={visible} onHide={() => setVisible(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <FiAlertTriangle className="me-2" />
                    Atenção: Avisos de estoque
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {avisos.map((aviso, idx) => (
                        <Alert 
                            key={idx} 
                            variant={getVariant(aviso.tipo)}
                            className="d-flex align-items-start"
                        >
                            <div className="me-2 mt-1">
                                {getIcone(aviso.tipo)}
                            </div>
                            <div className="flex-grow-1">
                                <strong>{aviso.tipo}:</strong> {aviso.mensagem}
                                <div className="mt-2" style={{ fontSize: '0.9em' }}>
                                    <div><strong>Produto:</strong> {aviso.produtoNome}</div>
                                    <div><strong>Insumo:</strong> {aviso.insumoNome}</div>
                                    <div>
                                        <strong>Quantidade Atual:</strong> {aviso.quantidadeAtual.toFixed(2)} | 
                                        <strong> Necessária:</strong> {aviso.quantidadeNecessaria.toFixed(2)}
                                    </div>
                                    {aviso.quantidadeFaltante > 0 && (
                                        <div className="text-danger">
                                            <strong>Faltando:</strong> {aviso.quantidadeFaltante.toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Alert>
                    ))}
                </div>
                Deseja continuar com a criação do pedido mesmo assim?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onCancelar}>
                    Cancelar Pedido
                </Button>
                <Button variant="success" onClick={onConfirmar}>
                    Continuar Mesmo Assim
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalAvisosEstoque;
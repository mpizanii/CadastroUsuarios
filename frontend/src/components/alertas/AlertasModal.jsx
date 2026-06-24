import { Modal } from "react-bootstrap";
import { FiAlertTriangle } from "react-icons/fi";

export default function AlertasModal({ 
    visible, 
    setVisible, 
    alertas,
    getStatusBadge,
    formatDate
}) {
    return (
        <Modal 
          show={visible} 
          onHide={() => setVisible(false)} 
          centered 
          size="lg"
        >
          <Modal.Header closeButton style={{ borderBottom: '1px solid #f0f0f0', padding: '20px 24px' }}>
            <Modal.Title className="fw-bold d-flex align-items-center gap-2">
              <FiAlertTriangle style={{ color: '#ffc107', verticalAlign: 'middle' }} />
              Alertas de Estoque
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: '24px' }}>
            {alertas.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted mb-0">Nenhum alerta no momento!</p>
                <small className="text-muted">Todos os insumos estão com estoque OK</small>
              </div>
            ) : (
              <>
                <p className="text-muted mb-3">
                  {alertas.length} {alertas.length === 1 ? 'insumo requer' : 'insumos requerem'} atenção
                </p>
                {alertas.map((insumo) => (
                  <div 
                    key={insumo.id}
                    style={{ 
                      padding: '16px', 
                      borderRadius: '8px', 
                      backgroundColor: '#f8f9fa', 
                      marginBottom: '12px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <div>
                      <div className="fw-bold">{insumo.nome}</div>
                      <small className="text-muted">
                        Estoque: {insumo.quantidade} {insumo.unidade} | 
                        Mínimo: {insumo.estoqueMinimo} {insumo.unidade}
                        {insumo.validade && ` | Validade: ${formatDate(insumo.validade)}`}
                      </small>
                    </div>
                    {getStatusBadge(insumo.statusEstoque)}
                  </div>
                ))}
              </>
            )}
          </Modal.Body>
        </Modal>
    );
}
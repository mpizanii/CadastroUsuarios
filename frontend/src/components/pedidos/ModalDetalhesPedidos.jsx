import { Modal, Button, Badge } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';

const ModalDetalhesPedidos = ({ pedido, visible, setVisible }) => {
  if (!pedido) return null;

  const getStatusColor = (status) => {
    const colors = {
      'Pendente': 'secondary',
      'Em Preparo': 'warning',
      'Em Rota de Entrega': 'info',
      'Entregue': 'success'
    };
    return colors[status] || 'secondary';
  };

  const formatCurrency = (value) => {
    try {
      return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch { return value; }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      show={visible} 
      onHide={() => setVisible(false)}
      size="lg"
      centered
    >
      <Modal.Header className="border-0 pb-0">
        <div className="w-100">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h4 className="mb-1">Detalhes do Pedido</h4>
              <p className="text-muted mb-0">#{String(pedido.id).padStart(4, '0')}</p>
            </div>
            <Button
              variant="link"
              onClick={() => setVisible(false)}
              className="text-muted p-0"
              style={{ fontSize: '1.5rem' }}
            >
              <MdClose />
            </Button>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="px-4">
        <div className="mb-4">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="text-muted small mb-1">Cliente</label>
              <p className="fw-semibold mb-0">{pedido.clienteNome}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small mb-1">Status</label>
              <div>
                <Badge 
                  bg={getStatusColor(pedido.status)}
                  style={{ padding: '6px 12px', borderRadius: '6px', fontWeight: '500' }}
                >
                  {pedido.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="text-muted small mb-1">Data do Pedido</label>
              <p className="mb-0">{formatDate(pedido.dataPedido)}</p>
            </div>
            <div className="col-md-6">
              <label className="text-muted small mb-1">Valor Total</label>
              <p className="mb-0 fw-bold" style={{ color: '#2E8B57', fontSize: '1.2rem' }}>
                {formatCurrency(pedido.valorTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-muted small mb-2">Produtos</label>
          <div className="border rounded p-3" style={{ backgroundColor: '#f8f9fa' }}>
            {pedido.produtos && pedido.produtos.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {pedido.produtos.map((produto, index) => (
                  <div 
                    key={index} 
                    className="d-flex justify-content-between align-items-center p-2 bg-white rounded"
                  >
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-semibold">{produto.produtoNome}</p>
                      <p className="mb-0 text-muted small">
                        Quantidade: {produto.quantidade} x {formatCurrency(produto.precoUnitario)}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="mb-0 fw-bold " style={{ color: '#2E8B57' }}>
                        {formatCurrency(produto.quantidade * produto.precoUnitario)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0 text-center">Nenhum produto</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-muted small mb-2">Observações</label>
          <div className="border rounded p-3" style={{ backgroundColor: '#f8f9fa', minHeight: '80px' }}>
            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
              {pedido.observacoes || 'Sem observações'}
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button 
          variant="secondary" 
          onClick={() => setVisible(false)}
          style={{ borderRadius: '8px' }}
        >
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalhesPedidos;

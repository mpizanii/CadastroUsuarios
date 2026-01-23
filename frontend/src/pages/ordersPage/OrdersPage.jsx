import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { SlPencil, SlTrash } from "react-icons/sl";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState, useEffect } from 'react';
import ModalForm from '../../components/menu/ModalForm';
import IngredientesNaoMapeados from '../../components/mapeamento/IngredientesNãoMapeados';
import ModalDetalhesPedidos from '../../components/pedidos/ModalDetalhesPedidos';
import { formAddPedido, formEditOrderStatus, formDeletePedido } from '../../forms/ordersForms';
import { useOrders } from '../../contexts';
import { useOrderActions } from '../../hooks/useOrderActions';

const OrdersPage = () => {
  const { orders, loading, error, fetchOrders, fetchCustomersAndProducts, produtosDisponiveis, clientesDisponiveis } = useOrders();
  const [menuAddPedidoAtivo, setMenuAddPedidoAtivo] = useState(false);
  const [menuOrderDetailsAtivo, setMenuOrderDetailsAtivo] = useState(false);
  const [menuEditStatusAtivo, setMenuEditStatusAtivo] = useState(false);
  const [menuDeletePedidoAtivo, setMenuDeletePedidoAtivo] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const {
    showMapeamentoModal,
    setShowMapeamentoModal,
    ingredientesNaoMapeados,
    handleVerificarMapeamento,
    handleConfirmarPedidoSemBaixa,
    handleIrParaMapeamento,
    resetMapeamentoState
  } = useOrderActions({ fetchOrders });


  const { titleFormAddPedido, fieldsFormAddPedido, handleSubmitFormAddPedido, messageFormAddPedido, messageTypeFormAddPedido } = formAddPedido({
    onSuccess: async () => {
      await fetchOrders();
      setMenuAddPedidoAtivo(false);
      resetMapeamentoState();
    },
    onVerificarMapeamento: handleVerificarMapeamento
  });

  const { titleFormEditStatus, fieldsFormEditStatus, handleSubmitFormEditStatus, messageFormEditStatus, messageTypeFormEditStatus } = formEditOrderStatus({
    onSuccess: async () => {
      await fetchOrders();
      setMenuEditStatusAtivo(false);
      resetMapeamentoState();
    },
    pedido: selectedPedido
  });

  const { titleFormDeletePedido, textFormDeletePedido, handleSubmitFormDeletePedido, messageFormDeletePedido, messageTypeFormDeletePedido } = formDeletePedido({
    onSuccess: async () => {
      await fetchOrders();
      setMenuDeletePedidoAtivo(false);
      resetMapeamentoState();
    },
    pedido: selectedPedido
  });

  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
    }
    if (produtosDisponiveis.length === 0 || clientesDisponiveis.length === 0) {
      fetchCustomersAndProducts();
    }
  }, []);

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
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && orders.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span>Carregando pedidos</span>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "48px", color: "#dc3545" }} />
        <span style={{ color: "#666" }}>{error}</span>
        <Button onClick={fetchOrders} variant="outline-primary">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className={`w-100 min-vh-100 bg-light ${menuAddPedidoAtivo || menuOrderDetailsAtivo || menuEditStatusAtivo || menuDeletePedidoAtivo ? "opacity-50" : ""}`} style={{ fontFamily: "Roboto, sans-serif" }}>
        <div style={{ padding: "35px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <div>
              <h1 style={{ color: "#212121", marginBottom: "5px", fontWeight: "bold" }}>Pedidos</h1>
              <p style={{ color: "#666", margin: 0 }}>Gerencie todos os seus pedidos</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setMenuAddPedidoAtivo(true)}
              className="d-flex align-items-center gap-2"
              style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '500', border: 'none', backgroundColor: '#e76e50' }}
            >
              <FiPlus size={18} />
              Novo Pedido
            </Button>
          </div>

          <Row>
            {orders.map((pedido) => (
              <Col key={pedido.id} xs={12} md={6} lg={4} className="mb-4">
                <Card 
                  style={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                    transition: 'transform 0.2s, box-shadow 0.2s' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="text-muted mb-1">Pedido</h6>
                        <h4 className="fw-bold mb-0">#{String(pedido.id).padStart(4, '0')}</h4>
                      </div>
                      <Badge 
                        bg={getStatusColor(pedido.status)}
                        style={{ padding: '6px 12px', borderRadius: '6px', fontWeight: '500', fontSize: '0.85rem' }}
                      >
                        {pedido.status}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <h5>{pedido.clienteNome}</h5>
                      <p className="text-muted small mb-1">
                        {formatDate(pedido.dataPedido)} • {pedido.produtos?.length || 0} produtos
                      </p>
                    </div>

                    <div className="mb-2 pb-1" style={{ borderBottom: '1px solid #eee' }}>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Valor Total:</span>
                        <span className="fw-bold" style={{ color: '#2E8B57', fontSize: '1.1rem' }}>
                          {formatCurrency(pedido.valorTotal)}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center justify-content-center gap-1 w-50"
                        onClick={() => { setSelectedPedido(pedido); setMenuOrderDetailsAtivo(true); }}
                      >
                        <MdOutlineShoppingCart /> Ver Detalhes
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center justify-content-center gap-1 w-50"
                        title="Editar Status"
                        onClick={() => { setSelectedPedido(pedido); setMenuEditStatusAtivo(true); }}
                      >
                        <SlPencil /> Editar Status
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => { setSelectedPedido(pedido); setMenuDeletePedidoAtivo(true); }}
                      >
                        <SlTrash />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {orders.length === 0 && (
            <Row>
              <Col>
                <Card className="text-center py-5">
                  <Card.Body>
                    <MdOutlineShoppingCart size={64} className="text-muted mb-3" />
                    <h5 className="text-muted">Nenhum pedido encontrado</h5>
                    <p className="text-muted">Cadastre seu primeiro pedido</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>

      {menuAddPedidoAtivo && (
        <ModalForm
          title={titleFormAddPedido}
          visible={menuAddPedidoAtivo}
          setVisible={setMenuAddPedidoAtivo}
          fields={fieldsFormAddPedido}
          onSubmit={handleSubmitFormAddPedido}
          message={messageFormAddPedido}
          messageType={messageTypeFormAddPedido}
          action="add"
        />
      )}

      {selectedPedido && menuOrderDetailsAtivo && (
        <ModalDetalhesPedidos
          pedido={selectedPedido}
          visible={menuOrderDetailsAtivo}
          setVisible={setMenuOrderDetailsAtivo}
        />
      )}

      {selectedPedido && menuEditStatusAtivo && (
        <ModalForm
          title={titleFormEditStatus}
          visible={menuEditStatusAtivo}
          setVisible={setMenuEditStatusAtivo}
          fields={fieldsFormEditStatus}
          onSubmit={handleSubmitFormEditStatus}
          message={messageFormEditStatus}
          messageType={messageTypeFormEditStatus}
          action="edit"
        />
      )}

      {selectedPedido && menuDeletePedidoAtivo && (
        <ModalForm
          title={titleFormDeletePedido}
          visible={menuDeletePedidoAtivo}
          setVisible={setMenuDeletePedidoAtivo}
          text={textFormDeletePedido}
          onSubmit={handleSubmitFormDeletePedido}
          message={messageFormDeletePedido}
          messageType={messageTypeFormDeletePedido}
          action="delete"
        />
      )}

      {ingredientesNaoMapeados.length > 0 && (
        <IngredientesNaoMapeados
          ingredientesNaoMapeados={ingredientesNaoMapeados}
          showMapeamentoModal={showMapeamentoModal}
          setShowMapeamentoModal={setShowMapeamentoModal}
          handleIrParaMapeamento={handleIrParaMapeamento}
          handleConfirmarPedidoSemBaixa={handleConfirmarPedidoSemBaixa}
        />
      )}
    </>
  );
};

export default OrdersPage;
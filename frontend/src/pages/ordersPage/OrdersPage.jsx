import { Container, Row, Col, Card, Badge, Button, Spinner, Modal, Alert } from 'react-bootstrap';
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState, useEffect } from 'react';
import ModalForm from '../../components/menu/ModalForm';
import { addPedido, verificarMapeamentoProdutos } from '../../services/ordersService';
import { formAddPedido, formEditStatus, formDeletePedido } from './Forms';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../contexts';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, loading, error, fetchOrders } = useOrders();
  const [menuAddPedidoAtivo, setMenuAddPedidoAtivo] = useState(false);
  const [menuEditStatusAtivo, setMenuEditStatusAtivo] = useState(false);
  const [menuDeletePedidoAtivo, setMenuDeletePedidoAtivo] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showMapeamentoModal, setShowMapeamentoModal] = useState(false);
  const [ingredientesNaoMapeados, setIngredientesNaoMapeados] = useState([]);
  const [pedidoPendente, setPedidoPendente] = useState(null);

  const handleVerificarMapeamento = async (pedidoData) => {
    try {
      const resultado = await verificarMapeamentoProdutos(pedidoData.produtos);
      
      if (!resultado.todosMapeados && resultado.ingredientesNaoMapeados.length > 0) {
        setIngredientesNaoMapeados(resultado.ingredientesNaoMapeados);
        setPedidoPendente(pedidoData);
        setShowMapeamentoModal(true);
      } else {
        await addPedido(pedidoData);
        setMenuAddPedidoAtivo(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Erro ao verificar mapeamento:', error);
    }
  };

  const handleConfirmarPedidoSemBaixa = async () => {
    try {
      const pedidoSemBaixa = { ...pedidoPendente, darBaixaEstoque: false };
      await addPedido(pedidoSemBaixa);
      setShowMapeamentoModal(false);
      setMenuAddPedidoAtivo(false);
      setPedidoPendente(null);
      setIngredientesNaoMapeados([]);
      fetchOrders();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  const handleIrParaMapeamento = (ingrediente) => {
    setShowMapeamentoModal(false);
    setMenuAddPedidoAtivo(false);
    navigate(`/receitas/${ingrediente.receitaId}`);
  };

  const { titleFormAddPedido, fieldsFormAddPedido, handleSubmitFormAddPedido, messageFormAddPedido, messageTypeFormAddPedido } = formAddPedido({
    onSuccess: fetchOrders,
    onVerificarMapeamento: handleVerificarMapeamento
  });

  const { titleFormEditStatus, fieldsFormEditStatus, handleSubmitFormEditStatus, messageFormEditStatus, messageTypeFormEditStatus } = formEditStatus({
    pedido: selectedPedido,
    onSuccess: () => {
      setMenuEditStatusAtivo(false);
      fetchOrders();
    },
  });

  const { titleFormDeletePedido, textFormDeletePedido, handleSubmitFormDeletePedido, messageFormDeletePedido, messageTypeFormDeletePedido } = formDeletePedido({
    pedido: selectedPedido,
    onSuccess: () => {
      setMenuDeletePedidoAtivo(false);
      fetchOrders();
    },
  });

  useEffect(() => {
    if (orders.length === 0) {
      fetchOrders();
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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '24px' }}>
      <Container fluid className="px-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold mb-1">Pedidos</h1>
            <p className="text-muted mb-0">Gerencie todos os pedidos</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="primary"
              onClick={() => setMenuAddPedidoAtivo(true)}
              className="d-flex align-items-center gap-2"
              style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '500', border: 'none', backgroundColor: '#e76e50' }}
            >
              <FiPlus size={18} />
              Novo Pedido
            </Button>
          </Col>
        </Row>

        {/* Cards Grid */}
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
                    <h5 className="fw-bold mb-2">{pedido.clienteNome}</h5>
                    <p className="text-muted small mb-1">
                      {formatDate(pedido.dataPedido)} • {pedido.produtos?.length || 0} produtos
                    </p>
                  </div>

                  <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #eee' }}>
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
                      className="flex-fill"
                      onClick={() => { setSelectedPedido(pedido); setMenuEditStatusAtivo(true); }}
                    >
                      <FiEdit2 className="me-1" /> Status
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => { setSelectedPedido(pedido); setMenuDeletePedidoAtivo(true); }}
                    >
                      <FiTrash2 />
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
      </Container>

      {/* Modal de Adicionar Pedido */}
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

      {/* Modal de Editar Status */}
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

      {/* Modal de Deletar Pedido */}
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

      {/* Modal de Ingredientes Não Mapeados */}
      <Modal show={showMapeamentoModal} onHide={() => setShowMapeamentoModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">⚠️ Ingredientes Não Mapeados</Modal.Title>
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
    </div>
  );
};

export default OrdersPage;
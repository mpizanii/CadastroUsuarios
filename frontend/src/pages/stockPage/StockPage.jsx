import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FiSearch, FiPackage, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { LuPackagePlus } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import ModalForm from '../../components/menu/ModalForm';
import { getInsumosComAlertas } from '../../services/stockService';
import { formAddInsumo, formEditInsumo, formDeleteInsumo, formAdicionar } from './Forms';
import { useStock } from '../../contexts/StockContext';

const StockPage = () => {
  const { insumos, loading, error, fetchInsumos } = useStock();
  const [filteredInsumos, setFilteredInsumos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAddInsumoAtivo, setMenuAddInsumoAtivo] = useState(false);
  const [menuEditInsumoAtivo, setMenuEditInsumoAtivo] = useState(false);
  const [menuDeleteInsumoAtivo, setMenuDeleteInsumoAtivo] = useState(false);
  const [menuAdicionarAtivo, setMenuAdicionarAtivo] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertas, setAlertas] = useState([]);

  const { titleFormAddInsumo, fieldsFormAddInsumo, handleSubmitFormAddInsumo, messageFormAddInsumo, messageTypeFormAddInsumo } = formAddInsumo({
    onSuccess: () => {
      setMenuAddInsumoAtivo(false);
      fetchInsumos();
    },
  });

  const { titleFormEditInsumo, fieldsFormEditInsumo, handleSubmitFormEditInsumo, messageFormEditInsumo, messageTypeFormEditInsumo } = formEditInsumo({
    insumo: selectedInsumo,
    onSuccess: () => {
      setMenuEditInsumoAtivo(false);
      fetchInsumos();
    },
  });

  const { titleFormDeleteInsumo, textFormDeleteInsumo, handleSubmitFormDeleteInsumo, messageFormDeleteInsumo, messageTypeFormDeleteInsumo } = formDeleteInsumo({
    insumo: selectedInsumo,
    onSuccess: () => {
      setMenuDeleteInsumoAtivo(false);
      fetchInsumos();
    },
  });

  const { titleFormAdicionar, fieldsFormAdicionar, handleSubmitFormAdicionar, messageFormAdicionar, messageTypeFormAdicionar } = formAdicionar({
    insumo: selectedInsumo,
    onSuccess: () => {
      setMenuAdicionarAtivo(false);
      fetchInsumos();
    },
  });

  useEffect(() => {
    if (insumos.length === 0) {
      fetchInsumos();
    }
  }, []);

  useEffect(() => {
    const filtered = insumos.filter(insumo =>
      insumo.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInsumos(filtered);
  }, [searchTerm, insumos]);

  const loadAlertas = async () => {
    try {
      const data = await getInsumosComAlertas();
      setAlertas(data);
      setShowAlertModal(true);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  };

  const getStatusBadge = (statusEstoque) => {
    const statusConfig = {
      'OK': { bg: 'success', text: 'OK' },
      'Baixo': { bg: 'warning', text: 'Baixo' },
      'Crítico': { bg: 'danger', text: 'Crítico' }
    };
    
    const config = statusConfig[statusEstoque] || statusConfig['OK'];
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getProgressColor = (quantidade, estoqueMinimo) => {
    const percentage = (quantidade / (estoqueMinimo * 2)) * 100;
    if (percentage < 50) return '#dc3545';
    if (percentage < 80) return '#ffc107';
    return '#28a745';
  };

  const getNivelEstoque = (quantidade, estoqueMinimo) => {
    const percentage = Math.min((quantidade / (estoqueMinimo * 2)) * 100, 100);
    return Math.round(percentage);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sem validade';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading && insumos.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span>Carregando insumos</span>
      </div>
    )
  }

  if (error && insumos.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "48px", color: "#dc3545" }} />
        <span style={{ color: "#666" }}>{error}</span>
        <Button onClick={fetchInsumos} variant="outline-primary">
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
            <h1 className="fw-bold mb-1">Insumos</h1>
            <p className="text-muted mb-0">Controle seu estoque de insumos</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="primary"
              onClick={() => setMenuAddInsumoAtivo(true)}
              className="d-flex align-items-center gap-2"
              style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '500', border: 'none', backgroundColor: '#e76e50' }}
            >
              <FiPlus size={18} />
              Novo Insumo
            </Button>
          </Col>
        </Row>

        {/* Search and Filter */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRight: 'none' }}>
                <FiSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar insumos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderLeft: 'none', borderRadius: '8px', border: '1px solid #e0e0e0', padding: '10px 16px' }}
              />
            </InputGroup>
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <Button 
              onClick={loadAlertas}
              style={{ 
                borderRadius: '8px', 
                padding: '10px 20px', 
                fontWeight: '500', 
                border: '1px solid #e0e0e0', 
                backgroundColor: 'white', 
                color: '#333', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#e76e50';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Alertas
            </Button>
          </Col>
        </Row>

        {/* Cards Grid */}
        <Row>
          {filteredInsumos.map((insumo) => {
            const nivelEstoque = getNivelEstoque(insumo.quantidade, insumo.estoqueMinimo);
            const progressColor = getProgressColor(insumo.quantidade, insumo.estoqueMinimo);

            return (
              <Col key={insumo.id} xs={12} sm={6} lg={4} xl={3} className="mb-4">
                <Card
                  style={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                    transition: 'transform 0.2s, box-shadow 0.2s' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div 
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          borderRadius: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          backgroundColor: '#fff8e6' 
                        }}
                      >
                        <FiPackage size={24} color="#f59e0b" />
                      </div>
                      {getStatusBadge(insumo.statusEstoque)}
                    </div>

                    <h5 className="fw-bold mb-2">{insumo.nome}</h5>
                    <p className="text-muted small mb-2">
                      Validade: {formatDate(insumo.validade)}
                    </p>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small text-muted">Estoque Atual:</span>
                        <span className="small fw-bold">
                          {insumo.quantidade} {insumo.unidade}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small text-muted">Estoque Mínimo:</span>
                        <span className="small">
                          {insumo.estoqueMinimo} {insumo.unidade}
                        </span>
                      </div>
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '6px', 
                          backgroundColor: '#f0f0f0', 
                          borderRadius: '3px', 
                          overflow: 'hidden', 
                          marginTop: '8px' 
                        }}
                      >
                        <div 
                          className="progress-fill" 
                          style={{ 
                            height: '100%', 
                            backgroundColor: progressColor, 
                            transition: 'width 0.3s ease', 
                            width: `${nivelEstoque}%` 
                          }} 
                        />
                      </div>
                      <div className="text-end mt-1">
                        <span className="small text-muted">Nível do estoque</span>
                        <span className="small fw-bold ms-2">{nivelEstoque}%</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="flex-fill"
                        onClick={() => { setSelectedInsumo(insumo); setMenuAdicionarAtivo(true); }}
                      >
                        Adicionar
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => { setSelectedInsumo(insumo); setMenuEditInsumoAtivo(true); }}
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => { setSelectedInsumo(insumo); setMenuDeleteInsumoAtivo(true); }}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {filteredInsumos.length === 0 && (
          <Row>
            <Col>
              <Card className="text-center py-5">
                <Card.Body>
                  <LuPackagePlus size={64} className="text-muted mb-3" />
                  <h5 className="text-muted">Nenhum insumo encontrado</h5>
                  <p className="text-muted">
                    {searchTerm ? 'Tente buscar por outro termo' : 'Cadastre seu primeiro insumo'}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      {/* Modal de Adicionar Insumo */}
      {menuAddInsumoAtivo && (
        <ModalForm
          title={titleFormAddInsumo}
          visible={menuAddInsumoAtivo}
          setVisible={setMenuAddInsumoAtivo}
          fields={fieldsFormAddInsumo}
          onSubmit={handleSubmitFormAddInsumo}
          message={messageFormAddInsumo}
          messageType={messageTypeFormAddInsumo}
          action="add"
        />
      )}

      {/* Modal de Editar Insumo */}
      {selectedInsumo && menuEditInsumoAtivo && (
        <ModalForm
          title={titleFormEditInsumo}
          visible={menuEditInsumoAtivo}
          setVisible={setMenuEditInsumoAtivo}
          fields={fieldsFormEditInsumo}
          onSubmit={handleSubmitFormEditInsumo}
          message={messageFormEditInsumo}
          messageType={messageTypeFormEditInsumo}
          action="edit"
        />
      )}

      {/* Modal de Deletar Insumo */}
      {selectedInsumo && menuDeleteInsumoAtivo && (
        <ModalForm
          title={titleFormDeleteInsumo}
          visible={menuDeleteInsumoAtivo}
          setVisible={setMenuDeleteInsumoAtivo}
          text={textFormDeleteInsumo}
          onSubmit={handleSubmitFormDeleteInsumo}
          message={messageFormDeleteInsumo}
          messageType={messageTypeFormDeleteInsumo}
          action="delete"
        />
      )}

      {/* Modal de Adicionar ao Estoque */}
      {selectedInsumo && menuAdicionarAtivo && (
        <ModalForm
          title={titleFormAdicionar}
          visible={menuAdicionarAtivo}
          setVisible={setMenuAdicionarAtivo}
          fields={fieldsFormAdicionar}
          onSubmit={handleSubmitFormAdicionar}
          message={messageFormAdicionar}
          messageType={messageTypeFormAdicionar}
          action="add"
        />
      )}

      {/* Modal de Alertas */}
      <Modal 
        show={showAlertModal} 
        onHide={() => setShowAlertModal(false)} 
        centered 
        size="lg"
      >
        <Modal.Header closeButton style={{ borderBottom: '1px solid #f0f0f0', padding: '20px 24px' }}>
          <Modal.Title className="fw-bold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Alertas de Estoque
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '24px' }}>
          {alertas.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">Nenhum alerta no momento! 🎉</p>
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
    </div>
  );
};

export default StockPage;
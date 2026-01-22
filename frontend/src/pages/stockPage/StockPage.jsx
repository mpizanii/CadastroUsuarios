import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FiSearch, FiPackage, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { LuPackagePlus } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import ModalForm from '../../components/menu/ModalForm';
import { formAddInsumo, formEditInsumo, formDeleteInsumo, formAdicionar } from '../../forms/stockForms';
import { useStock } from '../../contexts/StockContext';
import AlertasModal from "../../components/alertas/AlertasModal"
import { CiSearch } from "react-icons/ci";
import { FiAlertTriangle } from "react-icons/fi";

export default function StockPage() {
  const { insumos, loading, error, fetchInsumos, alertas, fetchAlertas } = useStock();
  const [busca, setBusca] = useState('');
  const [menuAddInsumoAtivo, setMenuAddInsumoAtivo] = useState(false);
  const [menuEditInsumoAtivo, setMenuEditInsumoAtivo] = useState(false);
  const [menuDeleteInsumoAtivo, setMenuDeleteInsumoAtivo] = useState(false);
  const [menuAdicionarAtivo, setMenuAdicionarAtivo] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

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
    if (alertas.length === 0) {
      fetchAlertas();
    }
  }, []);

  const insumosFiltrados = insumos.filter((insumo) => 
    insumo.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusBadge = (statusEstoque) => {
    const statusConfig = {
      'OK': { bg: 'success', text: 'OK' },
      'Baixo Estoque Mínimo': { bg: 'warning', text: 'Estoque baixo' },
      'Crítico Estoque Mínimo': { bg: 'danger', text: 'Estoque crítico' },
      'Baixo Validade': { bg: 'warning', text: 'Perto da validade' },
      'Crítico Validade': { bg: 'danger', text: 'Validade crítica' },
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
    <>
      <div className={`w-100 min-vh-100 bg-light ${menuAddInsumoAtivo || menuEditInsumoAtivo || menuDeleteInsumoAtivo || menuAdicionarAtivo ? "opacity-50" : ""}`} style={{ fontFamily: "Roboto, sans-serif" }}>
        <div style={{ padding: "35px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <div>
              <h1 style={{ color: "#212121", marginBottom: "5px", fontWeight: "bold" }}>Estoque</h1>
              <p style={{ color: "#666", margin: 0 }}>Controle seu estoque de insumos</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setMenuAddInsumoAtivo(true)}
              className="d-flex align-items-center gap-2"
              style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '500', border: 'none', backgroundColor: '#e76e50' }}
            >
              <FiPlus size={18} />
              Novo Insumo
            </Button>
          </div>

          <Row>
            <Col md={6}>
              <div style={{ marginBottom: "30px", position: "relative", maxWidth: "300px" }}>
                <CiSearch size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
                <Form.Control
                  type="text" 
                  placeholder="Buscar insumos..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={{ paddingLeft: "45px", width: "100%", borderRadius: "10px", border: "1px solid #ddd", padding: "12px 12px 12px 45px" }}
                />
              </div>
            </Col>
            <Col md={6} className="d-flex justify-content-end align-items-start">
              <Button 
                onClick={() => setShowAlertModal(true)}
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
                  e.currentTarget.style.borderColor = '#ffc107';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                <FiAlertTriangle size={18} color="#ffc107" />
                Alertas
              </Button>
            </Col>
          </Row>

          <Row>
            {insumosFiltrados.map((insumo) => {
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

                      <h5 className="fw-bold mb-2 text-truncate">{insumo.nome}</h5>
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

          {insumosFiltrados.length === 0 && (
            <Row>
              <Col>
                <Card className="text-center py-5">
                  <Card.Body>
                    <LuPackagePlus size={64} className="text-muted mb-3" />
                    <h5 className="text-muted">Nenhum insumo encontrado</h5>
                    <p className="text-muted">
                      {busca ? 'Tente buscar por outro termo' : 'Cadastre seu primeiro insumo'}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>

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

      <AlertasModal
        visible={showAlertModal}
        setVisible={setShowAlertModal}
        alertas={alertas}
        getStatusBadge={getStatusBadge}
        formatDate={formatDate}
      />

    </>
  );
};

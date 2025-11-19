import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FiClock } from 'react-icons/fi';
import { FiHelpCircle } from 'react-icons/fi';

const RecipesPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid className="p-4">
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="shadow-sm border-0 rounded">
              <Card.Body className="text-center py-5">
                <div className="mb-4">
                  <div 
                    className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '80px', height: '80px' }}
                  >
                    <FiHelpCircle size={40} className="text-danger" />
                  </div>
                </div>
                
                <h2 className="fw-bold text-dark mb-3">Suporte</h2>
                
                <p className="text-muted mb-4 lead">
                  Esta página está em desenvolvimento. Em breve você poderá tirar suas dúvidas sobre o sistema.
                </p>
                
                <Badge bg="warning" className="px-3 py-2">
                  <FiClock className="me-2" size={14} />
                  Em Desenvolvimento
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RecipesPage;
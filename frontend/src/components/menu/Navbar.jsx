import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledNavLink = styled(Nav.Link)`
  color: #fff !important;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #228b22 !important; 
    transform: scale(1.05);    
  }
`;

export default function NavbarSuperior({ path }) {

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao deslogar:", error.message);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Navbar 
      style={{ 
        backgroundColor: "#8B0000", 
        minHeight: "90px", 
        color: "white" 
      }} 
      expand="lg" 
      variant="dark"
    >
      <Container fluid className="d-flex justify-content-between px-3" style={{ justifyContent: 'space-around', display: 'flex', width: '100vw' }}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  width: '100%' 
               }}
          >
            <Nav>
              Logo
            </Nav>

            <Nav>
              <Nav.Link 
                href="/clientes"  
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: path === '/clientes' ? 'bold' : 'normal'
                }} 
                onClick={() => navigate("/clientes")}
              >
                Clientes
              </Nav.Link>

              <Nav.Link 
                href="/produtos" 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: path === '/produtos' ? 'bold' : 'normal'
                }} 
                onClick={() => navigate("/produtos")}
              >
                Produtos
              </Nav.Link>

              <Nav.Link 
                href="/estoque" 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: path === '/estoque' ? 'bold' : 'normal'
                }} 
                onClick={() => navigate("/estoque")}
              >
                Estoque
              </Nav.Link>

              <Nav.Link 
                href="/pedidos" 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: path === '/pedidos' ? 'bold' : 'normal'
                }} 
              >
                Pedidos
              </Nav.Link>

              <Nav.Link 
                href="/metricas" 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  transition: 'all 0.3s ease',
                  fontWeight: path === '/metricas' ? 'bold' : 'normal'
                }} 
              >
                Métricas
              </Nav.Link>
            </Nav>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant='link'
                style={{
                    color: '#fff',
                    textDecoration: 'none',
                    boxShadow: 'none',
                    padding: 0,
                    margin: 0
                }}
              >
                <i className="bi bi-person" style={{ fontSize: '24px' }} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>
                  Ver Informações
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bi bi-box-arrow-left"></i> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
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

export default function NavbarSuperior() {

  const navigate = useNavigate();

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
        backgroundColor: "#162521", 
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
              <StyledNavLink 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                }} 
                onClick={() => navigate("/clientes")}
              >
                Clientes
              </StyledNavLink>

              <StyledNavLink 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                }} 
                onClick={() => navigate("/produtos")}
              >
                Produtos
              </StyledNavLink>

              <StyledNavLink 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                }} 
                onClick={() => navigate("/estoque")}
              >
                Estoque
              </StyledNavLink>

              <StyledNavLink 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                }} 
                onClick={() => navigate("/pedidos")}
              >
                Pedidos
              </StyledNavLink>

              <StyledNavLink 
                style={{ 
                  color: '#fff',
                  padding: '0.75rem 1rem',
                }} 
                onClick={() => navigate("/receitas")}
              >
                Receitas
              </StyledNavLink>
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
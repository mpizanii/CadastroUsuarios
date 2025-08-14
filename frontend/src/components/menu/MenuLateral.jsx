import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { supabase } from "../../services/supabase";

export default function NavbarSuperior() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao deslogar:", error.message);
    } else {
      alert("Logout realizado com sucesso!");
      window.location.href = "/";
    }
  };

  return (
    <Navbar style={{ backgroundColor: "#162521", minHeight: "80px" }} expand="lg">
      <Container>
        <Navbar.Brand href="#">Cadastro de Clientes</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" style={{ color: "green" }}>Clientes</Nav.Link>
            <Nav.Link href="#" style={{ color: "white" }}>Produtos</Nav.Link>
          </Nav>
          <Button 
            variant="outline-danger" 
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left"></i> Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

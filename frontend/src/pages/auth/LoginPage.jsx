import { useState } from "react";
import { supabase } from "../../utils/supabase";
import svgAnimado from "../../assets/svgAnimado.svg";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  async function handleSignIn() {
    if (!email || !password) {
      setMessageType("error");
      setMessage("Preencha todos os campos.");
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessageType("error");
      setMessage("Erro ao entrar: " + error.message);
      return;
    }
    if (session) {
      navigate("/metricas");
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setMessageType("error");
      setMessage("Informe seu e-mail para redefinir a senha.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/resetpassword",
    });

    if (error) {
      setMessageType("error");
      setMessage("Erro ao solicitar redefinição de senha: " + error.message);
    } else {
      setMessageType("success");
      setMessage("Verifique seu e-mail para redefinir a senha!");
    }
  }

  return (
    <Container fluid style={{ width: "100vw", height: "100vh", backgroundColor: "#e9ecef" }}>
      <Row className="justify-content-center align-items-center h-100">
        <Col md={8}>
          <Card className="shadow-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <Row className="g-0">
              <Col md={6}>
                <div className="bg-white h-100 d-flex flex-column justify-content-center align-items-center text-dark" style={{ padding: "2rem" }}>
                  <h1>Bem-vindo novamente!</h1>
                  <p>Faça login com o seu e-mail.</p>
                  <img src={svgAnimado} alt="svg" style={{ width: "300px" }} />
                  <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>
                    Business illustrations by Storyset
                  </a>
                </div>
              </Col>

              <Col md={6}>
                <div className="h-100 d-flex w-100 flex-column justify-content-center text-center" style={{ backgroundColor: "#fff", padding: "2rem" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <img src="/scalda_logo.png" alt="Scalda" style={{ height: "56px", objectFit: "contain", marginBottom: "0.5rem" }} />
                    <h2 style={{ fontWeight: 800, color: "#212121", marginBottom: "0.25rem" }}>Scalda</h2>
                    <p style={{ color: "#666", fontSize: "0.95rem", margin: 0 }}>Acesse sua conta</p>
                  </div>
                  <Form className="mt-3 d-flex justify-content-center align-items-center flex-column text-start w-100" onSubmit={(e) => e.preventDefault()}>
                    <Form.Group className="mb-3" controlId="formEmail" style={{ width: "70%" }}>
                      <label htmlFor="formEmail" style={{ color: "#212121", fontWeight: 600, fontSize: "0.875rem" }}>Email</label>
                      <Form.Control
                        type="email"
                        placeholder="Digite seu email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="no-outline"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword" style={{ width: "70%" }}>
                      <label htmlFor="formPassword" style={{ color: "#212121", fontWeight: 600, fontSize: "0.875rem" }}>Senha</label>
                      <Form.Control
                        type="password"
                        placeholder="Digite sua senha..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Button
                      style={{ width: "40%", backgroundColor: "#e76e50", borderColor: "#e76e50", color: "#fff", fontWeight: 600, borderRadius: "8px" }}
                      onClick={handleSignIn}
                    >
                      Entrar
                    </Button>
                  </Form>

                  <a
                    href="#"
                    className="mt-2"
                    style={{ cursor: "pointer", color: "#e76e50", fontWeight: 600 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleForgotPassword();
                    }}
                  >
                    Esqueceu a senha?
                  </a>

                  {message && <div className="mt-3" style={{ color: messageType === "success" ? "#198754" : "#dc3545" }}>{message}</div>}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

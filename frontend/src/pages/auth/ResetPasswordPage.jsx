import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import svgAnimadoRedefinirSenha from "../../assets/svgAnimadoRedefinirSenha.svg";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [tokenPresente, setTokenPresente] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (newPassword !== repeatNewPassword) {
      setMessageType("error");
      setMessage("As senhas não coincidem.");
      return;
    }

    if (!newPassword || !repeatNewPassword) {
      setMessageType("error");
      setMessage("Preencha todos os campos.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessageType("error");
      setMessage("Erro: " + error.message);
    } else {
      setMessageType("success");
      setMessage("Senha redefinida com sucesso.");
      setNewPassword("");
      setRepeatNewPassword("");
    }
  }

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const accessToken = params.get("access_token");
    const type = params.get("type");

    if (accessToken && type === "recovery") {
      setTokenPresente(true);
      supabase.auth.setSession({ access_token: accessToken, refresh_token: "" });
    } else {
      navigate("/");
    }
  }, []);

  if (!tokenPresente) {
    return null;
  }

  return (
    <Container fluid style={{ width: "100vw", height: "100vh", backgroundColor: "#e9ecef" }}>
      <Row className="justify-content-center align-items-center h-100">
        <Col md={8}>
          <Card className="shadow-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <Row className="g-0">
              <Col md={6}>
                <div className="bg-white h-100 d-flex flex-column justify-content-center align-items-center text-dark" style={{ padding: "2rem" }}>
                  <h1>Redefinição de senha!</h1>
                  <img
                    src={svgAnimadoRedefinirSenha}
                    alt="svg"
                    style={{ width: "400px" }}
                  />
                  <a
                    href="https://storyset.com/business"
                    style={{ fontSize: "12px" }}
                  >
                    Business illustrations by Storyset
                  </a>
                </div>
              </Col>

              <Col md={6}>
                <div className="h-100 d-flex w-100 flex-column justify-content-center text-white text-center" style={{ backgroundColor: "#8B0000", padding: "2rem" }}>
                  <h1>Redefinir Senha</h1>
                  <Form className="mt-3 d-flex justify-content-center align-items-center flex-column text-start w-100" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 position-relative" controlId="formNewPassword" style={{ width: "70%" }}>
                      <label htmlFor="formNewPassword">Nova Senha</label>
                      <Form.Control
                        type="password"
                        placeholder="Digite a nova senha..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative" controlId="formRepeatNewPassword" style={{ width: "70%" }}>
                      <label htmlFor="formRepeatNewPassword">Repetir Nova Senha</label>
                      <Form.Control
                        type="password"
                        placeholder="Repita a nova senha..."
                        value={repeatNewPassword}
                        onChange={(e) => setRepeatNewPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Button variant="outline-light" type="submit" style={{ width: "40%" }} className="mt-2">
                      Confirmar
                    </Button>
                  </Form>

                  {message && <div className="mt-3" style={{ color: messageType === "success" ? "green" : "red" }}>{message}</div>}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

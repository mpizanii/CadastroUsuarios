import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { CustomContainer, LeftSectionLogin, RightSectionLogin, Message } from "./StyledAuthPages";
import svgAnimadoRedefinirSenha from "../../assets/svgAnimadoRedefinirSenha.svg";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
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
    <CustomContainer fluid>
      <Row className="justify-content-center align-items-center h-100">
        <Col md={8}>
          <Card className="shadow-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <Row className="g-0">
              <Col md={6}>
                <LeftSectionLogin>
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
                </LeftSectionLogin>
              </Col>

              <Col md={6}>
                <RightSectionLogin>
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

                    <Button variant="outline-success" type="submit" style={{ width: "40%" }} className="mt-2">
                      Confirmar
                    </Button>
                  </Form>

                  {message && <Message type={messageType}>{message}</Message>}
                </RightSectionLogin>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </CustomContainer>
  );
}

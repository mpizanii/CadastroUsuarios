import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import {
  CustomContainer,
  LeftSectionLight,
  RightSectionDark,
  IconWrapper,
  Message,
} from "./StyledAuthPages";
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
    <CustomContainer fluid>
      <Row className="justify-content-center align-items-center h-100">
        <Col md={8}>
          <Card className="shadow-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <Row className="g-0">
              {/* Lado esquerdo (claro com imagem) */}
              <Col md={6}>
                <LeftSectionLight>
                  <h1>Redefinição de senha!</h1>
                  <img
                    src={svgAnimadoRedefinirSenha}
                    alt="svg"
                    style={{ width: "450px" }}
                  />
                  <a
                    href="https://storyset.com/business"
                    style={{ fontSize: "12px" }}
                  >
                    Business illustrations by Storyset
                  </a>
                </LeftSectionLight>
              </Col>

              {/* Lado direito (formulário escuro) */}
              <Col md={6}>
                <RightSectionDark>
                  <h1>Redefinir Senha</h1>
                  <Form className="mt-3 w-100 px-4" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3 position-relative" controlId="formNewPassword">
                      <IconWrapper className="bi bi-lock-fill" />
                      <Form.Control
                        type="password"
                        placeholder="Nova Senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative" controlId="formRepeatNewPassword">
                      <IconWrapper className="bi bi-lock-fill" />
                      <Form.Control
                        type="password"
                        placeholder="Repetir Nova Senha"
                        value={repeatNewPassword}
                        onChange={(e) => setRepeatNewPassword(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Button variant="light" className="w-50 fw-bold" type="submit">
                      Confirmar
                    </Button>
                  </Form>

                  {message && <Message type={messageType}>{message}</Message>}
                </RightSectionDark>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </CustomContainer>
  );
}

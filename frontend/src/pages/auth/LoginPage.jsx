import { useState } from "react";
import { supabase } from "../../services/supabase";
import { CustomContainer, LeftSection, RightSection, IconWrapper, Message } from "./StyledAuthPages.js";
import svgAnimado from "../../assets/svgAnimado.svg";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Form, Button } from "react-bootstrap";

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
      navigate("/home");
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
    <CustomContainer fluid>
      <Row className="justify-content-center align-items-center h-100">
        <Col md={8}>
          <Card className="shadow-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <Row className="g-0">
              {/* Lado esquerdo */}
              <Col md={6}>
                <LeftSection>
                  <h1>Bem-vindo novamente!</h1>
                  <p>Faça login com o seu e-mail.</p>
                  <img src={svgAnimado} alt="svg" style={{ width: "300px" }} />
                  <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>
                    Business illustrations by Storyset
                  </a>
                </LeftSection>
              </Col>

              {/* Lado direito */}
              <Col md={6}>
                <RightSection>
                  <h1>Login</h1>
                  <Form className="mt-3" onSubmit={(e) => e.preventDefault()}>
                    <Form.Group className="mb-3" controlId="formEmail">
                      <IconWrapper className="bi bi-envelope" />
                      <Form.Control
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                      <IconWrapper className="bi bi-lock-fill" />
                      <Form.Control
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Button variant="dark" className="w-50" onClick={handleSignIn}>
                      Entrar
                    </Button>
                  </Form>

                  <a
                    href="#"
                    className="mt-2"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleForgotPassword();
                    }}
                  >
                    Esqueceu a senha?
                  </a>

                  <p className="mt-2">
                    Não possui cadastro? <Link to="/register">Cadastre-se</Link>
                  </p>

                  {message && <Message type={messageType}>{message}</Message>}
                </RightSection>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </CustomContainer>
  );
}

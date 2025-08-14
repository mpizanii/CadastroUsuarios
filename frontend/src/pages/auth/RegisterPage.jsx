import { useState } from "react";
import { supabase } from "../../services/supabase";
import {
  CustomContainer,
  LeftSectionDark,
  RightSectionLight,
  IconWrapper,
  Message,
} from "./StyledAuthPages";
import svgAnimadoCadastro from "../../assets/svgAnimadoCadastro.svg";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  async function handleSignUp(e) {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
        },
      },
    });

    if (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Erro ao cadastrar: " + error.message);
      return;
    }

    if (data?.user && !data?.session) {
      setMessageType("success");
      setMessage(
        "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta."
      );
    } else if (data?.user && data?.session) {
      alert("Conta criada e logada com sucesso.");
    } else {
      alert("Algo deu errado no cadastro.");
    }
  }

  return (
    <CustomContainer fluid>
      <Row className="justify-content-center align-items-center h-100">
        <Col md={8}>
          <Card className="shadow-lg" style={{ borderRadius: "10px", overflow: "hidden" }}>
            <Row className="g-0">
              {/* Lado esquerdo (formulário escuro) */}
              <Col md={6}>
                <LeftSectionDark>
                  <h1>Cadastro</h1>
                  <Form className="mt-3 w-100 px-4" onSubmit={handleSignUp}>
                    <Form.Group className="mb-3 position-relative" controlId="formName">
                      <IconWrapper className="bi bi-person" />
                      <Form.Control
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative" controlId="formEmail">
                      <IconWrapper className="bi bi-envelope" />
                      <Form.Control
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative" controlId="formPhone">
                      <IconWrapper className="bi bi-telephone" />
                      <Form.Control
                        type="text"
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3 position-relative" controlId="formPassword">
                      <IconWrapper className="bi bi-lock-fill" />
                      <Form.Control
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ paddingLeft: "36px" }}
                      />
                    </Form.Group>

                    <Button variant="light" className="w-50 fw-bold" type="submit">
                      Cadastrar
                    </Button>
                  </Form>
                  {message && <Message type={messageType}>{message}</Message>}
                </LeftSectionDark>
              </Col>

              {/* Lado direito (informativo claro) */}
              <Col md={6}>
                <RightSectionLight>
                  <h1>Seja bem-vindo!</h1>
                  <p>Preencha com as suas credenciais.</p>
                  <img
                    src={svgAnimadoCadastro}
                    alt="svg"
                    style={{ width: "400px" }}
                  />
                  <a
                    href="https://storyset.com/business"
                    style={{ fontSize: "12px" }}
                  >
                    Business illustrations by Storyset
                  </a>
                </RightSectionLight>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </CustomContainer>
  );
}

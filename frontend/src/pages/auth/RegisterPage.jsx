import { useState } from "react";
import { supabase } from "../../services/supabase";
import { CustomContainer, LeftSectionRegister, RightSectionRegister, Message } from "./StyledAuthPages";
import svgAnimadoCadastro from "../../assets/svgAnimadoCadastro.svg";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
              <Col md={6}>
                <LeftSectionRegister>
                  <h1>Cadastro</h1>
                  <Form className="mt-3 d-flex justify-content-center align-items-center flex-column text-start w-100" onSubmit={handleSignUp}>
                    <Form.Group className="mb-2 position-relative" controlId="formName" style={{ width: "70%" }}>
                      <label htmlFor="formName">Nome</label>
                      <Form.Control
                        type="text"
                        placeholder="Digite seu nome completo..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2 position-relative" controlId="formEmail" style={{ width: "70%" }}>
                      <label htmlFor="formEmail">E-mail</label>
                      <Form.Control
                        type="email"
                        placeholder="Digite seu e-mail..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2 position-relative" controlId="formPhone" style={{ width: "70%" }}>
                      <label htmlFor="formPhone">Telefone</label>
                      <Form.Control
                        type="text"
                        placeholder="Digite seu telefone..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4 position-relative" controlId="formPassword" style={{ width: "70%" }}>
                      <label htmlFor="formPassword">Senha</label>
                      <Form.Control
                        type="password"
                        placeholder="Digite sua senha..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Button variant="outline-success" className="w-50 fw-bold" type="submit">
                      Cadastrar
                    </Button>
                  </Form>

                  <p className="mt-3">
                    Já possui cadastro? <Link to="/">Faça login</Link>
                  </p>

                  {message && <Message type={messageType}>{message}</Message>}
                </LeftSectionRegister>
              </Col>

              <Col md={6}>
                <RightSectionRegister>
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
                </RightSectionRegister>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </CustomContainer>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { MdPeople, MdMenuBook } from "react-icons/md";
import { FiShoppingBag, FiPackage, FiCheck, FiSend } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";

const PRIMARY = "#e76e50";
const DARK = "#212121";
const GRAY = "#666";
const BG_LIGHT = "#f8f9fa";

const features = [
  {
    icon: <FiShoppingBag size={30} color={PRIMARY} />,
    title: "Pedidos organizados",
    desc: "Registre e acompanhe cada pedido em tempo real — sem papel, sem risco de esquecer.",
  },
  {
    icon: <FiPackage size={30} color={PRIMARY} />,
    title: "Estoque sob controle",
    desc: "Saiba exatamente o que está acabando antes de faltar no momento errado.",
  },
  {
    icon: <MdPeople size={30} color={PRIMARY} />,
    title: "Clientes no sistema",
    desc: "Mantenha o histórico de quem compra com você, tudo em um lugar só.",
  },
  {
    icon: <MdMenuBook size={30} color={PRIMARY} />,
    title: "Custo por receita",
    desc: "Calcule automaticamente quanto custa produzir cada item do cardápio.",
  },
];

const painPoints = [
  "Perdeu um pedido porque estava anotado no papel ou no WhatsApp?",
  "Ficou sem ingrediente na hora errada e precisou cancelar um pedido?",
  "Não sabia dizer exatamente quanto custa fazer um produto do cardápio?",
  "Perdeu o contato de um cliente fiel porque não tinha onde registrar?",
];

const plans = [
  {
    name: "Starter",
    price: "R$ 89",
    period: "/mês",
    description: "Para quem está começando a organizar o negócio.",
    highlight: false,
    features: [
      "Até 100 clientes cadastrados",
      "Até 50 produtos ativos",
      "Gestão de pedidos",
      "1 usuário",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Profissional",
    price: "R$ 189",
    period: "/mês",
    description: "Para negócios que querem controle total do dia a dia.",
    highlight: true,
    features: [
      "Clientes e produtos ilimitados",
      "Gestão de pedidos avançada",
      "Controle de estoque",
      "Receitas com custo automático",
      "Dashboard de métricas",
      "Até 5 usuários",
      "Suporte prioritário",
    ],
  },
];

const EMPTY_FORM = { nome: "", email: "", telefone: "", plano: "", mensagem: "" };

const DisabledButton = ({ size, style, children }) => (
  <Button
    size={size}
    disabled
    style={{
      backgroundColor: PRIMARY,
      borderColor: PRIMARY,
      color: "#fff",
      opacity: 0.5,
      cursor: "not-allowed",
      pointerEvents: "auto",
      ...style,
    }}
    title="Em breve"
  >
    {children ?? "Cadastrar"}
    <span
      style={{
        marginLeft: "0.5rem",
        fontSize: "0.75em",
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: "4px",
        padding: "1px 5px",
      }}
    >
      Em breve
    </span>
  </Button>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.plano) {
      setFormError("Preencha nome, e-mail e plano de interesse.");
      return;
    }
    setSubmitted(true);
    setFormData(EMPTY_FORM);
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e9ecef",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "1.4rem", color: PRIMARY, letterSpacing: "-0.5px" }}>
          Scalda
        </span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/login")}
            style={{ borderColor: PRIMARY, color: PRIMARY, fontWeight: 600 }}
          >
            Entrar
          </Button>
          <DisabledButton />
        </div>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: BG_LIGHT, padding: "5rem 1.5rem" }}>
        <Container>
          <Row className="justify-content-center align-items-center g-5">
            <Col md={6} lg={5} className="text-center text-md-start">
              <h1
                style={{
                  fontSize: "clamp(1.85rem, 4vw, 2.6rem)",
                  fontWeight: 800,
                  color: DARK,
                  lineHeight: 1.2,
                  marginBottom: "1.25rem",
                }}
              >
                Chega de controlar seu negócio de alimentação no papel e no WhatsApp.
              </h1>
              <p style={{ fontSize: "1.1rem", color: GRAY, marginBottom: "2rem", lineHeight: 1.6 }}>
                Scalda centraliza pedidos, estoque, clientes e receitas em um único sistema —
                para você vender mais e perder menos.
              </p>
              <div
                style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}
                className="justify-content-md-start"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  style={{ backgroundColor: PRIMARY, borderColor: PRIMARY, fontWeight: 600, padding: "0.7rem 2rem" }}
                >
                  Entrar
                </Button>
                <DisabledButton size="lg" style={{ padding: "0.7rem 1.5rem" }} />
              </div>
            </Col>

            {/* Visual mockup — só em telas md+ */}
            <Col md={6} lg={5} className="d-none d-md-block">
              <div
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                  padding: "1.5rem",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1.25rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid #e9ecef",
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f87171" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#fbbf24" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#4ade80" }} />
                  <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: GRAY, fontWeight: 600 }}>
                    Scalda — Visão geral
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { label: "Pedidos hoje", value: "12", color: "#e76e50" },
                    { label: "Itens em estoque", value: "47", color: "#3b82f6" },
                    { label: "Clientes cadastrados", value: "85", color: "#10b981" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: BG_LIGHT,
                        borderRadius: "8px",
                        padding: "0.6rem 1rem",
                      }}
                    >
                      <span style={{ color: GRAY, fontSize: "0.9rem" }}>{item.label}</span>
                      <span style={{ fontWeight: 700, fontSize: "1.1rem", color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                  <div
                    style={{
                      backgroundColor: `${PRIMARY}15`,
                      borderRadius: "8px",
                      padding: "0.6rem 1rem",
                      borderLeft: `3px solid ${PRIMARY}`,
                    }}
                  >
                    <span style={{ color: PRIMARY, fontSize: "0.85rem", fontWeight: 600 }}>
                      ⚠ 3 ingredientes abaixo do estoque mínimo
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section style={{ padding: "4.5rem 1.5rem", backgroundColor: "#fff" }}>
        <Container>
          <h2 style={{ textAlign: "center", fontWeight: 700, color: DARK, marginBottom: "0.5rem", fontSize: "1.75rem" }}>
            O que você ganha
          </h2>
          <p style={{ textAlign: "center", color: GRAY, marginBottom: "3rem", fontSize: "1rem" }}>
            Ferramentas pensadas para quem vende comida no dia a dia.
          </p>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col key={i} xs={12} sm={6} lg={3}>
                <div
                  style={{
                    backgroundColor: BG_LIGHT,
                    borderRadius: "12px",
                    padding: "1.75rem",
                    height: "100%",
                    borderTop: `3px solid ${PRIMARY}`,
                  }}
                >
                  <div style={{ marginBottom: "0.75rem" }}>{f.icon}</div>
                  <h5 style={{ fontWeight: 700, color: DARK, marginBottom: "0.5rem" }}>{f.title}</h5>
                  <p style={{ color: GRAY, fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Pain section */}
      <section style={{ backgroundColor: "#fff8f6", padding: "4.5rem 1.5rem" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <h2 style={{ textAlign: "center", fontWeight: 700, color: DARK, marginBottom: "0.5rem", fontSize: "1.75rem" }}>
                Você já passou por isso?
              </h2>
              <p style={{ textAlign: "center", color: GRAY, marginBottom: "2rem", fontSize: "1rem" }}>
                Situações comuns em negócios de alimentação sem sistema.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {painPoints.map((point, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      padding: "1rem 1.25rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <BsCheckCircleFill size={18} color={PRIMARY} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ color: DARK, fontSize: "0.95rem", lineHeight: 1.5 }}>{point}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <p style={{ color: GRAY, marginBottom: "1.25rem", fontSize: "1rem" }}>
                  Se você se identificou, o Scalda foi feito para você.
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  style={{ backgroundColor: PRIMARY, borderColor: PRIMARY, fontWeight: 600, padding: "0.7rem 2.5rem" }}
                >
                  Entrar no sistema
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pricing */}
      <section style={{ padding: "4.5rem 1.5rem", backgroundColor: "#fff" }}>
        <Container>
          <h2 style={{ textAlign: "center", fontWeight: 700, color: DARK, marginBottom: "0.5rem", fontSize: "1.75rem" }}>
            Planos
          </h2>
          <p style={{ textAlign: "center", color: GRAY, marginBottom: "3rem", fontSize: "1rem" }}>
            Escolha o plano certo para o tamanho do seu negócio.
          </p>
          <Row className="justify-content-center g-4">
            {plans.map((plan) => (
              <Col key={plan.name} xs={12} sm={10} md={5} lg={4}>
                <div
                  style={{
                    borderRadius: "16px",
                    padding: "2rem",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: plan.highlight ? `2px solid ${PRIMARY}` : "2px solid #e9ecef",
                    backgroundColor: plan.highlight ? `${PRIMARY}08` : "#fff",
                    position: "relative",
                  }}
                >
                  {plan.highlight && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-14px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: PRIMARY,
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "3px 14px",
                        borderRadius: "20px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mais completo
                    </span>
                  )}

                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{ fontWeight: 700, color: DARK, marginBottom: "0.25rem" }}>{plan.name}</h4>
                    <p style={{ color: GRAY, fontSize: "0.875rem", marginBottom: "1rem" }}>{plan.description}</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.2rem" }}>
                      <span style={{ fontSize: "2.25rem", fontWeight: 800, color: plan.highlight ? PRIMARY : DARK }}>
                        {plan.price}
                      </span>
                      <span style={{ color: GRAY, fontSize: "0.9rem" }}>{plan.period}</span>
                    </div>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                        <FiCheck size={16} color={PRIMARY} style={{ flexShrink: 0, marginTop: "3px" }} />
                        <span style={{ color: DARK, fontSize: "0.9rem" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "1.75rem" }}>
                    <DisabledButton
                      style={{
                        width: "100%",
                        padding: "0.6rem",
                        backgroundColor: plan.highlight ? PRIMARY : "transparent",
                        borderColor: PRIMARY,
                        color: plan.highlight ? "#fff" : PRIMARY,
                      }}
                    >
                      Assinar plano
                    </DisabledButton>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact form */}
      <section style={{ backgroundColor: BG_LIGHT, padding: "4.5rem 1.5rem" }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <h2 style={{ textAlign: "center", fontWeight: 700, color: DARK, marginBottom: "0.5rem", fontSize: "1.75rem" }}>
                Fale com a gente
              </h2>
              <p style={{ textAlign: "center", color: GRAY, marginBottom: "2.5rem", fontSize: "1rem" }}>
                Quer assinar um plano ou tem alguma dúvida? Preencha o formulário e retornamos em até 24 horas.
              </p>

              {submitted ? (
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "2.5rem",
                    textAlign: "center",
                    border: `2px solid ${PRIMARY}`,
                  }}
                >
                  <FiSend size={40} color={PRIMARY} style={{ marginBottom: "1rem" }} />
                  <h5 style={{ fontWeight: 700, color: DARK, marginBottom: "0.5rem" }}>
                    Mensagem enviada!
                  </h5>
                  <p style={{ color: GRAY, marginBottom: "1.5rem" }}>
                    Recebemos seu contato e entraremos em breve pelo e-mail informado.
                  </p>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    style={{ borderColor: PRIMARY, color: PRIMARY }}
                  >
                    Enviar outro
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "2rem 2.5rem",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  }}
                >
                  <Form onSubmit={handleFormSubmit}>
                    <Row className="g-3">
                      <Col xs={12} sm={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 600, fontSize: "0.875rem", color: DARK }}>
                            Nome completo <span style={{ color: PRIMARY }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="nome"
                            placeholder="João Silva"
                            value={formData.nome}
                            onChange={handleFormChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 600, fontSize: "0.875rem", color: DARK }}>
                            E-mail <span style={{ color: PRIMARY }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="joao@empresa.com"
                            value={formData.email}
                            onChange={handleFormChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 600, fontSize: "0.875rem", color: DARK }}>
                            Telefone
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="telefone"
                            placeholder="(11) 9 9999-9999"
                            value={formData.telefone}
                            onChange={handleFormChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 600, fontSize: "0.875rem", color: DARK }}>
                            Plano de interesse <span style={{ color: PRIMARY }}>*</span>
                          </Form.Label>
                          <Form.Select
                            name="plano"
                            value={formData.plano}
                            onChange={handleFormChange}
                          >
                            <option value="">Selecione...</option>
                            <option value="starter">Starter — R$ 89/mês</option>
                            <option value="profissional">Profissional — R$ 189/mês</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label style={{ fontWeight: 600, fontSize: "0.875rem", color: DARK }}>
                            Mensagem
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="mensagem"
                            placeholder="Conte um pouco sobre o seu negócio (opcional)"
                            value={formData.mensagem}
                            onChange={handleFormChange}
                            style={{ resize: "none" }}
                          />
                        </Form.Group>
                      </Col>

                      {formError && (
                        <Col xs={12}>
                          <p style={{ color: "#dc3545", fontSize: "0.875rem", margin: 0 }}>{formError}</p>
                        </Col>
                      )}

                      <Col xs={12}>
                        <Button
                          type="submit"
                          style={{
                            backgroundColor: PRIMARY,
                            borderColor: PRIMARY,
                            fontWeight: 600,
                            width: "100%",
                            padding: "0.65rem",
                          }}
                        >
                          <FiSend size={15} style={{ marginRight: "0.5rem" }} />
                          Enviar mensagem
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: DARK,
          color: "#888",
          textAlign: "center",
          padding: "1.5rem 2rem",
        }}
      >
        <Container>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            Scalda © {new Date().getFullYear()} —{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: PRIMARY, cursor: "pointer", textDecoration: "underline" }}
            >
              Entrar
            </span>
          </p>
        </Container>
      </footer>
    </div>
  );
}

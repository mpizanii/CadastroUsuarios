import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"
import { Container, Card, LoginLeftCard, LoginRightCard, InputDiv, Icon, RightCardInput, Button, Message } from "./StyledAuthPages"
import styled from "styled-components"
import svgAnimadoRedefinirSenha from "../../assets/svgAnimadoRedefinirSenha.svg"
import { useNavigate } from "react-router-dom"

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

        if (accessToken && type === "recovery"){
            setTokenPresente(true);
            supabase.auth.setSession({ access_token: accessToken, refresh_token: "" });
        } else {
            navigate("/");
        }
    }, []);
    
    if (!tokenPresente){
        return null;
    }

    return (
        <Container>
            <Card>
                <LoginLeftCard>
                    <h1>Redefinição de senha!</h1>
                    <img src={svgAnimadoRedefinirSenha} alt="svg" style={{ width: "450px" }} />
                    <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>Business illustrations by Storyset</a>
                </LoginLeftCard>
                <LoginRightCard>
                    <h1>Redefinir Senha</h1>
                    <InputDiv style={{ marginTop: "20px" }}>
                        <Icon className="bi bi-lock-fill" />
                        <RightCardInput type="password" placeholder="Nova Senha" onChange={(e) => setNewPassword(e.target.value)} value={newPassword}/>
                    </InputDiv>
                    <InputDiv style={{ marginTop: "10px" }}>
                        <Icon className="bi bi-lock-fill" />
                        <RightCardInput type="password" placeholder="Repetir Nova Senha" onChange={(e) => setRepeatNewPassword(e.target.value)} value={repeatNewPassword}/>
                    </InputDiv>
                    <Button onClick={handleSubmit}>Confirmar</Button>
                    {message && <Message type={messageType}>{message}</Message>}
                </LoginRightCard>
            </Card>
        </Container>
    )
}
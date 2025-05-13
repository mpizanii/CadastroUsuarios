import { useState } from "react"
import { supabase } from "../../services/supabase"
import { Container, Card, LoginLeftCard, LoginRightCard, InputDiv, Icon, RightCardInput, Button, Message } from "./StyledAuthPages"
import svgAnimado from "../../assets/svgAnimado.svg"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")
    const navigate = useNavigate()

    async function handleSignIn() {
        if (!email || !password) {
            setMessageType("error");
            setMessage("Preencha todos os campos.");
            return;
        }

        const {
            data: {session},
            error,
        } = await supabase.auth.signInWithPassword({email, password})
        if (error){
            setMessageType("error")
            setMessage("Erro ao entrar: " + error.message)
            return;
        } 
        if (session){
            navigate("/home")
        }
    }
    async function handleForgotPassword() {
        if (!email) {
            setMessageType("error");
            setMessage("Informe seu e-mail para redefinir a senha.");
            return;
        }

        const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:5173/resetpassword"
        });
        if (error) {
            setMessageType("error");
            setMessage("Erro ao solicitar redefinição de senha: " + error.message);
            return;
        } else {
            setMessageType("success");
            setMessage("Verifique seu e-mail, enviamos um e-mail para redefinição de senha!");
        }
    }

    return (
        <Container>
            <Card>
                <LoginLeftCard>
                    <h1>Bem vindo novamente!</h1>
                    <p>Faça login com o seu e-mail.</p>
                    <img src={svgAnimado} alt="svg" style={{ width: "300px" }} />
                    <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>Business illustrations by Storyset</a>
                </LoginLeftCard>
                <LoginRightCard>
                    <h1>Login</h1>
                    <InputDiv style={{ marginTop: "20px" }}>
                        <Icon className="bi bi-envelope" />
                        <RightCardInput type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </InputDiv>
                    <InputDiv style={{ marginTop: "10px" }}>
                        <Icon className="bi bi-lock-fill" />
                        <RightCardInput type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </InputDiv>
                    <Button onClick={handleSignIn}>Entrar</Button>
                    <a href="#" style={{ marginTop: "10px", cursor: "pointer" }} onClick={(e) => {
                        e.preventDefault()
                        handleForgotPassword();
                        }}>
                        Esqueceu a senha?
                    </a>
                    <p style={{ marginTop: "10px" }}>Não possui cadastro? <Link to="/register">Cadastre-se</Link></p>
                    {message && <Message type={messageType}>{message}</Message>}
                </LoginRightCard>
            </Card>
        </Container>
    )
}
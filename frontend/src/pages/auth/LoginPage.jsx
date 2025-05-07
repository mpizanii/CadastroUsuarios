import { useState } from "react"
import { supabase } from "../../services/supabase"
import styled from "styled-components"
import svgAnimado from "../../assets/svgAnimado.svg"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #e9ecef;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-family: Roboto, sans-serif;
`;
const Card = styled.div`
    width: 70%;
    height: 70%;
    background-color: #fff;
    display: flex;
    border-radius: 10px;
`;
const LeftCard = styled.div`
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #162521;
`;
const RightCard = styled.div`
    background-color: #162521;
    width: 40%;
    height: 100%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 8px;
    text-align: center; 
`;
const InputDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center
    gap: 8px;
    width: 70%;
    position: relative;
    height: 30px;
    background: transparent;
    padding: 10px;
`;
const Icon = styled.i`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    font-size: 20px;
`;
const RightCardInput = styled.input`
    background-color: #e9ecef;
    width: 100%;
    padding: 10px 10px 10px 36px;
    height: 100%;
    border: none;
    border-radius: 10px;
`;
const Button = styled.button`
    width: 40%;
    height: 35px;
    background-color: #355352;
    margin-top: 10px;
    border: none;
    border-radius: 20px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
`;
const Message = styled.div`
  margin-top: 20px;
  color: ${(props) => (props.type === "success" ? "green" : "red")};
`;

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
                <LeftCard>
                    <h1>Bem vindo novamente!</h1>
                    <p>Faça login com o seu e-mail.</p>
                    <img src={svgAnimado} alt="svg" style={{ width: "300px" }} />
                    <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>Business illustrations by Storyset</a>
                </LeftCard>
                <RightCard>
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
                </RightCard>
            </Card>
        </Container>
    )
}
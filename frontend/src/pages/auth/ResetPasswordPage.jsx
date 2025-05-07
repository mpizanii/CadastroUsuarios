import { useState, useEffect } from "react"
import { supabase } from "../../services/supabase"
import styled from "styled-components"
import svgAnimadoRedefinirSenha from "../../assets/svgAnimadoRedefinirSenha.svg"
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
                <LeftCard>
                    <h1>Redefinição de senha!</h1>
                    <img src={svgAnimadoRedefinirSenha} alt="svg" style={{ width: "450px" }} />
                    <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>Business illustrations by Storyset</a>
                </LeftCard>
                <RightCard>
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
                </RightCard>
            </Card>
        </Container>
    )
}
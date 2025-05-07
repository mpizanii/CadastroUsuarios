import { useState } from "react"
import { supabase } from "../../services/supabase"
import styled from "styled-components"
import svgAnimadoCadastro from "../../assets/svgAnimadoCadastro.svg"

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
    background-color: #162521;
    width: 40%;
    height: 100%;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 8px;
    text-align: center; 
`;
const RightCard = styled.div`
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #162521;
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

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState("success")

    async function handleSignUp(e) {
        e.preventDefault()
        const {data,error,} = await supabase.auth.signUp({
            email, 
            password,
            options:{
                data:{
                    name,
                    phone,
                }
            }
        });
        if (error){
            console.error(error);
            setMessageType("error")
            setMessage("Erro ao cadastrar: " + error.message)
            return;
        }
        if (data?.user && !data?.session){
            setMessageType("success")
            setMessage("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.")
        }else if (data?.user && data?.session) {
            alert("Conta criada e logada com sucesso.");
        } else {
            alert("Algo deu errado no cadastro.");
        }
    }
    return (
        <Container>
            <Card>
                <LeftCard>
                    <h1>Cadastro</h1>
                    <InputDiv style={{ marginTop: "20px" }}>
                        <Icon className="bi bi-person" />
                        <RightCardInput type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} value={name}/>
                    </InputDiv>
                    <InputDiv style={{ marginTop: "5px" }}>
                        <Icon className="bi bi-envelope" />
                        <RightCardInput type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </InputDiv>
                    <InputDiv style={{ marginTop: "5px" }}>
                        <Icon className="bi bi-telephone" />
                        <RightCardInput type="text" placeholder="Telefone" onChange={(e) => setPhone(e.target.value)} value={phone}/>
                    </InputDiv>
                    <InputDiv style={{ marginTop: "5px" }}>
                        <Icon className="bi bi-lock-fill" />
                        <RightCardInput type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} value={password}/>
                    </InputDiv>
                    <Button onClick={handleSignUp}>Cadastrar</Button>
                    {message && <Message type={messageType}>{message}</Message>}
                </LeftCard>
                <RightCard>
                    <h1>Seja bem vindo!</h1>
                    <p>Preencha com as suas credenciais.</p>
                    <img src={svgAnimadoCadastro} alt="svg" style={{ width: "400px" }} />
                    <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>Business illustrations by Storyset</a>
                </RightCard>
            </Card>
        </Container>
    )
}
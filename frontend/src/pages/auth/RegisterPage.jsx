import { useState } from "react"
import { supabase } from "../../services/supabase"
import { Container, Card, RegisterLeftCard, RegisterRightCard, InputDiv, Icon, RightCardInput, Button, Message } from "./StyledAuthPages"
import svgAnimadoCadastro from "../../assets/svgAnimadoCadastro.svg"

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
                <RegisterLeftCard>
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
                </RegisterLeftCard>
                <RegisterRightCard>
                    <h1>Seja bem vindo!</h1>
                    <p>Preencha com as suas credenciais.</p>
                    <img src={svgAnimadoCadastro} alt="svg" style={{ width: "400px" }} />
                    <a href="https://storyset.com/business" style={{ fontSize: "12px" }}>Business illustrations by Storyset</a>
                </RegisterRightCard>
            </Card>
        </Container>
    )
}
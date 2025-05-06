import { useState } from "react"
import { supabase } from "../../services/supabase"

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    async function handleSignUp(e) {
        const {
            data: {session},
            error,
        } = await supabase.auth.signUp({email, password})
        if (error){
            console.error(error);
            setMessage("Erro ao cadastrar" + error.message)
            return;
        }
        if (!session){
            setMessage("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.")
        }
    }
    async function handleSignIn() {
        const {
            data: {session},
            error,
        } = await supabase.auth.signInWithPassword({email, password})
        if (error){
            console.error(error)
            setMessage("Erro ao entrar: " + error.message)
            return
        } 
        if (session){
            setMessage("Login realizado com sucesso!")
        }
    }

    return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
        <div>
            <h2>Faça Login ou Cadastre-se</h2>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: 'block', marginBottom: 10, width: '100%' }} 
            />
            <input 
                type="password" 
                placeholder="Senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', marginBottom: 10, width: '100%' }}
            />
            <button 
                type="submit" 
                style={{ width: '100%', marginBottom: 10 }} 
                onClick={handleSignIn}
                >Entrar
            </button>
            <button    
                type="submit" 
                style={{ width: '100%' }} 
                onClick={handleSignUp}
                >Cadastrar
            </button>
            {message && (
            <div style={{ marginTop: 20, color: 'green' }}>
                {message}
            </div>
            )}
        </div>
    </div>
    )}
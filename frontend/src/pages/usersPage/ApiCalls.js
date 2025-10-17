import { supabase } from "../../services/supabase";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCustomers() {
    const { data: { user } } = await supabase.auth.getUser();
    const response = await axios.get(`${API_URL}/Clientes/usuario/${user.id}`);
    if (response.status !== 200) {
        console.error("Erro ao buscar os usuários");
        return;
    }

    return response.data;
}

export const addUser = async ({ name, email, phone, address }) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const novoCliente = {
            nome: name,
            email: email,
            telefone: phone,
            endereco: address,
            user_id: user.id
        };

        console.log(novoCliente);

        const response = await axios.post(`${API_URL}/Clientes`, novoCliente);

        if (response.status === 200 || response.status === 201) {
            return response.data; 
        }
    } catch (error) {
        throw error;
    }
}

export const editUser = async ({ nome, email, telefone, endereco, id }) => {
    try {
        const response = await axios.patch(`${API_URL}/Clientes/${id}`, {
            nome,
            email,
            telefone,
            endereco
        });

        if (response.status === 200 || response.status === 201) {
            return response.data; 
        }
    }
    catch (error) { 
        throw error;  
    }
}
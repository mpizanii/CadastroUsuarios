import { supabase } from "../utils/supabase";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getCustomers() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const response = await axios.get(`${API_URL}/Clientes/usuario/${user.id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os clientes:", error);
        throw new Error("Erro ao carregar clientes");
    }
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
        const response = await axios.post(`${API_URL}/Clientes`, novoCliente);
        return response.data; 
    } catch (error) {
        console.error("Erro ao adicionar cliente:", error);
        throw new Error("Erro ao adicionar cliente");
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

        return response.data; 
    }
    catch (error) { 
        console.error("Erro ao editar cliente:", error);
        throw new Error("Erro ao editar cliente");
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Clientes/${id}`);
        return response.data; 
    }
    catch (error) {
        console.error("Erro ao deletar cliente:", error);
        throw new Error("Erro ao deletar cliente");
    }
}
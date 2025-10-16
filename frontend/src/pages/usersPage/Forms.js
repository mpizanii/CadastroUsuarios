import { useState } from "react";
import { addUser } from "./ApiCalls.js";

export const formAddUser = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const title = "Cadastrar Cliente";
    const fields = [
        { id: "name", label: "Nome", placeholder: "Obrigatório", value: name, onChange: setName, required: true },
        { id: "email", label: "E-mail", type: "email", placeholder: "Opcional", value: email, onChange: setEmail },
        { id: "phone", label: "Telefone", placeholder: "Opcional", value: phone, onChange: setPhone },
        { id: "address", label: "Endereço", placeholder: "Opcional", value: address, onChange: setAddress },
    ];

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            await addUser({ name, email, phone, address });
            setMessageType("success");
            setMessage("Cliente adicionado com sucesso.");
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageType("error");
            setMessage("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        title,
        fields,
        handleSubmit,
        message,
        messageType
    }
}
import { useState } from "react";
import { addCustomer, editCustomer, deleteCustomer } from "../services/customerService";

export const formAddCustomer = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [messageFormAddCustomer, setMessageFormAddCustomer] = useState("");
    const [messageTypeFormAddCustomer, setMessageTypeFormAddCustomer] = useState("success");

    const titleFormAddCustomer = "Cadastrar Cliente";
    const fieldsFormAddCustomer = [
        { id: "name", label: "Nome", placeholder: "Obrigatório", value: name, onChange: setName, required: true },
        { id: "email", label: "E-mail", type: "email", placeholder: "Opcional", value: email, onChange: setEmail },
        { id: "phone", label: "Telefone", placeholder: "Opcional", value: phone, onChange: setPhone },
        { id: "address", label: "Endereço", placeholder: "Opcional", value: address, onChange: setAddress },
    ];

    async function handleSubmitFormAddCustomer(e) {
        e.preventDefault();

        try{
            await addCustomer({ name, email, phone, address });
            setMessageTypeFormAddCustomer("success");
            setMessageFormAddCustomer("Cliente adicionado com sucesso.");
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormAddCustomer("error");
            setMessageFormAddCustomer("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        titleFormAddCustomer,
        fieldsFormAddCustomer,
        handleSubmitFormAddCustomer,
        messageFormAddCustomer,
        setMessageFormAddCustomer,
        messageTypeFormAddCustomer
    }
}

export const formEditCustomer = ({ onSuccess, selectedCustomer }) => {
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [messageFormEditCustomer, setMessageFormEditCustomer] = useState("");
    const [messageTypeFormEditCustomer, setMessageTypeFormEditCustomer] = useState("success");

    const titleFormEditCustomer = "Editar dados do cliente";
    const fieldsFormEditCustomer = [
        { id: "name", label: "Nome", placeholder: selectedCustomer?.nome, value: newName, onChange: setNewName },
        { id: "email", label: "E-mail", type: "email", placeholder: selectedCustomer?.email, value: newEmail, onChange: setNewEmail },
        { id: "phone", label: "Telefone", placeholder: selectedCustomer?.telefone, value: newPhone, onChange: setNewPhone },
        { id: "address", label: "Endereço", placeholder: selectedCustomer?.endereco, value: newAddress, onChange: setNewAddress },
    ];

    async function handleSubmitFormEditCustomer(e) {
        e.preventDefault();

        try{
            await editCustomer( { nome: newName || selectedCustomer?.nome, email: newEmail || selectedCustomer?.email, telefone: newPhone || selectedCustomer?.telefone, endereco: newAddress || selectedCustomer?.endereco, id: selectedCustomer?.id } );
            setMessageTypeFormEditCustomer("success");
            setMessageFormEditCustomer("Dados do cliente editados com sucesso.");
            setNewName("");
            setNewEmail("");
            setNewPhone("");
            setNewAddress("");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormEditCustomer("error");
            setMessageFormEditCustomer("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        titleFormEditCustomer,
        fieldsFormEditCustomer,
        handleSubmitFormEditCustomer,
        messageFormEditCustomer,
        setMessageFormEditCustomer,
        messageTypeFormEditCustomer
    }
}

export const formDeleteCustomer = ({ onSuccess, selectedCustomer }) => {
    const [messageFormDeleteCustomer, setMessageFormDeleteCustomer] = useState("");
    const [messageTypeFormDeleteCustomer, setMessageTypeFormDeleteCustomer] = useState("success");

    const titleFormDeleteCustomer = "Deletar Cliente";

    async function handleSubmitFormDeleteCustomer(e) {
        e.preventDefault();
        try{
            await deleteCustomer(selectedCustomer?.id);
            setMessageTypeFormDeleteCustomer("success");
            setMessageFormDeleteCustomer("Cliente deletado com sucesso.");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormDeleteCustomer("error");
            setMessageFormDeleteCustomer("Erro: " + (error.response?.data?.message || error.message));
        }
    }
    return {
        titleFormDeleteCustomer,
        handleSubmitFormDeleteCustomer,
        messageFormDeleteCustomer,
        setMessageFormDeleteCustomer,
        messageTypeFormDeleteCustomer
    }
}
import { useState } from "react";
import { addUser, editUser, deleteUser } from "./ApiCalls.js";

export const formAddUser = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [messageFormAddUser, setMessageFormAddUser] = useState("");
    const [messageTypeFormAddUser, setMessageTypeFormAddUser] = useState("success");

    const titleFormAddUser = "Cadastrar Cliente";
    const fieldsFormAddUser = [
        { id: "name", label: "Nome", placeholder: "Obrigatório", value: name, onChange: setName, required: true },
        { id: "email", label: "E-mail", type: "email", placeholder: "Opcional", value: email, onChange: setEmail },
        { id: "phone", label: "Telefone", placeholder: "Opcional", value: phone, onChange: setPhone },
        { id: "address", label: "Endereço", placeholder: "Opcional", value: address, onChange: setAddress },
    ];

    async function handleSubmitFormAddUser(e) {
        e.preventDefault();

        try{
            await addUser({ name, email, phone, address });
            setMessageTypeFormAddUser("success");
            setMessageFormAddUser("Cliente adicionado com sucesso.");
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormAddUser("error");
            setMessageFormAddUser("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        titleFormAddUser,
        fieldsFormAddUser,
        handleSubmitFormAddUser,
        messageFormAddUser,
        setMessageFormAddUser,
        messageTypeFormAddUser
    }
}

export const formEditUser = ({ onSuccess, selectedUser }) => {
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [messageFormEditUser, setMessageFormEditUser] = useState("");
    const [messageTypeFormEditUser, setMessageTypeFormEditUser] = useState("success");

    const titleFormEditUser = "Editar dados do cliente";
    const fieldsFormEditUser = [
        { id: "name", label: "Nome", placeholder: selectedUser?.nome, value: newName, onChange: setNewName },
        { id: "email", label: "E-mail", type: "email", placeholder: selectedUser?.email, value: newEmail, onChange: setNewEmail },
        { id: "phone", label: "Telefone", placeholder: selectedUser?.telefone, value: newPhone, onChange: setNewPhone },
        { id: "address", label: "Endereço", placeholder: selectedUser?.endereco, value: newAddress, onChange: setNewAddress },
    ];

    async function handleSubmitFormEditUser(e) {
        e.preventDefault();

        try{
            await editUser( { nome: newName || selectedUser?.nome, email: newEmail || selectedUser?.email, telefone: newPhone || selectedUser?.telefone, endereco: newAddress || selectedUser?.endereco, id: selectedUser?.id } );
            setMessageTypeFormEditUser("success");
            setMessageFormEditUser("Dados do cliente editados com sucesso.");
            setNewName("");
            setNewEmail("");
            setNewPhone("");
            setNewAddress("");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormEditUser("error");
            setMessageFormEditUser("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        titleFormEditUser,
        fieldsFormEditUser,
        handleSubmitFormEditUser,
        messageFormEditUser,
        setMessageFormEditUser,
        messageTypeFormEditUser
    }
}

export const formDeleteUser = ({ onSuccess, selectedUser }) => {
    const [messageFormDeleteUser, setMessageFormDeleteUser] = useState("");
    const [messageTypeFormDeleteUser, setMessageTypeFormDeleteUser] = useState("success");

    const titleFormDeleteUser = "Deletar Cliente";

    async function handleSubmitFormDeleteUser(e) {
        e.preventDefault();
        try{
            await deleteUser(selectedUser?.id);
            setMessageTypeFormDeleteUser("success");
            setMessageFormDeleteUser("Cliente deletado com sucesso.");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormDeleteUser("error");
            setMessageFormDeleteUser("Erro: " + (error.response?.data?.message || error.message));
        }
    }
    return {
        titleFormDeleteUser,
        handleSubmitFormDeleteUser,
        messageFormDeleteUser,
        setMessageFormDeleteUser,
        messageTypeFormDeleteUser
    }
}
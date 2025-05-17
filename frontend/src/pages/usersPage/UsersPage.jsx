import {
  Container,
  Card,
  CardButtons,
  SearchWrapper,
  SearchButton,
  SearchInput,
  TableHeader,
  TableBody,
  TableEditUserButton,
  TableDeleteUserButton,
  AddUserButton,
  DivFormAddUser,
  FormAddUser,
  FormAddUserInput,
  FormAddUserCancelButton,
  FormAddUserSubmitButton,
  Message
} from "./StyledUsersPage";

import MenuLateral from "../../components/menu/menulateral";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

export default function UsersPage() {
  const [menuAddUserAtivo, setMenuAddUserAtivo] = useState(false);
  const [formAddUser, setFormAddUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() =>{
    getUsers()
  },[])

  async function AddUser(e) {
    e.preventDefault();

    const { error } = await supabase
      .from('users')
      .insert([
        {
          nome: name,
          email: email,
          telefone: phone,
          endereco: address
        }
      ]);

    if (error) {
      setMessageType("error");
      setMessage("Erro: " + error.message);
    } else {
      setMessageType("success");
      setMessage("Cliente adicionado com sucesso.");
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");

      setTimeout(() => {
        setFormAddUser(false);
        setMenuAddUserAtivo(false);
        window.location.reload();
      }, 2000);
    }
  }

  async function getUsers() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('user_id', user.id);

    if (error) {
      setMessageType("error");
      setMessage("Erro ao buscar os usuários");
      return;
    } else {
      setCustomers(data);
    }
  }

  return (
    <>
      <Container className={menuAddUserAtivo ? "blur" : ""}>
        <MenuLateral />
        <Card>
          <h2 style={{ marginBottom: "20px" }}>Clientes</h2>
          <CardButtons>
            <SearchWrapper>
              <SearchInput type="text" placeholder="Buscar Nome" />
              <SearchButton>
                <i className="bi bi-search"></i>
              </SearchButton>
            </SearchWrapper>
            <AddUserButton onClick={() => {
              setMenuAddUserAtivo(true);
              setFormAddUser(true);
            }}>
              Adicionar Cliente
            </AddUserButton>
          </CardButtons>

          <TableHeader>
            <div>ID</div>
            <div>Nome</div>
            <div>E-mail</div>
            <div>Telefone</div>
            <div>Endereço</div>
            <div>Ações</div>
          </TableHeader>

          {customers.map((customer) => (
            <TableBody key={customer.id}>
              <div>{customer.id}</div>
              <div>{customer.nome}</div>
              <div>{customer.email}</div>
              <div>{customer.telefone}</div>
              <div>{customer.endereco}</div>
              <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%", height: "100%", alignItems: "center" }} >
                <TableEditUserButton><i className="bi bi-pencil-square"/></TableEditUserButton>
                <TableDeleteUserButton><i className="bi bi-trash-fill"/></TableDeleteUserButton>
              </div>
            </TableBody>
          ))}

        </Card>
      </Container>

      <DivFormAddUser $visible={formAddUser}>
        <FormAddUser $visible={formAddUser} onSubmit={AddUser}>
          <h1>Cadastrar Cliente</h1>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "60%",
            gap: "5px"
          }}>
            <label htmlFor="name" style={{ marginLeft: "5px" }}>Nome</label>
            <FormAddUserInput
              id="name"
              type="text"
              placeholder="Obrigatório"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="email" style={{ marginLeft: "5px" }}>E-mail</label>
            <FormAddUserInput
              id="email"
              type="email"
              placeholder="Opcional"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="phone" style={{ marginLeft: "5px" }}>Telefone</label>
            <FormAddUserInput
              id="phone"
              type="text"
              placeholder="Opcional"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label htmlFor="address" style={{ marginLeft: "5px" }}>Endereço</label>
            <FormAddUserInput
              id="address"
              type="text"
              placeholder="Opcional"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "5px" }}>
              <FormAddUserSubmitButton type="submit">Confirmar</FormAddUserSubmitButton>
              <FormAddUserCancelButton type="button" onClick={() => {
                setFormAddUser(false);
                setMenuAddUserAtivo(false);
              }}>
                Cancelar
              </FormAddUserCancelButton>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
              {message && <Message type={messageType}>{message}</Message>}
            </div>
          </div>
        </FormAddUser>
      </DivFormAddUser>
    </>
  );
}

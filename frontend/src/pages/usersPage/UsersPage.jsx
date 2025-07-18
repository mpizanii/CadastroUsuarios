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
} from "./StyledUsersPage";
import MenuLateral from "../../components/menu/MenuLateral.jsx";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import FormAddUser from "../../components/menu/FormAddUser.jsx";
import FormEditUser from "../../components/menu/FormEditUser.jsx";
import FormDeleteUser from "../../components/menu/FormDeleteUser.jsx";
import axios from 'axios';

export default function UsersPage() {
  const [menuAddUserAtivo, setMenuAddUserAtivo] = useState(false);
  const [menuEditUserAtivo, setMenuEditUserAtivo] = useState(false);
  const [menuDeleteUserAtivo, setMenuDeleteUserAtivo] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [busca, setBusca] = useState('');

  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() =>{
      getUsers()
    },[])
    
    async function getUsers() {
    const { data: { user } } = await supabase.auth.getUser();

    const response = await axios.get(`${api_url}/Clientes/usuario/${user.id}`)
    console.log(response)
    
    if (response.status != 200){
      setMessageType("error");
      setMessage("Erro ao buscar os usuários");
      return;
    }
    setCustomers(response.data)
  }

  const clientesNumerados = customers.map((cliente, index) => ({
    ...cliente,
    numero: index + 1,
  }))

  const clientesFiltrados = clientesNumerados.filter((customer) => customer.nome.toLowerCase().includes(busca.toLowerCase()))

  return (
    <>
      <Container className={menuAddUserAtivo || menuEditUserAtivo || menuDeleteUserAtivo ? "blur" : ""}>
        <MenuLateral />
        <Card>
          <h2 style={{ marginBottom: "20px" }}>Clientes</h2>
          <CardButtons>
            <SearchWrapper>
              <SearchInput type="text" placeholder="Buscar Nome" value={busca} onChange={(e) => setBusca(e.target.value) } />
              <SearchButton>
                <i className="bi bi-search"></i>
              </SearchButton>
            </SearchWrapper>
            <AddUserButton onClick={() => {
              setMenuAddUserAtivo(true);
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

          {clientesFiltrados.map((customer) => (
            <TableBody key={customer.id}>
              <div>{customer.numero}</div>
              <div>{customer.nome}</div>
              <div>{customer.email}</div>
              <div>{customer.telefone}</div>
              <div>{customer.endereco}</div>
              <div style={{ display: "flex", 
                            justifyContent: "space-evenly", 
                            width: "100%", 
                            height: "100%", 
                            alignItems: "center" }}>
                <TableEditUserButton><i className="bi bi-pencil-square" onClick={() => { 
                  setSelectedUser(customer); 
                  setMenuEditUserAtivo(true) 
                  }} />
                </TableEditUserButton>
                <TableDeleteUserButton><i className="bi bi-trash-fill" onClick={() => {
                  setSelectedUser(customer);
                  setMenuDeleteUserAtivo(true)
                }}/></TableDeleteUserButton>
              </div>
            </TableBody>
          ))}

        </Card>
      </Container>

      <FormAddUser 
      visible={menuAddUserAtivo} 
      setVisible={setMenuAddUserAtivo} 
      getUsersFunction={getUsers}/>

      {selectedUser && (
        <FormEditUser
          visible={menuEditUserAtivo}
          setVisible={setMenuEditUserAtivo}
          userID={selectedUser.id}
          userName={selectedUser.nome}
          userEmail={selectedUser.email}
          userPhone={selectedUser.telefone}
          userAddress={selectedUser.endereco}
          getUsersFunction={getUsers}
        />
      )}

      {selectedUser && (
        <FormDeleteUser
          visible={menuDeleteUserAtivo}
          setVisible={setMenuDeleteUserAtivo}
          userID={selectedUser.id}
          getUsersFunction={getUsers}
        />
      )}
    </>
  );
}

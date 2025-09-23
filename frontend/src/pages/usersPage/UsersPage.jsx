import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import axios from "axios";
import FormAddUser from "../../components/menu/FormAddUser.jsx";
import FormEditUser from "../../components/menu/FormEditUser.jsx";
import FormDeleteUser from "../../components/menu/FormDeleteUser.jsx";
import {
  Container,
  CardTable,
  SearchInput,
  TableActionButton,
  CardTableHeader,
  SearchButton,
} from "./StyledUsersPage";
import { Button, Table } from "react-bootstrap";

export default function UsersPage() {
  const [menuAddUserAtivo, setMenuAddUserAtivo] = useState(false);
  const [menuEditUserAtivo, setMenuEditUserAtivo] = useState(false);
  const [menuDeleteUserAtivo, setMenuDeleteUserAtivo] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [busca, setBusca] = useState("");

  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const { data: { user } } = await supabase.auth.getUser();
    const response = await axios.get(`${api_url}/Clientes/usuario/${user.id}`);
    if (response.status !== 200) {
      console.error("Erro ao buscar os usuários");
      return;
    }
    setCustomers(response.data);
  }

  const clientesNumerados = customers.map((cliente, index) => ({
    ...cliente,
    numero: index + 1,
  }));

  const clientesFiltrados = clientesNumerados.filter((customer) =>
    customer.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <>
      <Container className={menuAddUserAtivo || menuEditUserAtivo || menuDeleteUserAtivo ? "blur" : ""}>
        <h2 style={{ marginTop: "40px", color: "#212121" }}>Cadastro e monitoramento de clientes</h2>

        <CardTable>
          <CardTableHeader>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchInput 
                type="text" 
                placeholder="Buscar por nome..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <SearchButton><i className="bi bi-search" /></SearchButton>
            </div>

            <Button variant="outline-danger" onClick={() => setMenuAddUserAtivo(true)}>
              Adicionar cliente
            </Button>
          </CardTableHeader>

          <Table striped style={{ textAlign: "center", margin: 0 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {clientesFiltrados.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.numero}</td>
                  <td>{customer.nome}</td>
                  <td>{customer.email}</td>
                  <td>{customer.telefone}</td>
                  <td>{customer.endereco}</td>
                  <td>
                    <TableActionButton
                      onClick={() => {
                        setSelectedUser(customer);
                        setMenuEditUserAtivo(true);
                      }}
                      title="Editar dados do cliente"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </TableActionButton>

                    <TableActionButton
                      onClick={() => {
                        setSelectedUser(customer);
                        setMenuDeleteUserAtivo(true);
                      }}
                      title="Excluir cliente"
                    >
                      <i className="bi bi-trash-fill"></i>
                    </TableActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardTable>
      </Container>

      {menuAddUserAtivo && (
        <FormAddUser
          visible={menuAddUserAtivo}
          setVisible={setMenuAddUserAtivo}
          getUsersFunction={getUsers}
        />
      )}

      {selectedUser && menuEditUserAtivo && (
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

      {selectedUser && menuDeleteUserAtivo && (
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

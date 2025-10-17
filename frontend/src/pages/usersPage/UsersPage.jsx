import { useState, useEffect } from "react";
import ModalForm from "../../components/menu/ModalForm.jsx";
import { getCustomers } from "./ApiCalls.js";
import { formAddUser, formEditUser } from "./Forms.js";
import FormDeleteUser from "../../components/menu/FormDeleteUser.jsx";
import { Container, CardTable, SearchInput, TableActionButton, CardTableHeader, SearchButton } from "./StyledUsersPage";
import { Button, Table, Spinner } from "react-bootstrap";

export default function UsersPage() {
  const [menuAddUserAtivo, setMenuAddUserAtivo] = useState(false);
  const [menuEditUserAtivo, setMenuEditUserAtivo] = useState(false);
  const [menuDeleteUserAtivo, setMenuDeleteUserAtivo] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [busca, setBusca] = useState("");

  const { titleFormAddUser, fieldsFormAddUser, handleSubmitFormAddUser, messageFormAddUser, setMessageFormAddUser, messageTypeFormAddUser } = formAddUser({
    onSuccess: () => {
      setMenuAddUserAtivo(false);
      setMessageFormAddUser("");
    },
  });  

  const { titleFormEditUser, fieldsFormEditUser, handleSubmitFormEditUser, messageFormEditUser, setMessageFormEditUser, messageTypeFormEditUser } = formEditUser({
    onSuccess: () => {
      setMenuEditUserAtivo(false);
      setMessageFormEditUser("");
    },
    selectedUser,
  });  

  useEffect(() => {
    if (!menuAddUserAtivo && !menuEditUserAtivo && !menuDeleteUserAtivo){
      async function fetchCustomers() {
        const data = await getCustomers(); 
        setCustomers(data || []);
      }

      fetchCustomers();
    };
  }, [menuAddUserAtivo, menuEditUserAtivo, menuDeleteUserAtivo]);

  const clientesNumerados = customers.map((cliente, index) => ({
    ...cliente,
    numero: index + 1,
  }));

  const clientesFiltrados = clientesNumerados.filter((customer) =>
    customer.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (customers.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span>Carregando dados dos clientes</span>
      </div>
    )
  }

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
        <ModalForm
          title={titleFormAddUser}
          visible={menuAddUserAtivo}
          setVisible={setMenuAddUserAtivo}
          fields={fieldsFormAddUser}
          onSubmit={handleSubmitFormAddUser}
          message={messageFormAddUser}
          messageType={messageTypeFormAddUser}
        />
      )}

      {selectedUser && menuEditUserAtivo && (
        <ModalForm
          title={titleFormEditUser}
          visible={menuEditUserAtivo}
          setVisible={setMenuEditUserAtivo}
          fields={fieldsFormEditUser}
          onSubmit={handleSubmitFormEditUser}
          message={messageFormEditUser}
          messageType={messageTypeFormEditUser}
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

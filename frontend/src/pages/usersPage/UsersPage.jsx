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
import MenuLateral from "../../components/menu/menulateral";
import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import FormAddUser from "../../components/menu/FormAddUser.jsx";

export default function UsersPage() {
  const [menuAddUserAtivo, setMenuAddUserAtivo] = useState(false);
  const [customers, setCustomers] = useState([]);

  useEffect(() =>{
    getUsers()
  },[])

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
              <div style={{ display: "flex", 
                            justifyContent: "space-evenly", 
                            width: "100%", 
                            height: "100%", 
                            alignItems: "center" }}>
                <TableEditUserButton><i className="bi bi-pencil-square"/></TableEditUserButton>
                <TableDeleteUserButton><i className="bi bi-trash-fill"/></TableDeleteUserButton>
              </div>
            </TableBody>
          ))}

        </Card>
      </Container>

      <FormAddUser visible={menuAddUserAtivo} setVisible={setMenuAddUserAtivo}/>
    </>
  );
}

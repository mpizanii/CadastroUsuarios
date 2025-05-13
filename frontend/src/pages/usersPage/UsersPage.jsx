import { Container, Card, CardButtons, SearchWrapper, SearchButton, SearchInput, TableHeader, AddUserButton } from "./StyledUsersPage";
import MenuLateral from "../../components/menu/menulateral";

export default function UsersPage() {

    return (
        <Container>
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
                    <AddUserButton>Adicionar Cliente</AddUserButton>
                </CardButtons>
                <TableHeader>
                    <h4>ID</h4>
                    <h4>Nome</h4>
                    <h4>E-mail</h4>
                    <h4>Telefone</h4>
                    <h4>Endereço</h4>
                    <h4>Ações</h4>
                </TableHeader>
            </Card>
        </Container>
    );
}

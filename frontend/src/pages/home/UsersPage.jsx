import styled from "styled-components";
import MenuLateral from "../../components/menu/menulateral";

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: Roboto, sans-serif;
`;

const Card = styled.div`
    width: calc(100% - 372px);
    height: 85%;
    padding: 32px;
    margin: 32px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #162521;
`;

const SearchWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    border: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    outline: none;
`;

const SearchButton = styled.button`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #355352;
    color: white;
    padding: 10px;
    border: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
`;

export default function UsersPage() {
  return (
    <Container>
        <MenuLateral />
        <Card>
            <h2 style={{ marginBottom: "20px" }}>Clientes</h2>
            <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "50px",
            }}
            >
                <SearchWrapper>
                    <SearchInput type="text" placeholder="Buscar Nome" />
                    <SearchButton>
                    <i className="bi bi-search"></i>
                    </SearchButton>
                </SearchWrapper>
                <button style={{ backgroundColor: "#355352", color: "white", border: "none", borderRadius: "5px", height: "30px", cursor: "pointer", width: "120px" }} >Adicionar Cliente</button>
            </div>
        </Card>
    </Container>
  );
}

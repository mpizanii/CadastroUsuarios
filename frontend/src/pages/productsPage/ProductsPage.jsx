import { useState, useEffect } from "react";
import ModalForm from "../../components/menu/ModalForm.jsx";
import { getProducts } from "./ApiCalls.js";
import { formAddProduct, formEditProduct, formDeleteProduct } from "./Forms.js";
import { Container, CardTable, SearchInput, TableActionButton, CardTableHeader, SearchButton } from "./StyledProductsPage";
import { Button, Table, Spinner } from "react-bootstrap";

export default function OrdersPage() {
  const [menuAddProductAtivo, setMenuAddProductAtivo] = useState(false);
  const [menuEditProductAtivo, setMenuEditProductAtivo] = useState(false);
  const [menuDeleteProductAtivo, setMenuDeleteProductAtivo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [busca, setBusca] = useState("");

  const { titleFormProduct, fieldsFormAddProduct, handleSubmitFormAddProduct, messageFormAddProduct, setMessageFormAddProduct, messageTypeFormAddProduct } = formAddProduct({
    onSuccess: () => {
      setMenuAddProductAtivo(false);
      setMessageFormAddProduct("");
    },
  });  

  const { titleFormEditProduct, fieldsFormEditProduct, handleSubmitFormEditProduct, messageFormEditProduct, setMessageFormEditProduct, messageTypeFormEditProduct } = formEditProduct({
    onSuccess: () => {
      setMenuEditProductAtivo(false);
      setMessageFormEditProduct("");
    },
    selectedProduct
  });  

  const { titleFormDeleteProduct, handleSubmitFormDeleteProduct, messageFormDeleteProduct, setMessageFormDeleteProduct, messageTypeFormDeleteProduct } = formDeleteProduct({
    onSuccess: () => {
      setMenuDeleteProductAtivo(false);
      setMessageFormDeleteProduct("");
    },
    selectedProduct
  });

  useEffect(() => {
    if (!menuAddProductAtivo && !menuEditProductAtivo && !menuDeleteProductAtivo){
      async function fetchProducts() {
        const data = await getProducts(); 
        setProducts(data || []);
      }

      fetchProducts();
    };
  }, [menuAddProductAtivo, menuEditProductAtivo, menuDeleteProductAtivo]);

  const produtosNumerados = products.map((produto, index) => ({
    ...produto,
    numero: index + 1,
  }));

  const produtosFiltrados = produtosNumerados.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (products.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span>Carregando dados dos produtos</span>
      </div>
    )
  }

  return (
    <>
      <Container className={menuAddProductAtivo || menuEditProductAtivo || menuDeleteProductAtivo ? "blur" : ""}>
        <h2 style={{ marginTop: "40px", color: "#212121" }}>Cadastro e monitoramento de produtos</h2>

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

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button variant="outline-danger" onClick={() => setMenuAddProductAtivo(true)}>
                Adicionar receita
              </Button>
              <Button variant="outline-danger" onClick={() => setMenuAddProductAtivo(true)}>
                Adicionar produto
              </Button>
            </div>
          </CardTableHeader>

          <Table striped style={{ textAlign: "center", margin: 0 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Custo Unitário</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.numero}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.preco}</td>
                  <td>{produto.custo}</td>
                  <td>
                    <TableActionButton
                      onClick={() => {
                        setSelectedProduct(produto);
                        setMenuEditProductAtivo(true);
                      }}
                      title="Editar dados do produto"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </TableActionButton>

                    <TableActionButton
                      onClick={() => {
                        setSelectedProduct(produto);
                        setMenuDeleteProductAtivo(true);
                      }}
                      title="Excluir produto"
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

      {menuAddProductAtivo && (
        <ModalForm
          title={titleFormProduct}
          visible={menuAddProductAtivo}
          setVisible={setMenuAddProductAtivo}
          fields={fieldsFormAddProduct}
          onSubmit={handleSubmitFormAddProduct}
          message={messageFormAddProduct}
          messageType={messageTypeFormAddProduct}
          action={"add"}
        />
      )}

      {selectedProduct && menuEditProductAtivo && (
        <ModalForm
          title={titleFormEditProduct}
          visible={menuEditProductAtivo}
          setVisible={setMenuEditProductAtivo}
          fields={fieldsFormEditProduct}
          onSubmit={handleSubmitFormEditProduct}
          message={messageFormEditProduct}
          messageType={messageTypeFormEditProduct}
          action={"edit"}
        />
      )}

      {selectedProduct && menuDeleteProductAtivo && (
        <ModalForm
          title={titleFormDeleteProduct}
          visible={menuDeleteProductAtivo}
          setVisible={setMenuDeleteProductAtivo}
          onSubmit={handleSubmitFormDeleteProduct}
          message={messageFormDeleteProduct}
          messageType={messageTypeFormDeleteProduct}
          action={"delete"}
        />
      )}
    </>
  );
}

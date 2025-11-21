import { useState, useEffect } from "react";
import ModalForm from "../../components/menu/ModalForm.jsx";
import { getProducts } from "./ApiCalls.js";
import { formAddProduct, formEditProduct, formDeleteProduct, formAddRecipe } from "./Forms.js";
import { Container, SearchInput } from "./StyledProductsPage";
import { LuChefHat } from "react-icons/lu";
import { Button, Card, Badge, Spinner } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { SlPencil, SlTrash } from "react-icons/sl";
import { BiShow } from "react-icons/bi";

export default function OrdersPage() {
  const [menuAddProductAtivo, setMenuAddProductAtivo] = useState(false);
  const [menuEditProductAtivo, setMenuEditProductAtivo] = useState(false);
  const [menuDeleteProductAtivo, setMenuDeleteProductAtivo] = useState(false);
  const [menuAddRecipeAtivo, setMenuAddRecipeAtivo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(); 
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  }

  const { titleFormAddProduct, fieldsFormAddProduct, handleSubmitFormAddProduct, messageFormAddProduct, setMessageFormAddProduct, messageTypeFormAddProduct } = formAddProduct({
    onSuccess: () => {
      setMenuAddProductAtivo(false);
      setMessageFormAddProduct("");
      fetchProducts();
    },
  });  

  const { titleFormEditProduct, fieldsFormEditProduct, handleSubmitFormEditProduct, messageFormEditProduct, setMessageFormEditProduct, messageTypeFormEditProduct } = formEditProduct({
    onSuccess: () => {
      setMenuEditProductAtivo(false);
      setMessageFormEditProduct("");
      fetchProducts();
    },
    selectedProduct
  });  

  const { titleFormDeleteProduct, handleSubmitFormDeleteProduct, messageFormDeleteProduct, setMessageFormDeleteProduct, messageTypeFormDeleteProduct } = formDeleteProduct({
    onSuccess: () => {
      setMenuDeleteProductAtivo(false);
      setMessageFormDeleteProduct("");
      fetchProducts();
    },
    selectedProduct
  });

  const { titleFormAddRecipe, fieldsFormAddRecipe, handleSubmitFormAddRecipe, messageFormAddRecipe, setMessageFormAddRecipe, messageTypeFormAddRecipe } = formAddRecipe({
    onSuccess: () => {
      setMenuAddRecipeAtivo(false);
      setMessageFormAddRecipe("");
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const produtosNumerados = products.map((produto, index) => ({
    ...produto,
    numero: index + 1,
  }));

  const produtosFiltrados = produtosNumerados.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
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
        <div style={{ padding: "35px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <div>
              <h1 style={{ color: "#212121", marginBottom: "5px", fontWeight: "bold" }}>Produtos</h1>
              <p style={{ color: "#666", margin: 0 }}>Gerencie seus produtos e vincule receitas</p>
            </div>
            <Button 
              style={{ padding: "10px 20px", borderRadius: "8px" }}
              onClick={() => setMenuAddProductAtivo(true)}
              variant="outline-success"
            >
              + Novo Produto
            </Button>
          </div>

          <div style={{ marginBottom: "30px", position: "relative", maxWidth: "300px" }}>
            <CiSearch size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
            <SearchInput 
              type="text" 
              placeholder="Buscar produtos..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ paddingLeft: "45px", width: "100%", borderRadius: "10px", border: "1px solid #ddd", padding: "12px 12px 12px 45px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {produtosFiltrados.map((produto) => {
              const precoNum = Number(produto.preco) || 0;
              const custoNum = Number(produto.custo) || 0;
              const margem = precoNum ? Math.round(((precoNum - custoNum) / precoNum) * 100) : 0;

              const formatCurrency = (value) => {
                try {
                  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                } catch { return value; }
              }

              const status = produto.ativo === false ? 'inativo' : 'Ativo';

              return (
                <Card key={produto.id} className="h-100 border-0 p-2 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex gap-3">
                        <div 
                          className="rounded d-flex align-items-center justify-content-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "#e76e501a ",
                            fontSize: "20px",
                            color: "#e76e50",
                          }}
                        >
                          <LuChefHat />
                        </div>
                        <div>
                          <Card.Title className="mb-0 h5">{produto.nome}</Card.Title>
                          <small className="text-muted">{produto.descricao || produto.nome}</small>
                        </div>
                      </div>
                      <Badge bg={status === 'Ativo' ? 'success' : 'secondary'}>{status}</Badge>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', flexDirection: "column", marginBottom: 8, borderBottom: '1px solid #eee', gap: 5 }}>
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Preço de Venda:</small>
                          <div style={{ color: '#2E8B57', fontWeight: 700 }}>{formatCurrency(precoNum)}</div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <small className="text-muted">Custo:</small>
                          <div style={{ fontWeight: 700, color: '#4f4f4fff' }}>{formatCurrency(custoNum)}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between">
                        <small className="text-muted">Margem de Lucro:</small>
                        <div style={{ color: margem >= 50 ? '#2E8B57' : '#830101ff', fontWeight: 700 }}>{margem}%</div>
                      </div>


                      <div style={{ paddingTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Button variant="outline-secondary" size="sm" title="Ver receita" className="w-50">
                          <LuChefHat /> Ver Receita
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => { setSelectedProduct(produto); setMenuEditProductAtivo(true); }}
                          title="Editar produto"
                          className="w-50"
                        >
                          <SlPencil /> Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => { setSelectedProduct(produto); setMenuDeleteProductAtivo(true); }}
                          title="Excluir produto"
                        >
                          <SlTrash />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )
            })}
          </div>

          {produtosFiltrados.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <i className="bi bi-box-seam" style={{ fontSize: "48px", marginBottom: "16px", display: "block" }} />
              <p>Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </Container>

      {menuAddProductAtivo && (
        <ModalForm
          title={titleFormAddProduct}
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
      
      {menuAddRecipeAtivo && (
        <ModalForm
          title={titleFormAddRecipe}
          visible={menuAddRecipeAtivo}
          setVisible={setMenuAddRecipeAtivo}
          fields={fieldsFormAddRecipe}
          onSubmit={handleSubmitFormAddRecipe}
          message={messageFormAddRecipe}
          messageType={messageTypeFormAddRecipe}
          action={"add"}
        />
      )}
    </>
  );
}

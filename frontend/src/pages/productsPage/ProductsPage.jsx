import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalForm from "../../components/menu/ModalForm.jsx";
import { formAddProduct, formEditProduct, formDeleteProduct } from "../../forms/productsForms";
import { LuChefHat } from "react-icons/lu";
import { Button, Card, Badge, Spinner, Form } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { SlPencil, SlTrash } from "react-icons/sl";
import { useProducts } from "../../contexts";
import { FiPlus } from 'react-icons/fi';

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products, loading, error, fetchProducts } = useProducts();
  const [menuAddProductAtivo, setMenuAddProductAtivo] = useState(false);
  const [menuEditProductAtivo, setMenuEditProductAtivo] = useState(false);
  const [menuDeleteProductAtivo, setMenuDeleteProductAtivo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [busca, setBusca] = useState("");

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

  useEffect(() => {
    if (products.length === 0){
      fetchProducts();
    }
  }, []);

  const produtosNumerados = products.map((produto, index) => ({
    ...produto,
    numero: index + 1,
  }));

  const produtosFiltrados = produtosNumerados.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading && products.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span>Carregando produtos</span>
      </div>
    )
  }

  if (error && products.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "48px", color: "#dc3545" }} />
        <span style={{ color: "#666" }}>{error}</span>
        <Button onClick={fetchProducts} variant="outline-primary">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className={`w-100 min-vh-100 bg-light ${menuAddProductAtivo || menuEditProductAtivo || menuDeleteProductAtivo ? "opacity-50" : ""}`} style={{ fontFamily: "Roboto, sans-serif" }}>
        <div style={{ padding: "35px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <div>
              <h1 style={{ color: "#212121", marginBottom: "5px", fontWeight: "bold" }}>Produtos</h1>
              <p style={{ color: "#666", margin: 0 }}>Gerencie seus produtos e vincule receitas</p>
            </div>
            <Button 
              variant="primary"
              onClick={() => setMenuAddProductAtivo(true)}
              className="d-flex align-items-center gap-2"
              style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '500', border: 'none', backgroundColor: '#e76e50' }}
            >
              <FiPlus size={18} />
              Novo Produto
            </Button>
          </div>

          <div style={{ marginBottom: "30px", position: "relative", maxWidth: "300px" }}>
            <CiSearch size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
            <Form.Control
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

              const formatCurrency = (value) => {
                try {
                  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                } catch { return value; }
              }

              const status = produto.ativo === false ? 'inativo' : 'Ativo';

              return (
                <Card 
                  key={produto.id} 
                  className="h-100 border-0 p-2 shadow-sm" 
                  style={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)', 
                    transition: 'transform 0.2s, box-shadow 0.2s' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex gap-3" style={{ minWidth: 0, flex: 1 }}>
                        <div 
                          className="rounded d-flex align-items-center justify-content-center"
                          style={{
                            width: "45px",
                            height: "45px",
                            backgroundColor: "#e76e501a ",
                            fontSize: "20px",
                            color: "#e76e50",
                            flexShrink: 0
                          }}
                        >
                          <LuChefHat />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <Card.Title className="mb-0 h5 text-truncate" title={produto.nome}>
                            {produto.nome}
                          </Card.Title>
                          <small className="text-muted text-truncate d-block" title={produto.descricao || produto.nome}>
                            {produto.descricao || produto.nome}
                          </small>
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
                        <div style={{ color: produto.margem >= 50 ? '#2E8B57' : '#830101ff', fontWeight: 700 }}>{Math.round(produto.margem)}%</div>
                      </div>


                      <div style={{ paddingTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          title="Ver receita" 
                          className="w-50"
                          onClick={() => produto.receita_Id ? navigate(`/receitas/${produto.receita_Id}`) : alert('Este produto não possui receita associada')}
                          disabled={!produto.receita_Id}
                        >
                          <LuChefHat /> Ver Receita
                        </Button>
                        <Button
                          variant="outline-primary"
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
      </div>

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
    </>
  );
}

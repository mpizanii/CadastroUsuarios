import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Table, Badge, Button, Spinner } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";
import { SlPencil } from "react-icons/sl";
import { MdOutlineMap } from "react-icons/md";
import axios from "axios";
import MapeamentoModal from "./MapeamentoModal";
import { getIngredientesComMapeamento, getInsumos, mapearIngrediente } from "./MapeamentoApi";

const API_URL = import.meta.env.VITE_API_URL;

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [showMapeamentoModal, setShowMapeamentoModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/Receitas/${id}`);
        setRecipe(response.data);
        
        // Buscar produto associado
        const productsResponse = await axios.get(`${API_URL}/Produtos`);
        const associatedProduct = productsResponse.data.find(p => p.receita_Id === parseInt(id));
        setProduct(associatedProduct);

        // Buscar ingredientes com mapeamento
        const ingredientesData = await getIngredientesComMapeamento(id);
        setIngredients(ingredientesData);

        // Buscar insumos disponíveis
        const insumosData = await getInsumos();
        setInsumos(insumosData);
      } catch (error) {
        console.error("Erro ao buscar receita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleMapearClick = (ingrediente) => {
    setSelectedIngredient(ingrediente);
    setShowMapeamentoModal(true);
  };

  const handleMapear = async (ingredienteId, insumoId, fatorConversao) => {
    await mapearIngrediente(ingredienteId, insumoId, fatorConversao);
    // Recarregar ingredientes
    const ingredientesData = await getIngredientesComMapeamento(id);
    setIngredients(ingredientesData);
  };

  const calcularProgresso = () => {
    if (!ingredients || ingredients.length === 0) return 0;
    const mapeados = ingredients.filter(ing => ing.mapeado).length;
    return Math.round((mapeados / ingredients.length) * 100);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span>Carregando receita...</span>
      </div>
    );
  }

  if (!recipe) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Receita não encontrada</h3>
          <Button variant="outline-primary" onClick={() => navigate("/produtos")}>
            Voltar para Produtos
          </Button>
        </div>
      </Container>
    );
  }

  const modoPreparo = recipe.modo_Preparo ? recipe.modo_Preparo.split(";").map(s => s.trim()).filter(s => s) : [];

  return (
    <Container fluid style={{ padding: "35px 30px", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => navigate("/produtos")}
              className="d-flex align-items-center gap-2"
            >
              <FiArrowLeft size={18} />
            </Button>
            <div>
              <h2 className="mb-1" style={{ fontWeight: "bold" }}>{recipe.nome}</h2>
              <p className="text-muted mb-0">
                Produto: {product?.nome || "Sem produto associado"} • Criada em {new Date(recipe.created_At).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={() => console.log("Recipe: ", recipe)} className="d-flex align-items-center gap-2">
              <MdOutlineMap size={18} /> Mapear Insumos
            </Button>
            <Button variant="outline-primary" onClick={() => console.log("Ingrediente: ", ingredients)} className="d-flex align-items-center gap-2">
              <SlPencil size={16} /> Editar
            </Button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "20px" }}>
          {/* Ingredientes */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom" style={{ padding: "20px" }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Ingredientes</h5>
                <Badge bg={calcularProgresso() === 100 ? "success" : calcularProgresso() > 0 ? "warning" : "secondary"}>
                  {calcularProgresso()}% mapeado
                </Badge>
              </div>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
              <Table className="mb-0" style={{ fontSize: "14px" }}>
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th style={{ padding: "12px 20px", fontWeight: "600", width: "10%" }}></th>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Ingrediente</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600", textAlign: "right" }}>Quantidade</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600" }}>Insumo Mapeado</th>
                    <th style={{ padding: "12px 20px", fontWeight: "600", textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients && ingredients.length > 0 ? (
                    ingredients.map((ingrediente, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "16px 20px" }}>
                          <div 
                            style={{ 
                              width: "8px", 
                              height: "8px", 
                              borderRadius: "50%", 
                              backgroundColor: ingrediente.mapeado ? "#28a745" : "#6c757d"
                            }}
                          />
                        </td>
                        <td style={{ padding: "16px 20px", fontWeight: "500" }}>
                          {ingrediente.nome}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          {ingrediente.quantidade} {ingrediente.unidade}
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          {ingrediente.mapeado ? (
                            <div>
                              <div style={{ fontWeight: "500", fontSize: "13px" }}>{ingrediente.insumoNome}</div>
                              <div style={{ fontSize: "12px", color: "#6c757d" }}>
                                Fator: {ingrediente.fatorConversao}x
                              </div>
                            </div>
                          ) : (
                            <Badge bg="secondary" style={{ fontSize: "11px" }}>
                              Não mapeado
                            </Badge>
                          )}
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <Button 
                            variant={ingrediente.mapeado ? "outline-secondary" : "outline-primary"}
                            size="sm"
                            onClick={() => handleMapearClick(ingrediente)}
                          >
                            <MdOutlineMap size={16} /> {ingrediente.mapeado ? "Editar" : "Mapear"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center text-muted" style={{ padding: "20px" }}>
                        Nenhum ingrediente cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Modo de Preparo */}
          <Card className="border-0 shadow-sm" style={{ height: "fit-content" }}>
            <Card.Header className="bg-white border-bottom" style={{ padding: "20px" }}>
              <h5 className="mb-0">Modo de Preparo</h5>
            </Card.Header>
            <Card.Body style={{ padding: "20px" }}>
              {modoPreparo.length > 0 ? (
                <ol style={{ paddingLeft: "20px", margin: 0 }}>
                  {modoPreparo.map((passo, index) => (
                    <li key={index} style={{ marginBottom: "12px", fontSize: "14px", lineHeight: "1.6" }}>
                      {passo}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted mb-0">Nenhum modo de preparo cadastrado</p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Modal de Mapeamento */}
      {selectedIngredient && (
        <MapeamentoModal
          visible={showMapeamentoModal}
          setVisible={setShowMapeamentoModal}
          ingrediente={selectedIngredient}
          insumos={insumos}
          onMapear={handleMapear}
        />
      )}
    </Container>
  );
}

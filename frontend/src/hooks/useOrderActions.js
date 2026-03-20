import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPedido, verificarMapeamentoProdutos } from '../services/ordersService';

export const useOrderActions = ({ fetchOrders }) => {
  const navigate = useNavigate();
  const [showMapeamentoModal, setShowMapeamentoModal] = useState(false);
  const [ingredientesNaoMapeados, setIngredientesNaoMapeados] = useState([]);
  const [pedidoPendente, setPedidoPendente] = useState(null);

  const handleVerificarMapeamento = async (pedidoData) => {
    try {
      const resultado = await verificarMapeamentoProdutos(pedidoData.produtos);
      
      if (!resultado.todosMapeados && resultado.ingredientesNaoMapeados.length > 0) {
        setIngredientesNaoMapeados(resultado.ingredientesNaoMapeados);
        setPedidoPendente(pedidoData);
        setShowMapeamentoModal(true);
        
        return { sucesso: false, mapeamentoIncompleto: true };
      } else {
        await addPedido(pedidoData);
        fetchOrders();
        return { sucesso: true };
      }
    } catch (error) {
      console.error('Erro ao verificar mapeamento:', error);
      return { sucesso: false, erro: error.message };
    }
  };

  const handleConfirmarPedidoSemBaixa = async () => {
    try {
      const pedidoSemBaixa = { ...pedidoPendente, darBaixaEstoque: false };
      await addPedido(pedidoSemBaixa);
      setShowMapeamentoModal(false);
      setPedidoPendente(null);
      setIngredientesNaoMapeados([]);
      fetchOrders();
      return { sucesso: true };
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return { sucesso: false, erro: error.message };
    }
  };

  const handleIrParaMapeamento = (ingrediente) => {
    setShowMapeamentoModal(false);
    navigate(`/receitas/${ingrediente.receitaId}`);
  };

  const resetMapeamentoState = () => {
    setShowMapeamentoModal(false);
    setPedidoPendente(null);
    setIngredientesNaoMapeados([]);
  };

  return {
    showMapeamentoModal,
    setShowMapeamentoModal,
    ingredientesNaoMapeados,
    pedidoPendente,
    handleVerificarMapeamento,
    handleConfirmarPedidoSemBaixa,
    handleIrParaMapeamento,
    resetMapeamentoState
  };
};
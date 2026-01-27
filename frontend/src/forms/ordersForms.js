import { useState } from "react";
import { addPedido, updatePedidoStatus, deletePedido, verificarEstoquePedido } from "../services/ordersService";
import { useOrders } from "../contexts/OrdersContext";

const STATUS_OPTIONS = {"Pendente": "Pendente", "Em Preparo": "Em Preparo", "Em Rota de Entrega": "Em Rota de Entrega", "Entregue": "Entregue"};

export const formAddPedido = ({ onSuccess, onVerificarMapeamento }) => {
    const { produtosDisponiveis, clientesDisponiveis } = useOrders();
    const [clienteId, setClienteId] = useState("");
    const [clienteNome, setClienteNome] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [produtos, setProdutos] = useState([{ produtoId: "", quantidade: 1, precoUnitario: 0 }]);
    const [messageFormAddPedido, setMessageFormAddPedido] = useState("");
    const [messageTypeFormAddPedido, setMessageTypeFormAddPedido] = useState("success");
    const [pedidoPendente, setPedidoPendente] = useState(null);
    const [showAvisosEstoque, setShowAvisosEstoque] = useState(false);
    const [avisosEstoque, setAvisosEstoque] = useState([]);

    const titleFormAddPedido = "Novo Pedido";

    const handleAddProduto = () => {
        setProdutos([...produtos, { produtoId: "", quantidade: 1, precoUnitario: 0 }]);
    };

    const handleRemoveProduto = (index) => {
        const newProdutos = produtos.filter((_, i) => i !== index);
        setProdutos(newProdutos);
    };

    const handleProdutoChange = (index, field, value) => {
        const newProdutos = [...produtos];
        newProdutos[index][field] = value;

        if (field === "produtoId") {
            const produto = produtosDisponiveis.find(p => p.id === parseInt(value));
            if (produto) {
                newProdutos[index].precoUnitario = parseFloat(produto.preco || 0);
            }
        }

        setProdutos(newProdutos);
    };

    const handleClienteChange = (value) => {
        setClienteId(value);
        const cliente = clientesDisponiveis.find(c => c.id === parseInt(value));
        if (cliente) {
            setClienteNome(cliente.nome);
        } else {
            setClienteNome("");
        }
    };

    const fieldsFormAddPedido = [
        {
            id: "cliente",
            label: "Cliente",
            type: "select",
            value: clienteId,
            onChange: handleClienteChange,
            options: clientesDisponiveis.map(c => ({ value: c.id, label: c.nome })),
            placeholder: "Selecione um cliente"
        },
        {
            id: "produtos",
            label: "Produtos",
            type: "produtos-list",
            value: produtos,
            onAddProduto: handleAddProduto,
            onRemoveProduto: handleRemoveProduto,
            onProdutoChange: handleProdutoChange,
            produtosDisponiveis: produtosDisponiveis
        },
        {
            id: "observacoes",
            label: "Observações",
            type: "textarea",
            placeholder: "Observações sobre o pedido...",
            value: observacoes,
            onChange: setObservacoes
        }
    ];

    const criarPedido = async (pedidoData) => {
        try {
            if (onVerificarMapeamento) {
                await onVerificarMapeamento(pedidoData);
            } else {
                await addPedido(pedidoData);
                setMessageTypeFormAddPedido("success");
                setMessageFormAddPedido("Pedido criado com sucesso!");
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormAddPedido("error");
            setMessageFormAddPedido(error.message || "Erro ao criar pedido.");
        }
    };

    const handleSubmitFormAddPedido = async (event) => {
        event.preventDefault();
        setMessageFormAddPedido("");

        if (!clienteNome && !clienteId) {
            setMessageTypeFormAddPedido("error");
            setMessageFormAddPedido("Por favor, selecione o nome de um cliente.");
            return;
        }

        const produtosValidos = produtos.filter(p => p.produtoId && p.quantidade > 0);
        if (produtosValidos.length === 0) {
            setMessageTypeFormAddPedido("error");
            setMessageFormAddPedido("Por favor, adicione pelo menos um produto ao pedido.");
            return;
        }

        try {
            const produtos = produtosValidos.map(p => ({
                produtoId: parseInt(p.produtoId),
                quantidade: parseInt(p.quantidade),
                precoUnitario: parseFloat(p.precoUnitario)
            }));

            const verificacaoEstoque = await verificarEstoquePedido(produtos);

            const pedidoData = {
                clienteId: clienteId ? parseInt(clienteId) : null,
                clienteNome: clienteNome,
                observacoes: observacoes,
                produtos: produtos,
                darBaixaEstoque: true
            };

            if (verificacaoEstoque.temAvisos && verificacaoEstoque.avisos.length > 0) {
                setAvisosEstoque(verificacaoEstoque.avisos);
                setPedidoPendente(pedidoData);
                setShowAvisosEstoque(true);
                return;
            }

            await criarPedido(pedidoData);

        } catch (error) {
            setMessageTypeFormAddPedido("error");
            setMessageFormAddPedido(error.message || "Erro ao criar pedido.");
        }
    };

    const handleConfirmarComAvisos = async () => {
        setShowAvisosEstoque(false);
        await criarPedido(pedidoPendente);
        setPedidoPendente(null);
        setAvisosEstoque([]);
    }

    const handleCancelarComAvisos = () => {
        setShowAvisosEstoque(false);
        setPedidoPendente(null);
        setAvisosEstoque([]);
        setMessageTypeFormAddPedido("info");
        setMessageFormAddPedido("Criação do pedido cancelada devido aos avisos de estoque.");
    }

    return {
        titleFormAddPedido,
        fieldsFormAddPedido,
        handleSubmitFormAddPedido,
        messageFormAddPedido,
        messageTypeFormAddPedido,
        showAvisosEstoque,
        setShowAvisosEstoque,
        avisosEstoque,
        handleConfirmarComAvisos,
        handleCancelarComAvisos
    };
};

export const formEditOrderStatus = ({ pedido, onSuccess }) => {
    const [status, setStatus] = useState("");
    const [messageFormEditStatus, setMessageFormEditStatus] = useState("");
    const [messageTypeFormEditStatus, setMessageTypeFormEditStatus] = useState("success");

    const titleFormEditStatus = "Alterar Status do Pedido";

    const fieldsFormEditStatus = [
        {
            id: "pedidoInfo",
            label: "Pedido",
            value: `#${String(pedido?.id).padStart(4, '0')} - ${pedido?.clienteNome}`,
            disabled: true
        },
        {
            id: "statusAtual",
            label: "Status Atual",
            value: pedido?.status || "",
            disabled: true
        },
        {
            id: "novoStatus",
            label: "Novo Status",
            type: "select",
            value: status,
            placeholder: "Selecione o novo status",
            onChange: setStatus,
            options: Object.values(STATUS_OPTIONS).map(s => ({ value: s, label: s })),
            required: true,
        }
    ];

    const handleSubmitFormEditStatus = async (event) => {
        event.preventDefault();
        setMessageFormEditStatus("");

        if (status === pedido?.status) {
            setMessageTypeFormEditStatus("error");
            setMessageFormEditStatus("Selecione um status diferente do atual.");
            return;
        }

        try {
            await updatePedidoStatus(pedido.id, status);
            setMessageTypeFormEditStatus("success");
            setMessageFormEditStatus("Status atualizado com sucesso!");

            if (onSuccess) onSuccess();

            setMessageFormEditStatus("");
            setStatus(pedido?.status || "Pendente");
        } catch (error) {
            setMessageTypeFormEditStatus("error");
            setMessageFormEditStatus(error.message || "Erro ao atualizar status.");

            setMessageFormEditStatus("");
            setStatus(pedido?.status || "Pendente");
        }
    };

    return {
        titleFormEditStatus,
        fieldsFormEditStatus,
        handleSubmitFormEditStatus,
        messageFormEditStatus,
        messageTypeFormEditStatus
    };
};

export const formDeletePedido = ({ pedido, onSuccess }) => {
    const [messageFormDeletePedido, setMessageFormDeletePedido] = useState("");
    const [messageTypeFormDeletePedido, setMessageTypeFormDeletePedido] = useState("success");

    const titleFormDeletePedido = "Deletar Pedido";
    const textFormDeletePedido = `Tem certeza que deseja deletar o pedido #${String(pedido?.id).padStart(4, '0')} do cliente "${pedido?.clienteNome}"?`;

    const handleSubmitFormDeletePedido = async (event) => {
        event.preventDefault();
        setMessageFormDeletePedido("");

        try {
            await deletePedido(pedido.id);
            setMessageTypeFormDeletePedido("success");
            setMessageFormDeletePedido("Pedido deletado com sucesso!");

            if (onSuccess) onSuccess();
            setMessageFormDeletePedido("");
        } catch (error) {
            setMessageTypeFormDeletePedido("error");
            setMessageFormDeletePedido(error.message || "Erro ao deletar pedido.");
            setMessageFormDeletePedido("");
        }
    };

    return {
        titleFormDeletePedido,
        textFormDeletePedido,
        handleSubmitFormDeletePedido,
        messageFormDeletePedido,
        messageTypeFormDeletePedido
    };
};

import { useState, useEffect } from "react";
import { addPedido, updatePedidoStatus, deletePedido } from "../services/ordersService";
import { getProducts } from "../services/productsService";
import { getCustomers } from "../services/customerService";

const STATUS_OPTIONS = {"Pendente": "Pendente", "Em Preparo": "Em Preparo", "Em Rota de Entrega": "Em Rota de Entrega", "Entregue": "Entregue"};

export const formAddPedido = ({ onSuccess, onVerificarMapeamento }) => {
    const [clienteId, setClienteId] = useState("");
    const [clienteNome, setClienteNome] = useState("");
    const [observacoes, setObservacoes] = useState("");
    const [produtos, setProdutos] = useState([{ produtoId: "", quantidade: 1, precoUnitario: 0 }]);
    const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
    const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
    const [messageFormAddPedido, setMessageFormAddPedido] = useState("");
    const [messageTypeFormAddPedido, setMessageTypeFormAddPedido] = useState("success");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [produtosData, clientesData] = await Promise.all([
                    getProducts(),
                    getCustomers()
                ]);
                setProdutosDisponiveis(produtosData || []);
                setClientesDisponiveis(clientesData || []);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        };
        loadData();
    }, []);

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
            const pedidoData = {
                clienteId: clienteId ? parseInt(clienteId) : null,
                clienteNome: clienteNome,
                observacoes: observacoes,
                produtos: produtosValidos.map(p => ({
                    produtoId: parseInt(p.produtoId),
                    quantidade: parseInt(p.quantidade),
                    precoUnitario: parseFloat(p.precoUnitario)
                })),
                darBaixaEstoque: true
            };

            if (onVerificarMapeamento) {
                await onVerificarMapeamento(pedidoData);

                setClienteId("");
                setClienteNome("");
                setObservacoes("");
                setProdutos([{ produtoId: "", quantidade: 1, precoUnitario: 0 }]);
            } else {
                await addPedido(pedidoData);
                setMessageTypeFormAddPedido("success");
                setMessageFormAddPedido("Pedido criado com sucesso!");

                setClienteId("");
                setClienteNome("");
                setObservacoes("");
                setProdutos([{ produtoId: "", quantidade: 1, precoUnitario: 0 }]);

                if (onSuccess) onSuccess();
            }
        } catch (error) {
            setMessageTypeFormAddPedido("error");
            setMessageFormAddPedido(error.message || "Erro ao criar pedido.");
        }
    };

    return {
        titleFormAddPedido,
        fieldsFormAddPedido,
        handleSubmitFormAddPedido,
        messageFormAddPedido,
        messageTypeFormAddPedido
    };
};

export const formEditStatus = ({ pedido, onSuccess }) => {
    const [status, setStatus] = useState(pedido?.status || "Pendente");
    const [messageFormEditStatus, setMessageFormEditStatus] = useState("");
    const [messageTypeFormEditStatus, setMessageTypeFormEditStatus] = useState("success");
    const [clienteNome, setClienteNome] = useState("");

    useEffect(() => {
        const loadClienteNome = async () => {
            if (pedido?.clienteId) {
                try {
                    const clientes = await getCustomers();
                    const cliente = clientes.find(c => c.id === pedido.clienteId);
                    if (cliente) {
                        setClienteNome(cliente.nome);
                    }
                } catch (error) {
                    console.error("Erro ao buscar nome do cliente:", error);
                }
            }
        }
        loadClienteNome();
    }, [pedido]);

    const titleFormEditStatus = "Atualizar Status do Pedido";

    const fieldsFormEditStatus = [
        {
            id: "pedidoNumero",
            label: "Pedido",
            value: `#${String(pedido?.id).padStart(4, '0')}`,
            disabled: true
        },
        {
            id: "cliente",
            label: "Cliente",
            value: clienteNome || "",
            disabled: true
        },
        {
            id: "status",
            label: "Status",
            type: "select",
            value: status,
            onChange: setStatus,
            options: Object.values(STATUS_OPTIONS).map(s => ({ value: s, label: s })),
            required: true
        }
    ];

    const handleSubmitFormEditStatus = async (event) => {
        event.preventDefault();
        setMessageFormEditStatus("");

        try {
            await updatePedidoStatus(pedido.id, status);
            setMessageTypeFormEditStatus("success");
            setMessageFormEditStatus("Status atualizado com sucesso!");

            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormEditStatus("error");
            setMessageFormEditStatus(error.message || "Erro ao atualizar status.");
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

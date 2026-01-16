using api.DTOs;
using api.Models;

namespace api.Interfaces
{
    public interface IPedidosServico
    {
        Task<IEnumerable<PedidosDTO>> ObterTodosPedidos();
        Task<PedidosDTO> ObterPedidoPorId(int id);
        Task<Pedidos> AdicionarPedido(CriarPedidoDTO pedidoDTO);
        Task<bool> AtualizarStatusPedido(int id, string status);
        Task<bool> DeletarPedido(int id);
        Task<VerificarMapeamentoDTO> VerificarMapeamentoProdutos(List<PedidoProdutoDTO> produtos);
        Task<bool> DarBaixaEstoque(int pedidoId);
    }
}

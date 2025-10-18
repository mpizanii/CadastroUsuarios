using api.DTOs;
using api.Models;

namespace api.Interfaces
{
    public interface IClientesServico
    {
        Task<IEnumerable<ClientesDTO>> ObterTodosClientesPorUsuario(Guid userId);
        Task<ClientesDTO> ObterPorId(int id);
        Task<Cliente> AdicionarCliente(Cliente cliente);
        Task<bool> EditarCliente(int id, ClientesDTO dto);
        Task<bool> DeletarCliente(int id);
    }
}
using api.DTOs;
using api.Models;

namespace api.Interfaces
{
    public interface IInsumosServico
    {
        Task<IEnumerable<InsumosDTO>> ObterTodosInsumos();
        Task<InsumosDTO> ObterInsumoPorId(int id);
        Task<Insumos> AdicionarInsumo(Insumos insumo);
        Task<bool> EditarInsumo(int id, InsumosDTO insumoDTO);
        Task<bool> DeletarInsumo(int id);
    }
}

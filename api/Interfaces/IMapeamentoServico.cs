using api.DTOs;

namespace api.Interfaces
{
    public interface IMapeamentoServico
    {
        Task<bool> MapearIngrediente(MapearIngredienteDTO mapearDTO);
        Task<bool> RemoverMapeamento(int ingredienteId);
    }
}

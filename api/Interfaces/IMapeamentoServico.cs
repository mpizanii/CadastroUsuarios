using api.DTOs;

namespace api.Interfaces
{
    public interface IMapeamentoServico
    {
        Task<IEnumerable<IngredienteComMapeamentoDTO>> ObterIngredientesComMapeamento(int receitaId);
        Task<bool> MapearIngrediente(MapearIngredienteDTO mapearDTO);
        Task<bool> RemoverMapeamento(int ingredienteId);
    }
}

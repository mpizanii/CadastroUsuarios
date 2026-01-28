using api.Data;
using api.DTOs;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Servicos
{
    public class MapeamentoServico : IMapeamentoServico
    {
        private readonly AppDbContext _context;

        public MapeamentoServico(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> MapearIngrediente(MapearIngredienteDTO mapearDTO)
        {
            var mapeamentoExistente = await _context.IngredientesInsumo
                .FirstOrDefaultAsync(ii => ii.IngredienteId == mapearDTO.IngredienteId);

            if (mapeamentoExistente != null)
            {
                mapeamentoExistente.InsumoId = mapearDTO.InsumoId;
                mapeamentoExistente.FatorConversao = mapearDTO.FatorConversao;
            }
            else
            {
                var novoMapeamento = new IngredientesInsumo
                {
                    IngredienteId = mapearDTO.IngredienteId,
                    InsumoId = mapearDTO.InsumoId,
                    FatorConversao = mapearDTO.FatorConversao
                };
                _context.IngredientesInsumo.Add(novoMapeamento);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoverMapeamento(int ingredienteId)
        {
            var mapeamento = await _context.IngredientesInsumo
                .FirstOrDefaultAsync(ii => ii.IngredienteId == ingredienteId);

            if (mapeamento == null) return false;

            _context.IngredientesInsumo.Remove(mapeamento);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

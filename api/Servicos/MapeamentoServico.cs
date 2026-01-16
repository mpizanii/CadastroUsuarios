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

        public async Task<IEnumerable<IngredienteComMapeamentoDTO>> ObterIngredientesComMapeamento(int receitaId)
        {
            // Buscar todos os ingredientes da receita
            var ingredientes = await _context.ReceitaIngredientes
                .Where(ri => ri.ReceitaId == receitaId)
                .ToListAsync();

            var resultado = new List<IngredienteComMapeamentoDTO>();

            foreach (var ingrediente in ingredientes)
            {
                // Buscar mapeamento se existir
                var mapeamento = await _context.IngredientesInsumo
                    .FirstOrDefaultAsync(ii => ii.IngredienteId == ingrediente.Id);

                string insumoNome = null;
                if (mapeamento != null)
                {
                    var insumo = await _context.Insumos
                        .FirstOrDefaultAsync(i => i.Id == mapeamento.InsumoId);
                    insumoNome = insumo?.Nome;
                }

                resultado.Add(new IngredienteComMapeamentoDTO
                {
                    Id = ingrediente.Id,
                    Nome = ingrediente.Nome,
                    Quantidade = ingrediente.Quantidade,
                    Unidade = ingrediente.Unidade,
                    Mapeado = mapeamento != null,
                    InsumoId = mapeamento?.InsumoId,
                    InsumoNome = insumoNome,
                    FatorConversao = mapeamento?.FatorConversao
                });
            }

            return resultado;
        }

        public async Task<bool> MapearIngrediente(MapearIngredienteDTO mapearDTO)
        {
            // Verificar se já existe mapeamento
            var mapeamentoExistente = await _context.IngredientesInsumo
                .FirstOrDefaultAsync(ii => ii.IngredienteId == mapearDTO.IngredienteId);

            if (mapeamentoExistente != null)
            {
                // Atualizar mapeamento existente
                mapeamentoExistente.InsumoId = mapearDTO.InsumoId;
                mapeamentoExistente.FatorConversao = mapearDTO.FatorConversao;
            }
            else
            {
                // Criar novo mapeamento
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

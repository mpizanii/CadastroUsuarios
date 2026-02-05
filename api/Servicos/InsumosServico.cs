using api.Data;
using api.DTOs;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Servicos
{
    public class InsumosServico : IInsumosServico
    {
        private readonly AppDbContext _context;

        public InsumosServico(AppDbContext context)
        {
            _context = context;
        }

        private string CalcularStatusEstoque(double quantidade, double estoqueMinimo, DateTime? validade)
        {
            var hoje = DateTime.UtcNow;
            var umaSemana = hoje.AddDays(7);
            
            if (quantidade < estoqueMinimo)
                return "Crítico Estoque Mínimo";
            
            if (validade.HasValue && validade.Value <= hoje)
                return "Crítico Validade";
            
            var margemEstoque = estoqueMinimo * 1.2;
            if (quantidade <= margemEstoque)
                return "Baixo Estoque Mínimo";
            
            if (validade.HasValue && validade.Value <= umaSemana)
                return "Baixo Validade";
            
            return "OK";
        }

        public async Task<IEnumerable<InsumosDTO>> ObterTodosInsumos()
        {
            var insumos = await _context.Insumos.ToListAsync();
            
            return insumos.Select(i => new InsumosDTO
            {
                Id = i.Id,
                Nome = i.Nome,
                Quantidade = i.Quantidade,
                Unidade = i.Unidade,
                Validade = i.Validade,
                EstoqueMinimo = i.EstoqueMinimo,
                Status = i.Status,
                StatusEstoque = CalcularStatusEstoque(i.Quantidade, i.EstoqueMinimo, i.Validade)
            }).ToList();
        }

        public async Task<InsumosDTO> ObterInsumoPorId(int id)
        {
            var insumo = await _context.Insumos.FindAsync(id);
            
            if (insumo == null)
                return null;
            
            return new InsumosDTO
            {
                Id = insumo.Id,
                Nome = insumo.Nome,
                Quantidade = insumo.Quantidade,
                Unidade = insumo.Unidade,
                Validade = insumo.Validade,
                EstoqueMinimo = insumo.EstoqueMinimo,
                Status = insumo.Status,
                StatusEstoque = CalcularStatusEstoque(insumo.Quantidade, insumo.EstoqueMinimo, insumo.Validade)
            };
        }

        public async Task<Insumos> AdicionarInsumo(Insumos insumo)
        {
            insumo.CreatedAt = DateTime.UtcNow;
            _context.Insumos.Add(insumo);
            await _context.SaveChangesAsync();
            return insumo;
        }

        public async Task<bool> EditarInsumo(int id, InsumosDTO insumoDTO)
        {
            var insumo = await _context.Insumos.FindAsync(id);
            if (insumo == null) return false;

            if (insumoDTO.RemoveMapping)
            {
                var mapeamentos = await _context.IngredientesInsumo
                    .Where(ii => ii.InsumoId == id)
                    .ToListAsync();
                
                if (mapeamentos.Any())
                {
                    _context.IngredientesInsumo.RemoveRange(mapeamentos);
                }
            }

            if (!string.IsNullOrWhiteSpace(insumoDTO.Nome))
                insumo.Nome = insumoDTO.Nome;

            if (insumoDTO.Quantidade >= 0)
                insumo.Quantidade = insumoDTO.Quantidade;

            if (!string.IsNullOrWhiteSpace(insumoDTO.Unidade))
                insumo.Unidade = insumoDTO.Unidade;

            if (insumoDTO.Validade.HasValue)
                insumo.Validade = insumoDTO.Validade;

            if (insumoDTO.EstoqueMinimo >= 0)
                insumo.EstoqueMinimo = insumoDTO.EstoqueMinimo;

            if (!string.IsNullOrWhiteSpace(insumoDTO.Status))
                insumo.Status = insumoDTO.Status;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletarInsumo(int id)
        {
            var insumo = await _context.Insumos.FindAsync(id);
            if (insumo == null) return false;

            _context.Insumos.Remove(insumo);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<InsumosDTO>> ObterInsumosComAlertas()
        {
            var insumos = await ObterTodosInsumos();
            return insumos.Where(i => i.StatusEstoque == "Baixo Estoque Mínimo" || i.StatusEstoque == "Crítico Estoque Mínimo" || i.StatusEstoque == "Baixo Validade" || i.StatusEstoque == "Crítico Validade").ToList();
        }
    }
}

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

        public async Task<IEnumerable<InsumosDTO>> ObterTodosInsumos()
        {
            return await _context.Insumos
                .Select(i => new InsumosDTO
                {
                    Id = i.Id,
                    Nome = i.Nome,
                    Quantidade = i.Quantidade,
                    Unidade = i.Unidade,
                    Validade = i.Validade,
                    EstoqueMinimo = i.EstoqueMinimo,
                    Status = i.Status
                }).ToListAsync();
        }

        public async Task<InsumosDTO> ObterInsumoPorId(int id)
        {
            var insumo = await _context.Insumos
                .Where(i => i.Id == id)
                .Select(i => new InsumosDTO
                {
                    Id = i.Id,
                    Nome = i.Nome,
                    Quantidade = i.Quantidade,
                    Unidade = i.Unidade,
                    Validade = i.Validade,
                    EstoqueMinimo = i.EstoqueMinimo,
                    Status = i.Status
                }).FirstOrDefaultAsync();

            return insumo;
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
    }
}

using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;
using api.Interfaces;

namespace api.Servicos
{
    public class ReceitasServico : IReceitasServico
    {
        private readonly AppDbContext _context;

        public ReceitasServico(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Receitas> AdicionarReceita(ReceitasDTO receita)
        {
            if (receita == null) throw new ArgumentNullException(nameof(receita));

            var receitaModel = new Receitas
            {
                Nome = receita.Nome,
                Modo_Preparo = receita.Modo_Preparo,
                Created_At = DateTime.UtcNow
            };

            _context.Receitas.Add(receitaModel);
            await _context.SaveChangesAsync();

            if (receita.Ingredientes != null && receita.Ingredientes.Count > 0)
            {
                await AdicionarIngredientes(receita.Ingredientes, receitaModel.Id);
            }

            return receitaModel;
        }

        private async Task AdicionarIngredientes(List<IngredienteDTO> ingredientes, int receitaId)
        {
            if (ingredientes == null || ingredientes.Count == 0) return;

            foreach (var ingredienteDto in ingredientes)
            {
                var ingrediente = new ReceitaIngredientes
                {
                    ReceitaId = receitaId,
                    Nome = ingredienteDto.Nome,
                    Quantidade = ingredienteDto.Quantidade,
                    Unidade = ingredienteDto.Unidade
                };

                _context.ReceitaIngredientes.Add(ingrediente);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<Receitas?> ObterPorId(int id)
        {
            return await _context.Receitas
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<Receitas?>> ObterReceitas()
        {
            return await _context.Receitas
                .ToListAsync();
        }

        public async Task<List<ReceitaIngredientes>?> ObterIngredientesReceita(int receitaId)
        {
            return await _context.ReceitaIngredientes
                .Where(i => i.ReceitaId == receitaId)
                .ToListAsync();
        }

        public async Task<bool> DeletarReceita(int id)
        {
            var receita = await _context.Receitas.FindAsync(id);
            if (receita == null) return false;

            var ingredientes = await _context.ReceitaIngredientes
                .Where(i => i.ReceitaId == id)
                .ToListAsync();

            foreach (var ingrediente in ingredientes)
            {
                _context.ReceitaIngredientes.Remove(ingrediente);
            }

            _context.Receitas.Remove(receita);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
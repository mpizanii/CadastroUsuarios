using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Data;
using api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace api.Servicos
{
    public class ProdutosServico : IProdutosServico
    {
        private readonly AppDbContext _context;
        public ProdutosServico(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProdutosDTO>> ObterTodosProdutos()
        {
            return await _context.Produtos
                .Select(p => new ProdutosDTO
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Preco = p.Preco,
                    Custo = p.Preco,
                }).ToListAsync();
        }
    }
}
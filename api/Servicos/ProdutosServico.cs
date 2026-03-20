using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using api.Data;
using api.DTOs;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Servicos
{
    public class ProdutosServico : IProdutosServico
    {
        private readonly AppDbContext _context;
        private readonly IReceitasServico _receitasServico;

        public ProdutosServico(AppDbContext context, IReceitasServico receitasServico)
        {
            _context = context;
            _receitasServico = receitasServico;
        }

        public async Task<IEnumerable<ProdutosDTO>> ObterTodosProdutos()
        {
            return await _context.Produtos
                .Select(p => new ProdutosDTO
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Preco = p.Preco,
                    Custo = p.Custo,
                    Ativo = p.Ativo,
                    Receita_Id = p.Receita_id,
                }).ToListAsync();
        }

        public async Task<ProdutosDTO> ObterProdutoPorId(int id)
        {
            var produto = await _context.Produtos
                .Where(p => p.Id == id)
                .Select(p => new ProdutosDTO
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Preco = p.Preco,
                    Custo = p.Custo,
                    Ativo = p.Ativo,
                    Receita_Id = p.Receita_id,
                }).FirstOrDefaultAsync();

            return produto;
        }

        public async Task<Produtos> AdicionarProduto(Produtos produto)
        {
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();
            return produto;
        }

        public async Task<bool> EditarProduto(int id, ProdutosDTO produtoDTO)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return false;

            if (string.IsNullOrWhiteSpace(produtoDTO.Nome))
            {
                throw new ArgumentException("Nome do produto não pode ser vazio.");
            }

            if (produtoDTO.Preco < 0)
            {
                throw new ArgumentException("Preço não pode ser negativo.");
            }

            if (produtoDTO.Custo < 0)
            {
                throw new ArgumentException("Custo não pode ser negativo.");
            }

            produto.Nome = produtoDTO.Nome;
            produto.Preco = produtoDTO.Preco;
            produto.Custo = produtoDTO.Custo;
            produto.Ativo = produtoDTO.Ativo;

            await _context.SaveChangesAsync();
            return true;
        }
        
        public async Task<bool> DeletarProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return false;

            await _receitasServico.DeletarReceita(produto.Receita_id);

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
            return true;
        }  
    }
}
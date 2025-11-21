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

            if (!string.IsNullOrWhiteSpace(produtoDTO.Nome) && produtoDTO.Nome != "string")
                produto.Nome = produtoDTO.Nome;

            if (produtoDTO.Preco != 0)
                produto.Preco = produtoDTO.Preco;

            if (produtoDTO.Custo != 0)
                produto.Custo = produtoDTO.Custo;

            if (produtoDTO.Ativo != true)
                produto.Ativo = produtoDTO.Ativo;
            
            if (produtoDTO.Receita_Id != 0)
                produto.Receita_id = produtoDTO.Receita_Id;

            await _context.SaveChangesAsync();
            return true;
        }
        
        public async Task<bool> DeletarProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null) return false;

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
            return true;
        }  
    }
}
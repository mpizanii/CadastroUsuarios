using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;

namespace api.Interfaces
{
    public interface IProdutosServico
    {
        Task<IEnumerable<ProdutosDTO>> ObterTodosProdutos();
        Task<ProdutosDTO> ObterProdutoPorId(int id);
        Task<Produtos> AdicionarProduto(Produtos produto);
        Task<bool> EditarProduto(int id, ProdutosDTO produtoDto);
        Task<bool> DeletarProduto(int id);
    }
}
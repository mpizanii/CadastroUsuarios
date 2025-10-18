using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;

namespace api.Interfaces
{
    public interface IProdutosServico
    {
        Task<IEnumerable<ProdutosDTO>> ObterTodosProdutos();
    }
}
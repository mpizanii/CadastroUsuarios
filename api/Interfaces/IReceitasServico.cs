using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Interfaces
{
    public interface IReceitasServico
    {
        Task<Receitas> AdicionarReceita(ReceitasDTO receita);
        Task<Receitas?> ObterPorId(int id);
        Task<List<Receitas?>> ObterReceitas();
    }
}
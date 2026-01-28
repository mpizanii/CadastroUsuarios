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
        Task<Receitas> AdicionarReceita(CriarReceitasDTO receita);
        Task<ReceitasComMapeamentoDTO?> ObterReceitaComMapeamento(int id);
        Task<List<Receitas?>> ObterReceitas();
        Task<List<ReceitaIngredientes>?> ObterIngredientesReceita(int receitaId);
        Task<bool> DeletarReceita(int id);
    }
}
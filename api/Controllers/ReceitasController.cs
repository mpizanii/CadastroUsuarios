using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Models;
using api.Interfaces;
using api.Servicos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReceitasController : ControllerBase
    {
        private readonly IReceitasServico _receitasServico;

        public ReceitasController(IReceitasServico receitasServico)
        {
            _receitasServico = receitasServico;
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarReceita(ReceitasDTO receita)
        {
            var novaReceita = await _receitasServico.AdicionarReceita(receita);
            return CreatedAtAction(nameof(ObterPorId), new { id = novaReceita.Id }, novaReceita);
        }

        [HttpGet]
        public async Task<IActionResult> ObterReceitas()
        {
            var receita = await _receitasServico.ObterReceitas();
            return Ok(receita);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var receita = await _receitasServico.ObterPorId(id);
            if (receita == null)
            {
                return NotFound();
            }
            return Ok(receita);
        }
    }
}
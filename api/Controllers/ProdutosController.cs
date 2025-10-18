using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly IProdutosServico _produtosServico;
        public ProdutosController(IProdutosServico produtosServico)
        {
            _produtosServico = produtosServico;
        }

        [HttpGet]
        public async Task<IActionResult> ObterTodosProdutos()
        {
            try
            {
                var produtos = await _produtosServico.ObterTodosProdutos();
                return Ok(produtos);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao obter produtos: " + ex.Message);
                return StatusCode(500, "Erro interno do servidor");
            }
        }
    }
}
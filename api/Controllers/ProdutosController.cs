using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using api.DTOs;
using api.Models;

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

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterProdutoPorId(int id)
        {
            try
            {
                var produto = await _produtosServico.ObterProdutoPorId(id);
                if (produto == null)
                {
                    return NotFound();
                }
                return Ok(produto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao obter produto: " + ex.Message);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpGet("receita/{receitaId}")]
        public async Task<IActionResult> ObterProdutoPorReceitaId(int receitaId)
        {
            try
            {
                var produto = await _produtosServico.ObterProdutoPorReceitaId(receitaId);
                if (produto == null)
                {
                    return NotFound();
                }
                return Ok(produto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao obter produto: " + ex.Message);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarProduto([FromBody] Produtos produto)
        {
            try
            {
                var novoProduto = await _produtosServico.AdicionarProduto(produto);
                return CreatedAtAction(nameof(ObterProdutoPorId), new { id = novoProduto.Id }, novoProduto);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao adicionar produto: " + ex.Message);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditarProduto(int id, [FromBody] ProdutosDTO produtoDto)
        {
            try
            {
                if (id != produtoDto.Id)
                {
                    return BadRequest("ID do produto inválido");
                }

                var sucesso = await _produtosServico.EditarProduto(id, produtoDto);
                if (!sucesso)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao editar produto: " + ex.Message);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarProduto(int id)
        {
            try
            {
                var sucesso = await _produtosServico.DeletarProduto(id);
                if (!sucesso)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erro ao deletar produto: " + ex.Message);
                return StatusCode(500, "Erro interno do servidor");
            }
        }
    }
}
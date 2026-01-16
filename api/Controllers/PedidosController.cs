using api.DTOs;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidosServico _pedidosServico;

        public PedidosController(IPedidosServico pedidosServico)
        {
            _pedidosServico = pedidosServico;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidosDTO>>> GetPedidos()
        {
            var pedidos = await _pedidosServico.ObterTodosPedidos();
            return Ok(pedidos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PedidosDTO>> GetPedido(int id)
        {
            var pedido = await _pedidosServico.ObterPedidoPorId(id);
            if (pedido == null)
                return NotFound();
            return Ok(pedido);
        }

        [HttpPost]
        public async Task<ActionResult<Pedidos>> PostPedido(CriarPedidoDTO pedidoDTO)
        {
            var novoPedido = await _pedidosServico.AdicionarPedido(pedidoDTO);
            return CreatedAtAction(nameof(GetPedido), new { id = novoPedido.Id }, novoPedido);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> AtualizarStatus(int id, [FromBody] AtualizarStatusDTO statusDTO)
        {
            var sucesso = await _pedidosServico.AtualizarStatusPedido(id, statusDTO.Status);
            if (!sucesso)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            var sucesso = await _pedidosServico.DeletarPedido(id);
            if (!sucesso)
                return NotFound();
            return NoContent();
        }

        [HttpPost("verificar-mapeamento")]
        public async Task<ActionResult<VerificarMapeamentoDTO>> VerificarMapeamento([FromBody] List<PedidoProdutoDTO> produtos)
        {
            var resultado = await _pedidosServico.VerificarMapeamentoProdutos(produtos);
            return Ok(resultado);
        }

        [HttpPost("{id}/baixa-estoque")]
        public async Task<IActionResult> DarBaixaEstoque(int id)
        {
            var sucesso = await _pedidosServico.DarBaixaEstoque(id);
            if (!sucesso)
                return NotFound();
            return Ok(new { message = "Baixa no estoque realizada com sucesso" });
        }
    }

    public class AtualizarStatusDTO
    {
        public string Status { get; set; } = string.Empty;
    }
}

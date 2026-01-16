using api.DTOs;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InsumosController : ControllerBase
    {
        private readonly IInsumosServico _insumosServico;

        public InsumosController(IInsumosServico insumosServico)
        {
            _insumosServico = insumosServico;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InsumosDTO>>> GetInsumos()
        {
            var insumos = await _insumosServico.ObterTodosInsumos();
            return Ok(insumos);
        }

        [HttpGet("alertas")]
        public async Task<ActionResult<IEnumerable<InsumosDTO>>> GetInsumosComAlertas()
        {
            var insumos = await _insumosServico.ObterInsumosComAlertas();
            return Ok(insumos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InsumosDTO>> GetInsumo(int id)
        {
            var insumo = await _insumosServico.ObterInsumoPorId(id);
            if (insumo == null)
                return NotFound();
            return Ok(insumo);
        }

        [HttpPost]
        public async Task<ActionResult<Insumos>> PostInsumo(Insumos insumo)
        {
            var novoInsumo = await _insumosServico.AdicionarInsumo(insumo);
            return CreatedAtAction(nameof(GetInsumo), new { id = novoInsumo.Id }, novoInsumo);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchInsumo(int id, InsumosDTO insumoDTO)
        {
            var sucesso = await _insumosServico.EditarInsumo(id, insumoDTO);
            if (!sucesso)
                return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInsumo(int id)
        {
            var sucesso = await _insumosServico.DeletarInsumo(id);
            if (!sucesso)
                return NotFound();
            return NoContent();
        }
    }
}

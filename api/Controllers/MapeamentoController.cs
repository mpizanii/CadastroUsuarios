using api.DTOs;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapeamentoController : ControllerBase
    {
        private readonly IMapeamentoServico _mapeamentoServico;

        public MapeamentoController(IMapeamentoServico mapeamentoServico)
        {
            _mapeamentoServico = mapeamentoServico;
        }

        [HttpGet("receita/{receitaId}")]
        public async Task<ActionResult<IEnumerable<IngredienteComMapeamentoDTO>>> GetIngredientesComMapeamento(int receitaId)
        {
            var ingredientes = await _mapeamentoServico.ObterIngredientesComMapeamento(receitaId);
            return Ok(ingredientes);
        }

        [HttpPost]
        public async Task<IActionResult> MapearIngrediente(MapearIngredienteDTO mapearDTO)
        {
            var sucesso = await _mapeamentoServico.MapearIngrediente(mapearDTO);
            if (!sucesso)
                return BadRequest();
            return Ok(new { message = "Ingrediente mapeado com sucesso" });
        }

        [HttpDelete("{ingredienteId}")]
        public async Task<IActionResult> RemoverMapeamento(int ingredienteId)
        {
            var sucesso = await _mapeamentoServico.RemoverMapeamento(ingredienteId);
            if (!sucesso)
                return NotFound();
            return NoContent();
        }
    }
}

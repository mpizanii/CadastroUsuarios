using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Models;
using api.Servicos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly IClientesServico _clienteServico;

        public ClientesController(IClientesServico clienteServico)
        {
            _clienteServico = clienteServico;
        }

        [HttpGet("usuario/{userId}")]
        public async Task<IActionResult> ObterTodosClientesPorUsuario(Guid userId)
        {
            var clientes = await _clienteServico.ObterTodosClientesPorUsuario(userId);
            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var cliente = await _clienteServico.ObterPorId(id);
            if (cliente == null) return NotFound();

            return Ok(cliente);
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarCliente(Cliente cliente)
        {
            var novoCliente = await _clienteServico.AdicionarCliente(cliente);
            return CreatedAtAction(nameof(ObterPorId), new { id = novoCliente.Id }, novoCliente);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> EditarCliente(int id, [FromBody] ClientesDTO clienteDTO)
        {
            var sucesso = await _clienteServico.EditarCliente(id, clienteDTO);
            if (!sucesso) return NotFound();
            return Ok(clienteDTO);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarCliente(int id)
        {
            var sucesso = await _clienteServico.DeletarCliente(id);
            if (!sucesso) return NotFound();
            return Ok();
        }
    }
}
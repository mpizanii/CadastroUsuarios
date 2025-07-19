using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("usuario/{userId}")]
        public async Task<IActionResult> ObterTodosClientesPorUsuario(Guid userId)
        {
            var clientes = await _context.Clientes
            .Where(c => c.User_Id == userId)
            .Select(c => new ClientesDTO
            {
                Id = c.Id,
                Nome = c.Nome,
                Email = c.Email,
                Telefone = c.Telefone,
                Endereco = c.Endereco
            }).ToListAsync();

            return Ok(clientes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var cliente = await _context.Clientes
            .Where(c => c.Id == id)
            .Select(c => new ClientesDTO
            {
                Id = c.Id,
                Nome = c.Nome,
                Email = c.Email,
                Telefone = c.Telefone,
                Endereco = c.Endereco
            }).FirstOrDefaultAsync();

            if (cliente == null)
            {
                return NotFound();
            }

            return Ok(cliente);
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(ObterPorId), new { id = cliente.Id }, cliente);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> EditarCliente(int id, [FromBody] ClientesDTO clienteDTO)
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);

            if (cliente == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(clienteDTO.Nome) && clienteDTO.Nome != "string")
                cliente.Nome = clienteDTO.Nome;

            if (!string.IsNullOrWhiteSpace(clienteDTO.Email) && clienteDTO.Email != "string")
                cliente.Email = clienteDTO.Email;

            if (!string.IsNullOrWhiteSpace(clienteDTO.Telefone) && clienteDTO.Telefone != "string")
                cliente.Telefone = clienteDTO.Telefone;

            if (!string.IsNullOrWhiteSpace(clienteDTO.Endereco) && clienteDTO.Endereco != "string")
                cliente.Endereco = clienteDTO.Endereco;

            await _context.SaveChangesAsync();

            return Ok(clienteDTO);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletarCliente(int id)
        {
            var cliente = await _context.Clientes.FirstOrDefaultAsync(c => c.Id == id);

            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return Ok(cliente);
        }
    }
}
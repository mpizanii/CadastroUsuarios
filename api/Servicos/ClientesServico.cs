using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;
using api.Interfaces;

namespace api.Servicos
{
    public class ClientesServico : IClientesServico
    {
        private readonly AppDbContext _context;

        public ClientesServico(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ClientesDTO>> ObterTodosClientesPorUsuario(Guid userId)
        {
            return await _context.Clientes
                .Where(c => c.User_Id == userId)
                .Select(c => new ClientesDTO
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Email = c.Email,
                    Telefone = c.Telefone,
                    Endereco = c.Endereco
                }).ToListAsync();
        }

        public async Task<ClientesDTO> ObterPorId(int id)
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

            return cliente;
        }

        public async Task<Cliente> AdicionarCliente(Cliente cliente)
        {
            _context.Clientes.Add(cliente);
            await _context.SaveChangesAsync();
            return cliente;
        }

        public async Task<bool> EditarCliente(int id, ClientesDTO clienteDTO)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return false;

            if (!string.IsNullOrWhiteSpace(clienteDTO.Nome) && clienteDTO.Nome != "string")
                cliente.Nome = clienteDTO.Nome;

            if (!string.IsNullOrWhiteSpace(clienteDTO.Email) && clienteDTO.Email != "string")
                cliente.Email = clienteDTO.Email;

            if (!string.IsNullOrWhiteSpace(clienteDTO.Telefone) && clienteDTO.Telefone != "string")
                cliente.Telefone = clienteDTO.Telefone;

            if (!string.IsNullOrWhiteSpace(clienteDTO.Endereco) && clienteDTO.Endereco != "string")
                cliente.Endereco = clienteDTO.Endereco;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletarCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return false;

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();
            return true;
        }  
    }
}
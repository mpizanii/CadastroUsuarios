using api.Data;
using api.DTOs;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Servicos
{
    public class PedidosServico : IPedidosServico
    {
        private readonly AppDbContext _context;

        public PedidosServico(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PedidosDTO>> ObterTodosPedidos()
        {
            var pedidos = await _context.Pedidos
                .OrderByDescending(p => p.DataPedido)
                .ToListAsync();

            var pedidosDTO = new List<PedidosDTO>();

            foreach (var pedido in pedidos)
            {
                var clienteNome = await _context.Clientes
                    .Where(c => c.Id == pedido.ClienteId)
                    .Select(c => c.Nome)
                    .FirstOrDefaultAsync();

                var pedidoProdutos = await _context.PedidosProdutos
                    .Where(pp => pp.PedidoId == pedido.Id)
                    .ToListAsync();

                var produtosDTO = new List<PedidoProdutoDTO>();
                foreach (var pp in pedidoProdutos)
                {
                    var produto = await _context.Produtos.FindAsync(pp.ProdutoId);
                    produtosDTO.Add(new PedidoProdutoDTO
                    {
                        ProdutoId = pp.ProdutoId,
                        ProdutoNome = produto?.Nome ?? "Produto não encontrado",
                        Quantidade = pp.Quantidade,
                        PrecoUnitario = produto?.Preco ?? 0,
                    });
                }

                pedidosDTO.Add(new PedidosDTO
                {
                    Id = pedido.Id,
                    ClienteId = pedido.ClienteId,
                    ClienteNome = clienteNome,
                    DataPedido = pedido.DataPedido,
                    ValorTotal = pedido.ValorTotal,
                    Status = pedido.Status,
                    Observacoes = pedido.Observacoes,
                    Produtos = produtosDTO
                });
            }

            return pedidosDTO;
        }

        public async Task<PedidosDTO> ObterPedidoPorId(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null) return null;

            var clienteNome = await _context.Clientes
                .Where(c => c.Id == pedido.ClienteId)
                .Select(c => c.Nome)
                .FirstOrDefaultAsync();

            var pedidoProdutos = await _context.PedidosProdutos
                .Where(pp => pp.PedidoId == pedido.Id)
                .ToListAsync();

            var produtosDTO = new List<PedidoProdutoDTO>();
            foreach (var pp in pedidoProdutos)
            {
                var produto = await _context.Produtos.FindAsync(pp.ProdutoId);
                produtosDTO.Add(new PedidoProdutoDTO
                {
                    ProdutoId = pp.ProdutoId,
                    ProdutoNome = produto?.Nome ?? "Produto não encontrado",
                    Quantidade = pp.Quantidade,
                    PrecoUnitario = produto?.Preco ?? 0,
                });
            }

            return new PedidosDTO
            {
                Id = pedido.Id,
                ClienteId = pedido.ClienteId,
                ClienteNome = clienteNome,
                DataPedido = pedido.DataPedido,
                ValorTotal = pedido.ValorTotal,
                Status = pedido.Status,
                Observacoes = pedido.Observacoes,
                Produtos = produtosDTO
            };
        }

        public async Task<Pedidos> AdicionarPedido(CriarPedidoDTO pedidoDTO)
        {
            var pedido = new Pedidos
            {
                ClienteId = pedidoDTO.ClienteId,
                DataPedido = DateTime.UtcNow,
                ValorTotal = pedidoDTO.Produtos.Sum(p => p.PrecoUnitario * p.Quantidade),
                Status = "Pendente",
                Observacoes = pedidoDTO.Observacoes,
            };

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            // Adicionar produtos do pedido
            foreach (var produtoDTO in pedidoDTO.Produtos)
            {
                var pedidoProduto = new PedidosProdutos
                {
                    PedidoId = pedido.Id,
                    ProdutoId = produtoDTO.ProdutoId,
                    Quantidade = produtoDTO.Quantidade,
                };
                _context.PedidosProdutos.Add(pedidoProduto);
            }

            await _context.SaveChangesAsync();

            // Dar baixa no estoque se solicitado
            if (pedidoDTO.DarBaixaEstoque)
            {
                await DarBaixaEstoque(pedido.Id);
            }

            return pedido;
        }

        public async Task<bool> AtualizarStatusPedido(int id, string status)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null) return false;

            pedido.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletarPedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null) return false;

            // Deletar produtos do pedido
            var pedidoProdutos = await _context.PedidosProdutos
                .Where(pp => pp.PedidoId == id)
                .ToListAsync();
            _context.PedidosProdutos.RemoveRange(pedidoProdutos);

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<VerificarMapeamentoDTO> VerificarMapeamentoProdutos(List<PedidoProdutoDTO> produtos)
        {
            var resultado = new VerificarMapeamentoDTO
            {
                TodosMapeados = true,
                IngredientesNaoMapeados = new List<IngredienteNaoMapeadoDTO>()
            };

            foreach (var produtoDTO in produtos)
            {
                var produto = await _context.Produtos.FindAsync(produtoDTO.ProdutoId);
                if (produto == null || produto.Receita_id == null) continue;

                var ingredientes = await _context.ReceitaIngredientes
                    .Where(ri => ri.ReceitaId == produto.Receita_id)
                    .ToListAsync();

                foreach (var ingrediente in ingredientes)
                {
                    var mapeamento = await _context.IngredientesInsumo
                        .FirstOrDefaultAsync(ii => ii.IngredienteId == ingrediente.Id);

                    if (mapeamento == null)
                    {
                        resultado.TodosMapeados = false;
                        resultado.IngredientesNaoMapeados.Add(new IngredienteNaoMapeadoDTO
                        {
                            IngredienteId = ingrediente.Id,
                            IngredienteNome = ingrediente.Nome,
                            ProdutoNome = produto.Nome,
                            ReceitaId = produto.Receita_id.Value
                        });
                    }
                }
            }

            return resultado;
        }

        public async Task<bool> DarBaixaEstoque(int pedidoId)
        {
            var pedidoProdutos = await _context.PedidosProdutos
                .Where(pp => pp.PedidoId == pedidoId)
                .ToListAsync();

            foreach (var pedidoProduto in pedidoProdutos)
            {
                var produto = await _context.Produtos.FindAsync(pedidoProduto.ProdutoId);
                if (produto == null || produto.Receita_id == 0) continue;

                var ingredientes = await _context.ReceitaIngredientes
                    .Where(ri => ri.ReceitaId == produto.Receita_id)
                    .ToListAsync();

                foreach (var ingrediente in ingredientes)
                {
                    var mapeamento = await _context.IngredientesInsumo
                        .FirstOrDefaultAsync(ii => ii.IngredienteId == ingrediente.Id);

                    if (mapeamento != null)
                    {
                        var insumo = await _context.Insumos.FindAsync(mapeamento.InsumoId);
                        if (insumo != null)
                        {
                            // Calcular quantidade a descontar considerando o fator de conversão e a quantidade do pedido
                            var quantidadeDescontar = ingrediente.Quantidade * mapeamento.FatorConversao * pedidoProduto.Quantidade;
                            insumo.Quantidade -= quantidadeDescontar;

                            // Evitar quantidade negativa
                            if (insumo.Quantidade < 0) insumo.Quantidade = 0;
                        }
                    }
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<VerificarEstoqueDTO> VerificarEstoquePedido(List<PedidoProdutoDTO> produtos)
        {
            var resultado = new VerificarEstoqueDTO
            {
                TemAvisos = false,
                Avisos = new List<AvisoEstoqueDTO>()
            };

            foreach (var produtoDTO in produtos)
            {
                var produto = await _context.Produtos.FindAsync(produtoDTO.ProdutoId);
                if (produto == null) continue;

                var ingredientes = await _context.ReceitaIngredientes
                    .Where(ri => ri.ReceitaId == produto.Receita_id)
                    .ToListAsync();

                foreach (var ingrediente in ingredientes)
                {
                    var mapeamento = await _context.IngredientesInsumo
                        .FirstOrDefaultAsync(ii => ii.IngredienteId == ingrediente.Id);

                    if (mapeamento != null)
                    {
                        var insumo = await _context.Insumos.FindAsync(mapeamento.InsumoId);
                        if (insumo != null)
                        {
                            var quantidadeNecessaria = ingrediente.Quantidade * mapeamento.FatorConversao * produtoDTO.Quantidade;
                            var quantidadeRestante = insumo.Quantidade - quantidadeNecessaria;

                            if (quantidadeRestante < 0)
                            {
                                resultado.TemAvisos = true;
                                resultado.Avisos.Add(new AvisoEstoqueDTO
                                {
                                    Tipo = "CRITICO",
                                    Mensagem = $"Estoque insuficiente para o insumo {insumo.Nome} necessário para o produto {produto.Nome}.",
                                    InsumoNome = insumo.Nome,
                                    QuantidadeAtual = insumo.Quantidade,
                                    QuantidadeNecessaria = quantidadeNecessaria,
                                    QuantidadeFaltante = quantidadeNecessaria - insumo.Quantidade,
                                    ProdutoNome = produto.Nome
                                });
                            }

                            else if (quantidadeRestante < (insumo.Quantidade * 0.1) || quantidadeRestante < 10)
                            {
                                resultado.TemAvisos = true;
                                resultado.Avisos.Add(new AvisoEstoqueDTO
                                {
                                    Tipo = "ALERTA",
                                    Mensagem = $"Estoque de {insumo.Nome} ficará crítico após este pedido",
                                    InsumoNome = insumo.Nome,
                                    QuantidadeAtual = insumo.Quantidade,
                                    QuantidadeNecessaria = quantidadeNecessaria,
                                    QuantidadeFaltante = 0,
                                    ProdutoNome = produto.Nome
                                });
                            }

                            else if (quantidadeRestante < (insumo.Quantidade * 0.3))
                            {
                                resultado.TemAvisos = true;
                                resultado.Avisos.Add(new AvisoEstoqueDTO
                                {
                                    Tipo = "INFO",
                                    Mensagem = $"Estoque de {insumo.Nome} ficará baixo após este pedido",
                                    InsumoNome = insumo.Nome,
                                    QuantidadeAtual = insumo.Quantidade,
                                    QuantidadeNecessaria = quantidadeNecessaria,
                                    QuantidadeFaltante = 0,
                                    ProdutoNome = produto.Nome
                                });
                            }
                        }
                    }
                }
            }

            return resultado;
        }
    }
}

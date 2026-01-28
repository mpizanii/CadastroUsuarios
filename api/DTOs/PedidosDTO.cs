using System;
using System.Collections.Generic;

namespace api.DTOs
{
    public class PedidosDTO
    {
        public int Id { get; set; }
        public int? ClienteId { get; set; }
        public string? ClienteNome { get; set; }
        public DateTime DataPedido { get; set; }
        public double ValorTotal { get; set; }
        public string Status { get; set; } = "Pendente";
        public string? Observacoes { get; set; }
        public List<PedidoProdutoDTO> Produtos { get; set; } = new();
    }

    public class PedidoProdutoDTO
    {
        public int ProdutoId { get; set; }
        public string ProdutoNome { get; set; } = string.Empty;
        public int Quantidade { get; set; }
        public double PrecoUnitario { get; set; } = 0;
    }

    public class CriarPedidoDTO
    {
        public int? ClienteId { get; set; }
        public string? Observacoes { get; set; }
        public List<PedidoProdutoDTO> Produtos { get; set; } = new();
        public bool DarBaixaEstoque { get; set; } = true;
    }

    public class VerificarMapeamentoDTO
    {
        public bool TodosMapeados { get; set; }
        public List<IngredienteNaoMapeadoDTO> IngredientesNaoMapeados { get; set; } = new();
    }

    public class IngredienteNaoMapeadoDTO
    {
        public int IngredienteId { get; set; }
        public string IngredienteNome { get; set; } = string.Empty;
        public string ProdutoNome { get; set; } = string.Empty;
        public int ReceitaId { get; set; }
    }

    public class VerificarEstoqueDTO
    {
        public bool TemAvisos { get; set; }
        public List<AvisoEstoqueDTO> Avisos { get; set; } = new();
    }

    public class AvisoEstoqueDTO
    {
        public string Tipo { get; set; } // "Crítico", "Alerta", "Info"
        public string Mensagem { get; set; }
        public string InsumoNome { get; set; } = string.Empty;
        public double QuantidadeAtual { get; set; }
        public double QuantidadeNecessaria { get; set; }
        public double QuantidadeFaltante { get; set; }
        public string ProdutoNome { get; set; } = string.Empty;
    }
}

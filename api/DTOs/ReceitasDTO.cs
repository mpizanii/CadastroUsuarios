using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.DTOs
{
    public class CriarReceitasDTO
    {
        public string Nome { get; set; } = string.Empty;
        public List<CriarIngredienteDTO> Ingredientes { get; set; } = new();
        public string Modo_Preparo { get; set; } = string.Empty;
    }

    public class CriarIngredienteDTO
    {
        public string Nome { get; set; } = string.Empty;
        public double Quantidade { get; set; }
        public string Unidade { get; set; } = string.Empty;
    }

    public class ReceitasComMapeamentoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Modo_Preparo { get; set; } = string.Empty;
        public DateTime Created_At { get; set; }
        public List<IngredienteComMapeamentoDTO> Ingredientes { get; set; } = new();
    }

    public class IngredienteComMapeamentoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public double Quantidade { get; set; } = 0;
        public string Unidade { get; set; } = string.Empty;
        public bool Mapeado { get; set; } = false;
        public int? InsumoId { get; set; }
        public string? InsumoNome { get; set; }
        public double? FatorConversao { get; set; }
    }
}
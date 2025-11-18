using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.DTOs
{
    public class ReceitasDTO
    {
        public string Nome { get; set; } = string.Empty;
        public List<IngredienteDTO> Ingredientes { get; set; } = new();
        public string Modo_Preparo { get; set; } = string.Empty;
    }

    public class IngredienteDTO
    {
        public string Nome { get; set; } = string.Empty;
        public double Quantidade { get; set; }
        public string Unidade { get; set; } = string.Empty;
    }
}
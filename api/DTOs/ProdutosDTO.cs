using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs
{
    public class ProdutosDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public double Preco { get; set; } = 0;
        public double Custo { get; set; } = 0;
        public bool Ativo { get; set; } = true;
        public double Margem
        {
            get => Preco != 0 ? (Preco - Custo) / Preco * 100 : 0;
        }
        public int? Receita_Id { get; set; } = null;
    }
}
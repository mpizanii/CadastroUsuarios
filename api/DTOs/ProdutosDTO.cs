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
    }
}
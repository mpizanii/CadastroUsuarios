using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    [Table("produtos")]
    public class Produtos
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("preco")]
        public double Preco { get; set; } = 0;
        
        [Column("receita_id")]
        public int Receita_id { get; set; }

        [Column("created_at")]
        public DateTime Created_At { get; set; }

        [Column("custo")]
        public double Custo { get; set; } = 0;

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        [NotMapped]
        public double Margem
        {
            get => Preco != 0 ? ((Preco - Custo) / Preco) * 100 : 0;
        }

    }
}
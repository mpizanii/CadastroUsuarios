using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    [Table("receitas")]
    public class Receitas
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("modo_preparo")]
        public string Modo_Preparo { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime Created_At { get; set; }
    }
    
    [Table("receitaIngredientes")]
    public class Ingrediente
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("receita_id")]
        public int ReceitaId { get; set; }

        [ForeignKey("ReceitaId")]
        public Receitas Receita { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("quantidade")]
        public double Quantidade { get; set; }

        [Column("unidade")]
        public string Unidade { get; set; }
    }
}
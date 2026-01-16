using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("receitaingredientes")]
    public class ReceitaIngredientes
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("receita_id")]
        public int ReceitaId { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("quantidade")]
        public double Quantidade { get; set; } = 0;

        [Column("unidade")]
        public string Unidade { get; set; } = string.Empty;
    }
}

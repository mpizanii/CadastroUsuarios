using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("ingredientes_insumo")]
    public class IngredientesInsumo
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("ingrediente_id")]
        public int IngredienteId { get; set; }

        [Column("insumo_id")]
        public int InsumoId { get; set; }

        [Column("fator_conversao")]
        public double FatorConversao { get; set; } = 1.0;
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("insumos")]
    public class Insumos
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("quantidade")]
        public double Quantidade { get; set; } = 0;

        [Column("unidade")]
        public string Unidade { get; set; } = string.Empty;

        [Column("validade")]
        public DateTime? Validade { get; set; }

        [Column("estoque_minimo")]
        public double EstoqueMinimo { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("status")]
        public string Status { get; set; } = "ativo";
    }
}

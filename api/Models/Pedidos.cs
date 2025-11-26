using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("pedidos")]
    public class Pedidos
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("cliente_id")]
        public int? ClienteId { get; set; }

        [Column("data")]
        public DateTime DataPedido { get; set; }

        [Column("valor")]
        public decimal ValorTotal { get; set; }

        [Column("status")]
        public string Status { get; set; } = "Pendente"; // Pendente, Em Preparo, Em Rota de Entrega, Entregue

        [Column("observacoes")]
        public string? Observacoes { get; set; }
    }
}

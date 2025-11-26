using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("pedidoprodutos")]
    public class PedidosProdutos
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("pedido_id")]
        public int PedidoId { get; set; }

        [Column("produto_id")]
        public int ProdutoId { get; set; }

        [Column("quantidade")]
        public int Quantidade { get; set; }
    }
}

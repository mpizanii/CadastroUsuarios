using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    [Table("clientes")]
    public class Cliente
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("nome")]
        public string Nome { get; set; } = string.Empty;

        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Column("telefone")]
        public string Telefone { get; set; } = string.Empty;

        [Column("endereco")]
        public string Endereco { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime Created_At { get; set; }

        [Column("user_id")]
        public Guid User_Id { get; set; }
    }
}
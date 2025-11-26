using System;

namespace api.DTOs
{
    public class InsumosDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public double Quantidade { get; set; } = 0;
        public string Unidade { get; set; } = string.Empty;
        public DateTime? Validade { get; set; }
        public double EstoqueMinimo { get; set; } = 0;
        public string Status { get; set; } = "ativo";
    }
}

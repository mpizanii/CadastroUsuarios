namespace api.DTOs
{
    public class IngredienteComMapeamentoDTO
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public double Quantidade { get; set; } = 0;
        public string Unidade { get; set; } = string.Empty;
        public bool Mapeado { get; set; } = false;
        public int? InsumoId { get; set; }
        public string? InsumoNome { get; set; }
        public double? FatorConversao { get; set; }
    }
}

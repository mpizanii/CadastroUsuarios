namespace api.DTOs
{
    public class MapearIngredienteDTO
    {
        public int IngredienteId { get; set; }
        public int InsumoId { get; set; }
        public double FatorConversao { get; set; } = 1.0;
    }
}

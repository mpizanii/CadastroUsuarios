package com.scalda.inventory.mapper;

import com.scalda.inventory.dto.CreateInsumoRequest;
import com.scalda.inventory.dto.InsumoResponse;
import com.scalda.inventory.dto.UpdateInsumoRequest;
import com.scalda.inventory.model.Insumo;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Mapper(componentModel = "spring")
public interface InsumoMapper {

    @Mapping(target = "statusEstoque", source = ".", qualifiedByName = "calcularStatusEstoque")
    InsumoResponse toResponse(Insumo insumo);

    List<InsumoResponse> toResponseList(List<Insumo> insumos);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Insumo toEntity(CreateInsumoRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "empresaId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(UpdateInsumoRequest request, @MappingTarget Insumo insumo);

    @Named("calcularStatusEstoque")
    default String calcularStatusEstoque(Insumo insumo) {
        BigDecimal quantidade = insumo.getQuantidade();
        BigDecimal estoqueMinimo = insumo.getEstoqueMinimo();
        LocalDate validade = insumo.getValidade();
        LocalDate hoje = LocalDate.now();

        if (estoqueMinimo != null && quantidade.compareTo(estoqueMinimo) < 0) {
            return "CRITICO_ESTOQUE_MINIMO";
        }
        if (validade != null && !validade.isAfter(hoje)) {
            return "CRITICO_VALIDADE";
        }
        if (estoqueMinimo != null) {
            BigDecimal margem = estoqueMinimo.multiply(new BigDecimal("1.2"));
            if (quantidade.compareTo(margem) <= 0) {
                return "BAIXO_ESTOQUE_MINIMO";
            }
        }
        if (validade != null && !validade.isAfter(hoje.plusDays(7))) {
            return "BAIXO_VALIDADE";
        }
        return "OK";
    }
}

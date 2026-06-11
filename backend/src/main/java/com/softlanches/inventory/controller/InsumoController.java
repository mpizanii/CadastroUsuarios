package com.softlanches.inventory.controller;

import com.softlanches.inventory.dto.CreateInsumoRequest;
import com.softlanches.inventory.dto.InsumoResponse;
import com.softlanches.inventory.dto.UpdateInsumoRequest;
import com.softlanches.inventory.service.InsumoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
public class InsumoController {

    private final InsumoService service;

    @GetMapping
    public ResponseEntity<List<InsumoResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/alertas")
    public ResponseEntity<List<InsumoResponse>> findAlertas() {
        return ResponseEntity.ok(service.findAlertas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsumoResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<InsumoResponse> create(@Valid @RequestBody CreateInsumoRequest request) {
        InsumoResponse response = service.create(request);
        URI location = URI.create("/api/insumos/" + response.id());
        return ResponseEntity.created(location).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<InsumoResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateInsumoRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

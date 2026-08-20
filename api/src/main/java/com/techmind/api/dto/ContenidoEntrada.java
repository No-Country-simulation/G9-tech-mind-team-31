package com.techmind.api.dto;

import jakarta.validation.constraints.NotBlank;

public class ContenidoEntrada {
    @NotBlank(message = "El título no puede estar vacío")
    private String titulo;

    @NotBlank(message = "El texto no puede estar vacío")
    private String texto;

    public ContenidoEntrada() {
    }

    public ContenidoEntrada(String titulo, String texto) {
        this.titulo = titulo;
        this.texto = texto;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }
}

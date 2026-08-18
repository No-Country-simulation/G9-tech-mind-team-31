package com.techmind.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    @Bean
    RestClient mlRestClient(
            RestClient.Builder builder,
            @Value("${ml.service.url:http://localhost:8000}") String baseUrl) {
        return builder.baseUrl(baseUrl).build();
    }
}
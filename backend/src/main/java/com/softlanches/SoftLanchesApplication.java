package com.softlanches;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SoftLanchesApplication {

    public static void main(String[] args) {
        SpringApplication.run(SoftLanchesApplication.class, args);
    }
}

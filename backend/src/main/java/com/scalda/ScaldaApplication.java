package com.scalda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ScaldaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ScaldaApplication.class, args);
    }
}

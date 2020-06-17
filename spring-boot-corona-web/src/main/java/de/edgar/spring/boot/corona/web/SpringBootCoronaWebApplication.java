package de.edgar.spring.boot.corona.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SpringBootCoronaWebApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootCoronaWebApplication.class, args);
	}

}

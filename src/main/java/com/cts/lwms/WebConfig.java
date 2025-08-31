
package com.cts.lwms;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                // Allow all origins for local development
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
            
            @Override
            public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
                // Serve static resources from /static/** to /**
                registry.addResourceHandler("/**")
                        .addResourceLocations("classpath:/static/")
                        .setCachePeriod(0)
                        .resourceChain(false);
                
                // Serve admin pages specifically
                registry.addResourceHandler("/admin/**")
                        .addResourceLocations("classpath:/static/admin/")
                        .setCachePeriod(0)
                        .resourceChain(false);
                
                // Serve JavaScript files
                registry.addResourceHandler("/js/**")
                        .addResourceLocations("classpath:/static/js/")
                        .setCachePeriod(0)
                        .resourceChain(false);
                
                // Serve CSS files
                registry.addResourceHandler("/css/**")
                        .addResourceLocations("classpath:/static/css/")
                        .setCachePeriod(0)
                        .resourceChain(false);
                
                // Serve assets
                registry.addResourceHandler("/assets/**")
                        .addResourceLocations("classpath:/static/assets/")
                        .setCachePeriod(0)
                        .resourceChain(false);
            }
        };
    }
}

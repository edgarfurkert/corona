package de.edgar.corona.config;

import java.io.IOException;
import java.util.Properties;

import org.springframework.beans.factory.config.YamlPropertiesFactoryBean;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class YamlPropertySourceFactory implements PropertySourceFactory {
	 
    @Override
    public PropertySource<?> createPropertySource(String name, EncodedResource encodedResource) 
      throws IOException {
        YamlPropertiesFactoryBean factory = new YamlPropertiesFactoryBean();
        factory.setResources(encodedResource.getResource());
 
        Properties properties = factory.getObject();
        log.info(properties.toString());
 
        return new PropertiesPropertySource(encodedResource.getResource().getFilename(), properties);
    }
}
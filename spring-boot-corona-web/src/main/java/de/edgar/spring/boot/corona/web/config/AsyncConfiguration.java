package de.edgar.spring.boot.corona.web.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableAsync(proxyTargetClass=true)
public class AsyncConfiguration implements AsyncConfigurer  {
	
	@Override
	public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        //executor.setQueueCapacity(4);
        //log.info("AsyncConfiguration: CorePoolSize     = {}", executor.getCorePoolSize());
        //log.info("AsyncConfiguration: MaxPoolSize      = {}", executor.getMaxPoolSize());
        //log.info("AsyncConfiguration: PoolSize         = {}", executor.getPoolSize());
        //log.info("AsyncConfiguration: ThreadNamePrefix = {}", executor.getThreadNamePrefix());
        executor.initialize();
        return executor;
	}
}
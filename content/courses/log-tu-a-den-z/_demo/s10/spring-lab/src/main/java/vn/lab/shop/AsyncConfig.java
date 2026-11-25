package vn.lab.shop;

import java.util.Map;
import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskDecorator;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/** MDC nằm trong ThreadLocal ⇒ không tự sang luồng @Async. TaskDecorator chép MDC sang luồng mới rồi dọn. */
@Configuration
public class AsyncConfig {
    @Bean
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
        ex.setCorePoolSize(2);
        ex.setThreadNamePrefix("mail-");
        if (!"false".equals(System.getenv("MDC_DECORATOR"))) {
            ex.setTaskDecorator(mdcCopy());
        }
        return ex;
    }

    static TaskDecorator mdcCopy() {
        return task -> {
            Map<String, String> ctx = MDC.getCopyOfContextMap();   // chụp MDC ở luồng gọi
            return () -> {
                if (ctx != null) MDC.setContextMap(ctx);
                try {
                    task.run();
                } finally {
                    MDC.clear();
                }
            };
        };
    }
}

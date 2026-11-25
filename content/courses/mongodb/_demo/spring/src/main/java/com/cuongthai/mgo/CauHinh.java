package com.cuongthai.mgo;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import com.mongodb.event.*;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.mongodb.autoconfigure.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.*;
import org.springframework.data.mongodb.*;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class CauHinh {
  /** Đếm lệnh driver gửi tới máy chủ (insert, update, find…). */
  public static final Map<String, AtomicInteger> LENH = new ConcurrentHashMap<>();

  @Bean MongoClientSettingsBuilderCustomizer demLenh() {
    return b -> b.addCommandListener(new CommandListener() {
      @Override public void commandStarted(CommandStartedEvent e) { LENH.computeIfAbsent(e.getCommandName(), k -> new AtomicInteger()).incrementAndGet(); }
    });
  }

  /** BẬT bằng --mgo.tx=true: không có bean này thì @Transactional KHÔNG làm gì với MongoDB. */
  @Bean @ConditionalOnProperty(name = "mgo.tx", havingValue = "true")
  MongoTransactionManager transactionManager(MongoDatabaseFactory f) { return new MongoTransactionManager(f); }
}

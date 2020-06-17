FROM openjdk:8-jdk-alpine
MAINTAINER edgar.furkert@t-online.de
RUN addgroup -S spring && adduser -S spring -G spring
RUN mkdir -p /app/logs && chown -R spring /app && chgrp -R spring /app
RUN mkdir -p /app/downloads && chown -R spring /app && chgrp -R spring /app
USER spring:spring
ENV SPRING_PROFILES_ACTIVE docker
VOLUME /app/logs
ARG DEPENDENCY=target/dependency
COPY ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY ${DEPENDENCY}/BOOT-INF/classes /app
COPY ${DEPENDENCY}/META-INF /app/META-INF
ENTRYPOINT ["java", "-cp", "/app:/app/lib/*", "de.edgar.corona.SpringBootCoronaImportApplication"]
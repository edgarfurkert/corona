FROM hypriot/rpi-java
COPY cacerts /etc/ssl/certs/java
ARG JAR_FILE=spring-boot-corona-import-0.0.1-SNAPSHOT.jar
ENV SPRING_PROFILES_ACTIVE raspi
VOLUME ["/data/logs", "/data/downloads"]
COPY ${JAR_FILE} spring-boot-corona-import.jar
ENTRYPOINT ["java","-jar","spring-boot-corona-import.jar"]


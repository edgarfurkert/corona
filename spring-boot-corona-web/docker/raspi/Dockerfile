FROM hypriot/rpi-java
ARG JAR_FILE=spring-boot-corona-web-0.0.1-SNAPSHOT.jar
ENV SPRING_PROFILES_ACTIVE raspi
VOLUME ["/data/logs"]
COPY ${JAR_FILE} spring-boot-corona-web.jar
ENTRYPOINT ["java","-jar","spring-boot-corona-web.jar"]


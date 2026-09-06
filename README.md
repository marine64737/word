# 단어장 사이트


## 프로젝트 개요

- 개인 프로젝트
- 프로젝트 명: 단어 암기 사이트
- 구성: Spring Boot Rest API + Pure HTML + JavaScript
- 도메인: 일본어 단어, 일본어 한자, 영어 단어(추가 가능)
- 기능:
  1. 단어 랜덤 생성으로 단어 자체에 대한 암기 용이
  2. 버튼 클릭에 의하여 도메인 간 비동기 전환이 가능하여 빠른 토글 가능


## 프로젝트 기간

- 2026.04 하순 초안 제작, 이후~ (진행 중)
- 이전까지 도메인 별로 프로젝트 별도로 생성하다가 2026.09 초순에 프로젝트 통합 후 웹 페이지 하나에서 사용하도록 전환.
- 다중 사용자 기능 및 도메인 추가 가능
- JUnit, mockmvc 등 테스트 코드 추가 예정

## 개발 환경

- Language: Java 17
- Framework: Spring Boot 3.5
- Build Tool: Gradle
- DB: Postgres(Docker)
- Template: Pure HTML + JavaScript
- 기타: JDBC

---
## 시스템 구조

## Scheme
- 일본어 단어
<img width="827" height="332" alt="image" src="https://github.com/user-attachments/assets/23c8a42a-9fb0-4fbe-b03e-56e5bf28c242" />

- 일본어 한자
<img width="826" height="296" alt="image" src="https://github.com/user-attachments/assets/62fa1e89-ad97-45b4-880e-6b79bcf5ce1b" />

- 영어 단어
<img width="826" height="245" alt="image" src="https://github.com/user-attachments/assets/d2c56513-2b16-4921-b4b3-3df17dfdcf57" />

## Frontend 파일 시스템: 현재는 한 폴더에 정리, 규모가 커지면 분리 예정
<img width="121" height="175" alt="image" src="https://github.com/user-attachments/assets/06c92f66-2cd8-45ee-a226-3a1f7a1187e1" />

## 주요 기능

  1. 단어 랜덤 출력
     - 일본어 단어, 일본어 한자: 10개
     - 영어 단어: 20개(페이지를 덜 차지하여 개수를 늘림)
  3. 랜덤 출력하며 loop 상태를 true로 전환
  4. loop = true인 단어가 90개 이상이 되면 무한 반복
  5. 단어 암기 시 해당 단어 loop -> false, 암기 상태 -> true 전환
  6. 단어 랜덤 출력하여 loop = true인 단어가 90개 이상이 될 때까지 새로운 단어 출력

## 실행 및 테스트 방법

1. `Git clone` 후, `application.yml` 또는 `application.properties` 설정
2. DB 연동 (postgres)
3. 로컬에서 실행: `./gradlew bootRun`
4. 브라우저 접속: `http://localhost:8081/`

## 트러블슈팅
1. html, js의 위치와 nginx location 간 mismatching으로 인한 404 Not Found Error
2. CSRF 에러: 사용자의 브라우저에서 보낸 토큰과 서버의 토큰이 불일치할 경우 발생

현재 해결된 코드:
1. Webconfig.Java 추가
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://kshsvr.com/") // 허용할 출처
//                .allowedOrigins("http://localhost:8080") // 허용할 출처 -> 8081로 수정 예정
                .allowedMethods("GET", "POST") // 허용할 HTTP method
//                .allowedHeaders("*")
                .allowCredentials(true) // 쿠키 인증 요청 허용
                .maxAge(3000); // 원하는 시간만큼 pre-flight 리퀘스트를 캐싱
    }
}
```
2. RestController 별 Annotation 추가
```java
@CrossOrigin(value = "https://kshsvr.com/")
```
3. 도메인 별 JS가 있고 Main JS가 있는데 override 식으로 중복을 줄여 최적화 시도 중


package co.simplon.yourgardenbusiness.config;

import java.util.List;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.auth0.jwt.algorithms.Algorithm;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Value("${co.simplon.yourgardenbusiness.cors}")
    private String origins;

    @Value("${co.simplon.yourgardenbusiness.cost}")
    private Integer cost;

    @Value("${co.simplon.yourgardenbusiness.secret}")
    private String secret;

    @Value("${co.simplon.yourgardenbusiness.jwt.expiration}")
    private long expiration;

    @Value("${co.simplon.yourgardenbusiness.jwt.issuer}")
    private String issuer;

    // @Bean injection dependences
  /*  @Bean
    WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8081")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
    */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:8081")); // on peut ajouter 3000/5173 aussi
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    PasswordEncoder encoder() {
	return new BCryptPasswordEncoder(cost);
    }

    @Bean
    JwtProvider jwtProvider() {
	Algorithm algorithm = Algorithm.HMAC256(secret);
	return new JwtProvider(algorithm, expiration, issuer);
    }

    @Bean
    JwtDecoder jwtDecoder() { // Tell Spring how to verify JWT signature
	SecretKey secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
	NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(secretKey).macAlgorithm(MacAlgorithm.HS256).build();

	OAuth2TokenValidator<Jwt> validator = JwtValidators.createDefaultWithIssuer(issuer);
	decoder.setJwtValidator(validator);
	return decoder;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	// Default Spring behaviour: PoLP (no authorization at all)
// V1
//	return http.cors(Customizer.withDefaults()).csrf(csrf -> csrf.disable())
//		.authorizeHttpRequests(authorize -> authorize.requestMatchers("/accounts", "/accounts/authenticate")
//			.permitAll().anyRequest().authenticated())
//		.oauth2ResourceServer((srv) -> srv.jwt(Customizer.withDefaults())).build();

	return http.cors(cors -> cors.configurationSource(corsConfigurationSource()))/*cors(Customizer.withDefaults())*/
			.csrf(csrf -> csrf.disable())
		// Multiple matchers to map verbs + paths + authorizations
		// "authorizations": anonymous, permit, deny and more...
		// By configuration (filterChain), also by annotations...
		.authorizeHttpRequests((req) -> req.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

			.requestMatchers(HttpMethod.POST, "/accounts", "/accounts/authenticate").anonymous())

		.authorizeHttpRequests(
			(req) -> req.requestMatchers(HttpMethod.GET, "/accounts/with-role").hasRole("MANAGER"))

		// Always last rule:
		.authorizeHttpRequests((reqs) -> reqs.anyRequest().authenticated())
		.oauth2ResourceServer((srv) -> srv.jwt(Customizer.withDefaults()))
		// The build method builds the configured SecurityFilterChain
		// with all the specified configuration
		.build();
    }
}

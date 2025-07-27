package co.simplon.yourgardenbusiness.config;

import java.time.Instant;
import java.util.List;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator.Builder;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;

public class JwtProvider {
    private final Algorithm algorithm;
    private final long exp;
    private final String issuer;

    JwtProvider(Algorithm algorithm, long exp, String issuer) {
	this.algorithm = algorithm;
	this.exp = exp;
	this.issuer = issuer;
    }

    public String create(String subject, List<String> roles) {
	Instant issuedAt = Instant.now();
	Builder builder = JWT.create().withIssuedAt(issuedAt).withSubject(subject).withIssuer(issuer).withClaim("roles",
		roles);
	if (exp > 0) {
	    Instant expiresAt = issuedAt.plusSeconds(exp);
	    builder.withExpiresAt(expiresAt);
	}
	return builder.sign(algorithm);
    }
}

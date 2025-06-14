package co.simplon.yourgardenbusiness.services;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.simplon.yourgardenbusiness.config.JwtProvider;
import co.simplon.yourgardenbusiness.dtos.AccountAuthenticate;
import co.simplon.yourgardenbusiness.dtos.AccountCreate;
import co.simplon.yourgardenbusiness.dtos.AuthInfo;
import co.simplon.yourgardenbusiness.entities.Users;
import co.simplon.yourgardenbusiness.repositories.AccountRepository;

@Service
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository repos;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public AccountService(AccountRepository repos, PasswordEncoder passwordEncoder, JwtProvider jwtProvider) {
        this.repos = repos;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    @Transactional
    public void create(AccountCreate inputs) {
        String email = inputs.email();
        String name = inputs.name();
        String firstName = inputs.first_name();

        if (repos.existsByEmailIgnoreCase(email)) {
            throw new BadCredentialsException("Email déjà utilisé");
        }

        String password = passwordEncoder.encode(inputs.password());

        Users entity = new Users(name, firstName, email, password);
        repos.save(entity);
    }

    public AuthInfo authenticate(AccountAuthenticate inputs) {
        String email = inputs.email();

        Users account = repos.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new BadCredentialsException("Compte introuvable : " + email));

        if (!passwordEncoder.matches(inputs.password(), account.getPassword())) {
            throw new BadCredentialsException("Mot de passe incorrect");
        }

        String token = jwtProvider.create(email, null); // token avec email uniquement
        return new AuthInfo(token, null);
    }

    public String getAccount() {
        return "ok";
    }

    public Users findById(Long id) {
        return repos.findById(id)
            .orElseThrow(() -> new BadCredentialsException("Utilisateur non trouvé"));
    }
}


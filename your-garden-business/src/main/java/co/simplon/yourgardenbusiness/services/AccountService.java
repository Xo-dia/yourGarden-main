package co.simplon.yourgardenbusiness.services;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.simplon.yourgardenbusiness.config.JwtProvider;
import co.simplon.yourgardenbusiness.dtos.AccountAuthenticate;
import co.simplon.yourgardenbusiness.dtos.AccountCreate;
import co.simplon.yourgardenbusiness.dtos.AuthInfo;
import co.simplon.yourgardenbusiness.dtos.UserDto;
import co.simplon.yourgardenbusiness.entities.Users;
import co.simplon.yourgardenbusiness.mapping.UserMapper;
import co.simplon.yourgardenbusiness.repositories.AccountRepository;

@Service
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository repos;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final UserMapper userMapper;

    public AccountService(AccountRepository repos, 
    		PasswordEncoder passwordEncoder, 
    		JwtProvider jwtProvider,
    		UserMapper userMapper) {
        this.repos = repos;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.userMapper = userMapper;
    }

    @Transactional
    public void create(AccountCreate inputs) {
        String email = inputs.email();
        String lastName = inputs.last_name();
        String firstName = inputs.first_name();

        if (repos.existsByEmailIgnoreCase(email)) {
            throw new BadCredentialsException("Email déjà utilisé");
        }

        String password = passwordEncoder.encode(inputs.password());

        Users entity = new Users(lastName, firstName, email, password);
        repos.save(entity);
    }

    public AuthInfo authenticate(AccountAuthenticate inputs) {
        String email = inputs.email();

        Users account = repos.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new BadCredentialsException("Compte introuvable : " + email));

        if (!passwordEncoder.matches(inputs.password(), account.getPassword())) {
            throw new BadCredentialsException("Mot de passe incorrect");
        }

        var id = String.valueOf(account.getId());
        String token = jwtProvider.create(id, null); // token avec email uniquement
        return new AuthInfo(token, null, userMapper.toDto(account));
    }

    public String getAccount() {
        return "ok";
    }

    public Users findById(Long id) {
        return repos.findById(id)
            .orElseThrow(() -> new BadCredentialsException("Utilisateur non trouvé"));
    }
    
    // ★★★ Nouvelle méthode demandée ★★★
    public UserDto findByIdDto(Long id) {
        Users u = findById(id);      // réutilise la logique existante (et l’exception si non trouvé)
        return userMapper.toDto(u);  // mappe vers le DTO public
    }
}


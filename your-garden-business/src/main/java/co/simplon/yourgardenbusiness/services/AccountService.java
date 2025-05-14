package co.simplon.yourgardenbusiness.services;

import java.util.List;
import java.util.Set;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.simplon.yourgardenbusiness.config.JwtProvider;
import co.simplon.yourgardenbusiness.dtos.AccountAuthenticate;
import co.simplon.yourgardenbusiness.dtos.AccountCreate;
import co.simplon.yourgardenbusiness.dtos.AuthInfo;
import co.simplon.yourgardenbusiness.entities.Account;
import co.simplon.yourgardenbusiness.entities.Role;
import co.simplon.yourgardenbusiness.repositories.AccountRepository;
import co.simplon.yourgardenbusiness.repositories.RoleRepository;

@Service
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository repos;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RoleRepository roleRepos;

    public AccountService(AccountRepository repos, PasswordEncoder passwordEncoder, JwtProvider jwtProvider,
	    RoleRepository roleRepos) {
	this.repos = repos;
	this.passwordEncoder = passwordEncoder;
	this.jwtProvider = jwtProvider;
	this.roleRepos = roleRepos;
    }

    @Transactional
    public void create(AccountCreate inputs) {
    String email = inputs.email();
	String pseudo = inputs.pseudo();
	
    // Vérification des doublons
    if (repos.existsByEmailIgnoreCase(email)) {
        throw new BadCredentialsException("Email déjà utilisé");
    }
    if (repos.existsByPseudo(pseudo)) {
        throw new BadCredentialsException("Nom d'utilisateur déjà utilisé");
    }
	
	String password = passwordEncoder.encode(inputs.password());
	Set<Role> roleDefaultValue = roleRepos.findByRoleDefaultTrue()
		.orElseThrow(() -> new BadCredentialsException(pseudo));

	Account entity = new Account(email, pseudo, password, roleDefaultValue);
	repos.save(entity);
	// save roles with setRoles
	// Set<Role> roles = inputs.roles().stream().map(roleRepos::findByRole)
//	.collect(Collectors.toSet());
    }

    public AuthInfo authenticate(AccountAuthenticate inputs) {
	String pseudo = inputs.pseudo();
	Account account = repos.findAllByPseudoIgnoreCase(pseudo)
		.orElseThrow(() -> new BadCredentialsException(pseudo));

	// System.out.println(account); => recuperer account, pas contient le roles
	// applique Lazy loading
	List<String> roles = account.getRoles().stream().map(r -> r.getRoleName()).toList();

	String row = inputs.password();
	String encoded = account.getPassword();
	if (!passwordEncoder.matches(row, encoded)) {
	    throw new BadCredentialsException(pseudo);
	}

	String token = jwtProvider.create(pseudo, roles);
	return new AuthInfo(token, roles);
    }

    public String getAccount() {
	return "ok";
    }

    public Account findById(Long id) {
	return repos.findById(id).get();
    }
}

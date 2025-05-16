package co.simplon.yourgardenbusiness.entities;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_accounts")
public class Account extends AbstractEntity {
	
	@Column(name = "email")
	private String email;

    @Column(name = "pseudo")
    private String pseudo;

    @Column(name = "password")
    private String password;

    // ManyToMany have optional: fetch = FetchType.EAGER : desactive lazyload par
    // default
    // fetch = FetchType.LAZY: default
    @ManyToMany
    @JoinTable(name = "t_accounts_roles", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    public Account() {
	// ORM
    }

    public Account(String email, String pseudo, String password, Set<Role> roles) {
    this.email = email;
	this.pseudo = pseudo;
	this.password = password;
	this.roles = new HashSet<Role>(roles);
    }

    public String getPseudo() {
	return pseudo;
    }

    public void setPseudo(String pseudo) {
	this.pseudo = pseudo;
    }

    public String getPassword() {
	return password;
    }

    public void setPassword(String password) {
	this.password = password;
    }

    public Set<Role> getRoles() {
	return Collections.unmodifiableSet(roles);
    }

    // roles.size
    @Override
    public String toString() {
	return "{pseudo=" + pseudo + ", password=[PROTECTED]" + ", roles=LAZY_LOADING}";
    }
}

//public Account(String username, String password) {
//	this(username, password, new HashSet<Role>());
//}
package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_users")
public class Users extends AbstractEntity {

    @Column(name = "last_name")
    private String last_name;
    
    @Column(name = "first_name")
    private String first_name;

	@Column(name = "email")
	private String email;

    @Column(name = "password")
    private String password;

    // ManyToMany have optional: fetch = FetchType.EAGER : desactive lazyload par
    // default
    // fetch = FetchType.LAZY: default
    /* @ManyToMany
    @JoinTable(name = "t_accounts_roles", joinColumns = @JoinColumn(name = "account_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles; */

    public Users() {
	// ORM
    }

    public Users(  String last_name,String first_name,String email, String password) {
	this.first_name = first_name;
	this.last_name = last_name;
	this.email = email;
	this.password = password;
    }

 

    public String getLast_name() {
		return last_name;
	}

	public String getFirst_name() {
		return first_name;
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}

	public void setFirst_name(String first_name) {
		this.first_name = first_name;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPassword(String password) {
		this.password = password;
	}

    // roles.size
    @Override
    public String toString() {
        return "{last_name=" + last_name +
               ", first_name=" + first_name +
               ", email=" + email +
               ", password=[PROTECTED]" +
               ", roles=LAZY_LOADING}";
    }
}

//public Account(String username, String password) {
//	this(username, password, new HashSet<Role>());
//}
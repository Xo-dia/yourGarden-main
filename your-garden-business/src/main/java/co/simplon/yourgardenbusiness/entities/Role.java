package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_roles")
public class Role extends AbstractEntity {

    @Column(name = "name")
    private String roleName;

    @Column(name = "default")
    private Boolean roleDefault;

    public Role() {
	// ORM
    }

    public Role(String roleName, Boolean roleDefault) {
	this.roleName = roleName;
	this.roleDefault = roleDefault;
    }

    public String getRoleName() {
	return roleName;
    }

    public void setRoleName(String roleName) {
	this.roleName = roleName;
    }

    public Boolean getRoleDefault() {
	return roleDefault;
    }

    public void setIsDefault(Boolean roleDefault) {
	this.roleDefault = roleDefault;
    }

}

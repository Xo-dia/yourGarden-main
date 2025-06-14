package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_garden")
public class Gardens extends AbstractEntity {
	
	@Column(name = "designation")
	private String designation;

    @Column(name = "surface")
    private String surface;

	public String getDesignation() {
		return designation;
	}

	public String getSurface() {
		return surface;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public void setSurface(String surface) {
		this.surface = surface;
	}

}

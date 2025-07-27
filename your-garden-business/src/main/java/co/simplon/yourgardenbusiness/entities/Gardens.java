package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_garden")
public class Gardens extends AbstractEntity {
	// mettre l'entité au singulier et la table au pluriel
	@Column(name = "designation")
	private String designation;

    @Column(name = "surface")
    private String surface;

	// Clé étrangère vers land
    @ManyToOne
    @JoinColumn(name = "land_id", nullable = false)
    private Lands land;
    
	public String getDesignation() {
		return designation;
	}

	public String getSurface() {
		return surface;
	}
	
    public Lands getLand() {
        return land;
    }
    
	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public void setSurface(String surface) {
		this.surface = surface;
	}

    public void setLand(Lands land) {
        this.land = land;
    }

}

package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_lands")
public class Lands extends AbstractEntity {
	
	@Column(name = "cadastral_reference")
	private String cadastral_reference;
	
	@Column(name = "land_name")
	private String land_name;
	
	@Column(name = "land_adresse")
	private String land_adresse;
	
	@Column(name = "nb_gardens")
	private int nb_gardens;
	
	@Column(name = "land_img")
	private String imageURL;
	
	@Column(name = "land_desc")
	private String description;
	
	   // Clé étrangère vers l'utilisateur
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

	public String getCadastral_reference() {
		return cadastral_reference;
	}

	public String getLand_name() {
		return land_name;
	}

	public String getLand_adresse() {
		return land_adresse;
	}

	public int getnb_garden() {
		return nb_gardens;
	}
	
	public String getImageURL() {
		return imageURL;
	}
	
	public String description() {
		return description;
	}

	public void setCadastral_reference(String cadastral_reference) {
		this.cadastral_reference = cadastral_reference;
	}

	public void setLand_name(String land_name) {
		this.land_name = land_name;
	}

	public void setLand_adresse(String land_adresse) {
		this.land_adresse = land_adresse;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}

	public void setNumber_of_garden(int nb_garden) {
		this.nb_gardens = nb_garden;
	}
	
    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }
	
}

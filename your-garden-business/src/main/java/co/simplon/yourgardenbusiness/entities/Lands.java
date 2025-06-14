package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	private int imageId;
	
	@Column(name = "land_desc")
	private String description;

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

	public void setCadastral_reference(String cadastral_reference) {
		this.cadastral_reference = cadastral_reference;
	}

	public void setLand_name(String land_name) {
		this.land_name = land_name;
	}

	public void setLand_adresse(String land_adresse) {
		this.land_adresse = land_adresse;
	}

	public void setNumber_of_garden(int nb_garden) {
		this.nb_gardens = nb_garden;
	}
	
}

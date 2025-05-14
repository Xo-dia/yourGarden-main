package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "t_lands")
public class Lands {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "cadastral_reference")
	private String cadastral_reference;
	
	@Column(name = "land_name")
	private String land_name;
	
	@Column(name = "land_adresse")
	private String land_adress;
	
	@Column(name = "number_of_garden")
	private String number_of_garden;
	
	@Column(name = "land_img")
	private String imageId;
	
	@Column(name = "land_desc")
	private String description;

	public Long getId() {
		return id;
	}

	public String getCadastral_reference() {
		return cadastral_reference;
	}

	public String getLand_name() {
		return land_name;
	}

	public String getLand_adress() {
		return land_adress;
	}

	public String getNumber_of_garden() {
		return number_of_garden;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setCadastral_reference(String cadastral_reference) {
		this.cadastral_reference = cadastral_reference;
	}

	public void setLand_name(String land_name) {
		this.land_name = land_name;
	}

	public void setLand_adress(String land_adress) {
		this.land_adress = land_adress;
	}

	public void setNumber_of_garden(String number_of_garden) {
		this.number_of_garden = number_of_garden;
	}
	
}

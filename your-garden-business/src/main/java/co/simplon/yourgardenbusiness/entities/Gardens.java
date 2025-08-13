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

    @Column(name = "surface")
    private int surface;

	// Clé étrangère vers land
    @ManyToOne
    @JoinColumn(name = "land_id", nullable = false)
    private Lands land;

	@Column(name = "garden_desc")
    private String description;
	
	@Column(name = "price")
    private double price;
	
	@Column(name = "garden_img")
	private String imageURL;
	
	@Column(name = "garden_name")
    private String garden_name;
    
    public String getGarden_name() {
		return garden_name;
	}

	public void setGarden_name(String garden_name) {
		this.garden_name = garden_name;
	}

	public String getImageURL() {
		return imageURL;
	}

	public void setImageURL(String imageURL) {
		this.imageURL = imageURL;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
    
	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public int getSurface() {
		return surface;
	}
	
    public Lands getLand() {
        return land;
    }

	public void setSurface(int surface) {
		this.surface = surface;
	}

    public void setLand(Lands land) {
        this.land = land;
    }

}

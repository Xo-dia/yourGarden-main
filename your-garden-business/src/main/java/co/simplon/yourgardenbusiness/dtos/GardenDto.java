package co.simplon.yourgardenbusiness.dtos;

public record GardenDto (
	Long id,
	Long land_id,
	String description,
	int surface,
	double price,
	String imageURL,
	String garden_name) { }


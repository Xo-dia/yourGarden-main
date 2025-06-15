package co.simplon.yourgardenbusiness.dtos;

public record LandDto (String cadastral_reference,
		String land_name, 
		String land_adresse, 
		int nb_gardens,
		int imageId,
		String description,
		Long user_id,
		Long id) {
	
}


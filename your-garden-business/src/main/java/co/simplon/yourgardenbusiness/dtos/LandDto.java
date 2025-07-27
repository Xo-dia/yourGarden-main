package co.simplon.yourgardenbusiness.dtos;

public record LandDto (
		Long id,
		Long user_id,
		String cadastral_reference,
		String land_name,
		String land_adresse,
		int nb_gardens,
		int imageId,
		String description) {}


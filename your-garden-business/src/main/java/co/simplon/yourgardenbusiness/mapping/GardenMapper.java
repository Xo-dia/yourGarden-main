package co.simplon.yourgardenbusiness.mapping;

import co.simplon.yourgardenbusiness.dtos.GardenDto;
import co.simplon.yourgardenbusiness.dtos.LandDto;
import co.simplon.yourgardenbusiness.entities.Gardens;
import co.simplon.yourgardenbusiness.entities.Lands;

public class GardenMapper {

    public Gardens toEntity(GardenDto dto) {
        if (dto == null) return null;

        Gardens garden = new Gardens();
        garden.setDescription(dto.description());
        garden.setPrice(dto.price());
        garden.setSurface(dto.surface());
        garden.setImageURL(dto.imageURL());
        garden.setGarden_name(dto.garden_name());

        return garden;
    }

    public GardenDto toDto(Gardens garden) {
        if (garden == null) return null;

        GardenDto dto = new GardenDto(garden.getId(),
        		garden.getLand().getId(),
        		garden.getDescription(),
        		garden.getSurface(),
        		garden.getPrice(),
        		garden.getImageURL(),
        		garden.getGarden_name()
        		);

        return dto;
    }
	
}

package co.simplon.yourgardenbusiness.mapping;

import org.springframework.stereotype.Component;

import co.simplon.yourgardenbusiness.dtos.LandDto;
import co.simplon.yourgardenbusiness.entities.Lands;

@Component
public class LandMapper {

    public Lands toEntity(LandDto dto) {
        if (dto == null) return null;

        Lands land = new Lands();
        land.setLand_name(dto.land_name());
        land.setLand_adresse(dto.land_adresse());
        land.setNumber_of_garden(dto.nb_gardens());
        land.setImageId(dto.imageId());
        land.setCadastral_reference(dto.cadastral_reference());
        land.setDescription(dto.description());

        return land;
    }

    public LandDto toDto(Lands land) {
        if (land == null) return null;

        LandDto dto = new LandDto(land.getId(),
        		land.getUser().getId(),
        		land.getCadastral_reference(),
        		land.getLand_name(),
        		land.getLand_adresse(),
        		land.getnb_garden(),
        		land.getImageId(),
        		land.description()
        		);

        return dto;
    }
}


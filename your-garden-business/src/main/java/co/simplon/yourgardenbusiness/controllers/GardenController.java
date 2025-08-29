package co.simplon.yourgardenbusiness.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import co.simplon.yourgardenbusiness.dtos.GardenDto;
import co.simplon.yourgardenbusiness.services.GardenService;

@RestController
@RequestMapping("/gardens")
public class GardenController {
	
	private final GardenService service;

	public GardenController (GardenService service) {
		this.service = service;
	}
	
	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<List<GardenDto>> getGardens(@RequestParam(name = "land-id", required = true) Long id) {
		List<GardenDto> gardens = null;
		
		try {
			gardens =  service.get(id);
			return ResponseEntity.ok(gardens);
		}
		catch (Exception ex) {
			//TODO; logger
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(gardens);
		}
		
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<GardenDto> postGarden(@RequestBody GardenDto garden) {
		GardenDto response = null;
		
		try {
			response =  service.post(garden);
			return ResponseEntity.created(URI.create("/gardens/" + response.id())) // <== Location header
	                .body(response);
		}
		catch (Exception ex) {
			//TODO; logger
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(garden);
		}
	}
	
	@PutMapping
    public ResponseEntity<List<GardenDto>> bulkUpdateGardens(
    		@AuthenticationPrincipal(expression = "claims['sub']") String userId,
            @RequestBody List<GardenDto> gardens) {
		var id = Long.valueOf(userId);

        // Vérifs rapides
        if (gardens == null || gardens.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Long landId = gardens.getFirst().land_id();
        
        // Tous doivent avoir un id et le même land_id (ou null => on force)
        for (GardenDto g : gardens) {
            if (g.id() == null) {
                return ResponseEntity.badRequest()
                    .body(List.of()); // ou renvoyer un message d’erreur détaillé
            }
            if (g.land_id() != null && !g.land_id().equals(landId)) {
                return ResponseEntity.badRequest().build();
            }
        }

        List<GardenDto> updated = service.bulkUpdate(id, gardens);
        return ResponseEntity.ok(updated);
    }

}

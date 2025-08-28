package co.simplon.yourgardenbusiness.controllers;

import java.net.URI;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	public ResponseEntity<List<GardenDto>> getGardens() {
		List<GardenDto> gardens = null;
		
		try {
			gardens =  service.get();
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

}

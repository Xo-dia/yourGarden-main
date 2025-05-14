package co.simplon.yourgardenbusiness.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.services.LandService;

@RestController
@RequestMapping("/lands")
public class LandController {
	
	private final LandService service;

	public LandController (LandService service) {
		this.service = service;
	}
	
	@GetMapping
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Lands> getLands() {
		Lands lands = null;
		
		try {
			lands =  service.get();
			return ResponseEntity.ok(lands);
		}
		catch (Exception ex) {
			//TODO; logger
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(lands);
		}
		
	}
	

}

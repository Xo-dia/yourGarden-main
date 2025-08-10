package co.simplon.yourgardenbusiness.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

import co.simplon.yourgardenbusiness.dtos.LandDto;
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
	public ResponseEntity<List<LandDto>> getLands() {
		List<LandDto> lands = null;
		
		try {
			lands =  service.get();
			return ResponseEntity.ok(lands);
		}
		catch (Exception ex) {
			//TODO; logger
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(lands);
		}
		
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<LandDto> postLand(@RequestBody LandDto land) {
		LandDto response = null;
		
		try {
			response =  service.post(land);
			return ResponseEntity.created(URI.create("/lands/" + response.id())) // <== Location header
	                .body(response);
		}
		catch (Exception ex) {
			//TODO; logger
            System.out.println(ex.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(land);
		}
		
	}
}

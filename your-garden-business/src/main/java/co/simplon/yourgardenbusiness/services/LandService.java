package co.simplon.yourgardenbusiness.services;

import org.springframework.stereotype.Service;

import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.repositories.LandRepository;


@Service
public class LandService {

	private final LandRepository repository;
	
	LandService(LandRepository repository){
		this.repository = repository;
	}

	public Lands get() {
		Lands land = this.repository.findAll().getLast();
		return land;
	}
}

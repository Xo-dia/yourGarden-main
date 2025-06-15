package co.simplon.yourgardenbusiness.services;

import java.util.List;

import org.springframework.stereotype.Service;

import co.simplon.yourgardenbusiness.entities.Lands;
import co.simplon.yourgardenbusiness.repositories.LandRepository;


@Service
public class LandService {

	private final LandRepository repository;
	
	LandService(LandRepository repository){
		this.repository = repository;
	}

	public List<Lands> get() {
		List<Lands> land = this.repository.findAll();
		
		return land;
	}
	
	public Lands post(Lands  land) {
	 land = this.repository.save(land);
		return land;
	}
	
    public Lands updateProduit(Long id, Lands land) {
        // land.setId(id);
        return this.repository.save(land);
    }

    public void deleteProduit(Long id) {
        this.repository.deleteById(id);
    }
}

package co.simplon.yourgardenbusiness.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.simplon.yourgardenbusiness.entities.Gardens;


@Repository
public interface GardenRepository extends JpaRepository <Gardens, Long>{

}

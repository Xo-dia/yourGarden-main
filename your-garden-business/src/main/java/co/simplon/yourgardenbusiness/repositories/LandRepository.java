package co.simplon.yourgardenbusiness.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.simplon.yourgardenbusiness.entities.Lands;


@Repository
public interface LandRepository extends JpaRepository <Lands, Long>{

	List<Lands> findByUserId(long user_id);

}

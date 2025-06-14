package co.simplon.yourgardenbusiness.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.simplon.yourgardenbusiness.entities.Users;

@Repository
public interface AccountRepository extends JpaRepository<Users, Long> {

   // boolean existsByPseudo(String pseudo);
    boolean existsByEmailIgnoreCase(String email);

    // Optional<Users> findAllByPseudoIgnoreCase(String pseudo); // or null
    Optional<Users> findByEmailIgnoreCase(String email);

}

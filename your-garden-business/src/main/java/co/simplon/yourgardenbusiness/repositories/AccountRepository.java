package co.simplon.yourgardenbusiness.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.simplon.yourgardenbusiness.entities.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByPseudo(String pseudo);
    boolean existsByEmailIgnoreCase(String email);

    Optional<Account> findAllByPseudoIgnoreCase(String pseudo); // or null

}

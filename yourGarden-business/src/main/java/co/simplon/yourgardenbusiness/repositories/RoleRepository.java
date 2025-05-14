package co.simplon.yourgardenbusiness.repositories;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import co.simplon.yourgardenbusiness.entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByRoleName(String role);

    Optional<Set<Role>> findByRoleDefaultTrue();

}

package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
abstract class AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public long getId() {
	return id;
    }

    protected AbstractEntity() {
	//
    }

    @SuppressWarnings("unused")
    private void setId(long id) {
	this.id = id;
    }

}

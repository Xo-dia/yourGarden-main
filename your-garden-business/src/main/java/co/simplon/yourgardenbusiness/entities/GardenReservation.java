package co.simplon.yourgardenbusiness.entities;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import co.simplon.yourgardenbusiness.dtos.ReservationStatus;

@Entity
@Table(name = "garden_reservations")
public class GardenReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Jardinier (demandeur) -> colonne gardener_id */
    @ManyToOne
    @JoinColumn(name = "gardener_id", nullable = false)
    private Users gardener;

    /** Propriétaire -> colonne owner_id */
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Users owner;

    /** Jardin (t_gardens) -> colonne garden_id */
    @ManyToOne
    @JoinColumn(name = "garden_id", nullable = false)
    private Gardens garden;

    @Column(name = "request_date", nullable = false)
    private OffsetDateTime requestDate;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "status", nullable = false, columnDefinition = "reservation_status")
    private ReservationStatus status;

    // --- Getters / Setters ---

    public Long getId() {
        return id;
    }

    public Users getGardener() {
        return gardener;
    }

    public void setGardener(Users gardener) {
        this.gardener = gardener;
    }

    public Users getOwner() {
        return owner;
    }

    public void setOwner(Users owner) {
        this.owner = owner;
    }

    public Gardens getGarden() {
        return garden;
    }

    public void setGarden(Gardens garden) {
        this.garden = garden;
    }

    public OffsetDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(OffsetDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}
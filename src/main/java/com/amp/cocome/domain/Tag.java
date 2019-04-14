package com.amp.cocome.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Tag.
 */
@Entity
@Table(name = "tag")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Tag implements Serializable {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "premium", nullable = false)
    private Boolean premium;

    @ManyToOne
    @JsonIgnoreProperties("tagsInRoutes")
    private TRoute tRoute;

    @ManyToOne
    @JsonIgnoreProperties("tagsInPointInterests")
    private PointInterest pointInterest;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Tag name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isPremium() {
        return premium;
    }

    public Tag premium(Boolean premium) {
        this.premium = premium;
        return this;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public TRoute getTRoute() {
        return tRoute;
    }

    public Tag tRoute(TRoute tRoute) {
        this.tRoute = tRoute;
        return this;
    }

    public void setTRoute(TRoute tRoute) {
        this.tRoute = tRoute;
    }

    public PointInterest getPointInterest() {
        return pointInterest;
    }

    public Tag pointInterest(PointInterest pointInterest) {
        this.pointInterest = pointInterest;
        return this;
    }

    public void setPointInterest(PointInterest pointInterest) {
        this.pointInterest = pointInterest;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Tag tag = (Tag) o;
        if (tag.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), tag.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Tag{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", premium='" + isPremium() + "'" +
            "}";
    }
}

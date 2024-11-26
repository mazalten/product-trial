package com.alten.producttrial.repositories;

import com.alten.producttrial.models.Cart;
import com.alten.producttrial.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByOwner(User Owner);
}

package com.alten.producttrial.repositories;

import com.alten.producttrial.models.User;
import com.alten.producttrial.models.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishListRepository extends JpaRepository<WishList, Long> {
    Optional<WishList> findByOwner(User owner);
}

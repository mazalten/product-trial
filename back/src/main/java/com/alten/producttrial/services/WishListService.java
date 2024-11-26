package com.alten.producttrial.services;

import com.alten.producttrial.models.Product;
import com.alten.producttrial.models.User;
import com.alten.producttrial.models.WishList;
import com.alten.producttrial.repositories.ProductRepository;
import com.alten.producttrial.repositories.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
public class WishListService {
    @Autowired
    private WishListRepository wishlistRepository;
    @Autowired
    private ProductRepository productRepository;

    public WishList addProductToWishlist(User user, Long productId) {
        WishList wishlist = wishlistRepository.findByOwner(user)
                .orElseGet(() -> new WishList(null, user, new HashSet<>()));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlist.getProducts().add(product);
        return wishlistRepository.save(wishlist);
    }

    public WishList removeProductFromWishlist(User user, Long productId) {
        WishList wishlist = wishlistRepository.findByOwner(user)
                .orElseThrow(() -> new RuntimeException("Wishlist not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlist.getProducts().remove(product);
        return wishlistRepository.save(wishlist);
    }

    public Optional<WishList> getWishlistByUser(User user) {
        return wishlistRepository.findByOwner(user);
    }
}


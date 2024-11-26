package com.alten.producttrial.services;

import com.alten.producttrial.models.Cart;
import com.alten.producttrial.models.Product;
import com.alten.producttrial.models.User;
import com.alten.producttrial.repositories.CartRepository;
import com.alten.producttrial.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;

    public Cart addProductToCart(User user, Long productId) {
        Cart cart = cartRepository.findByOwner(user)
                .orElseGet(() -> new Cart(null, user, new HashSet<>(), 0.0));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cart.getProducts().add(product);
        cart.setTotalPrice(cart.getProducts().stream()
                .mapToDouble(Product::getPrice)
                .sum());

        return cartRepository.save(cart);
    }

    public Cart removeProductFromCart(User user, Long productId) {
        Cart cart = cartRepository.findByOwner(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        cart.getProducts().remove(product);
        cart.setTotalPrice(cart.getProducts().stream()
                .mapToDouble(Product::getPrice)
                .sum());

        return cartRepository.save(cart);
    }

    public Optional<Cart> getCartByUser(User user) {
        return cartRepository.findByOwner(user);
    }
}


package com.alten.producttrial.controllers;

import com.alten.producttrial.models.Cart;
import com.alten.producttrial.models.User;
import com.alten.producttrial.services.CartService;
import com.alten.producttrial.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addProductToCart(@RequestParam Long userId, @PathVariable Long productId) {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Cart updatedCart = cartService.addProductToCart(user, productId);
            return ResponseEntity.ok(updatedCart);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/remove/{productId}")
    public ResponseEntity<?> removeProductFromCart(@RequestParam Long userId, @PathVariable Long productId) {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Cart updatedCart = cartService.removeProductFromCart(user, productId);
            return ResponseEntity.ok(updatedCart);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/")
    public ResponseEntity<?> getCart(@RequestParam Long userId) {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<Cart> optionalCart = cartService.getCartByUser(user);
            if (optionalCart.isPresent()) {
                return ResponseEntity.ok(optionalCart.get());
            }
        }
        return ResponseEntity.notFound().build();
    }
}


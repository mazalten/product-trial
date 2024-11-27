package com.alten.producttrial.controllers;

import com.alten.producttrial.models.Cart;
import com.alten.producttrial.models.User;
import com.alten.producttrial.repositories.UserRepository;
import com.alten.producttrial.services.CartService;
import com.alten.producttrial.services.JwtService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtService jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    // Récupérer le panier de l'utilisateur
    @GetMapping
    public Cart getCart(@RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return cartService.getCartForUser(user);
    }

    // Ajouter un produit au panier
    @PostMapping("/add/{productId}")
    public void addProductToCart(@PathVariable Long productId, @RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        cartService.addProductToCart(user, productId);
    }

    // Supprimer un produit du panier
    @DeleteMapping("/remove/{productId}")
    public void removeProductFromCart(@PathVariable Long productId, @RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        cartService.removeProductFromCart(user, productId);
    }

    // Mettre à jour le panier
    @PostMapping("/update")
    public void updateCart(@RequestBody Cart cart, @RequestHeader("Authorization") String token) {
        String email = jwtTokenProvider.extractEmail(token);
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        cart.setOwner(user);
        cartService.updateCart(cart);
    }
}

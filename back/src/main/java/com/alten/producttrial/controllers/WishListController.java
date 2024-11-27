package com.alten.producttrial.controllers;

import com.alten.producttrial.models.User;
import com.alten.producttrial.models.WishList;
import com.alten.producttrial.services.UserService;
import com.alten.producttrial.services.WishListService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@SecurityRequirement(name = "bearerAuth")
public class WishListController {
    @Autowired
    private WishListService wishlistService;

    @Autowired
    private UserService userService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<WishList> addProductToWishlist(@RequestParam Long userId, @PathVariable Long productId) {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            WishList updatedWishlist = wishlistService.addProductToWishlist(user, productId);
            return ResponseEntity.ok(updatedWishlist);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/remove/{productId}")
    public ResponseEntity<WishList> removeProductFromWishlist(@RequestParam Long userId, @PathVariable Long productId) {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            WishList updatedWishlist = wishlistService.removeProductFromWishlist(user, productId);
            return ResponseEntity.ok(updatedWishlist);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/")
    public ResponseEntity<WishList> getWishlist(@RequestParam Long userId) {
        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            Optional<WishList> optionalWishList = wishlistService.getWishlistByUser(user);
            if (optionalWishList.isPresent()) {
                return ResponseEntity.ok(optionalWishList.get());
            }
        }
        return ResponseEntity.notFound().build();
    }
}


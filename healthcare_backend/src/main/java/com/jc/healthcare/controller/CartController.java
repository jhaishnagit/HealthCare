package com.jc.healthcare.controller;

import com.jc.healthcare.dto.AddToCartRequest;
import com.jc.healthcare.dto.CartItemResponse;
import com.jc.healthcare.model.CustomerCart;
import com.jc.healthcare.model.CustomerCartItem;
import com.jc.healthcare.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

   
    // ADD ITEM TO CART
    @PostMapping("/add")
    public CustomerCartItem addToCart(@RequestBody AddToCartRequest request) {

        return cartService.addItem(
                request.getUserId(),
                request.getMedicineId(),
                request.getQty(),
                request.getPrice()
        );
    }



    // UPDATE QUANTITY
    @PutMapping("/update/{itemId}")
    public CustomerCartItem updateQuantity(
            @PathVariable Long itemId,
            @RequestParam int qty) {

        return cartService.updateQuantity(itemId, qty);
    }

    // REMOVE ITEM
    @DeleteMapping("/remove/{itemId}")
    public String removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return "Item removed";
    }

    // CLEAR CART
    @DeleteMapping("/clear/{userId}")
    public String clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return "Cart cleared";
    }
    @GetMapping("/count/{userId}")
    public int getCartCount(@PathVariable Long userId) {
        return cartService.getCartItemCount(userId);
    }
    @GetMapping("/items/{userId}")
    public List<CartItemResponse> getCartItems(@PathVariable Long userId) {
        return cartService.getCartItemsWithDetails(userId);
    }
}

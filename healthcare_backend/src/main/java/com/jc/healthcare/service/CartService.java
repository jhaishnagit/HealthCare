package com.jc.healthcare.service;

import com.jc.healthcare.dto.CartItemResponse;
import com.jc.healthcare.model.CustomerCart;
import com.jc.healthcare.model.CustomerCartItem;
import com.jc.healthcare.model.User;
import com.jc.healthcare.repository.CustomerCartItemRepository;
import com.jc.healthcare.repository.CustomerCartRepository;
import com.jc.healthcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CustomerCartRepository cartRepository;

    @Autowired
    private CustomerCartItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    public CustomerCart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {

                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    CustomerCart cart = new CustomerCart();
                    cart.setUser(user); // ✅ FIXED

                    return cartRepository.save(cart);
                });
    }

    public CustomerCartItem addItem(Long userId, Long itemId, int qty, double price) {
        CustomerCart cart = getOrCreateCart(userId);

        return itemRepository
                .findByCartCartIdAndItemId(cart.getCartId(), itemId)
                .map(existingItem -> {
                    existingItem.setQuantity(existingItem.getQuantity() + qty);
                    return itemRepository.save(existingItem);
                })
                .orElseGet(() -> {
                    CustomerCartItem item = new CustomerCartItem();
                    item.setCart(cart);
                    item.setItemId(itemId);
                    item.setQuantity(qty);
                    item.setPriceAtAdd(price);
                    return itemRepository.save(item);
                });
    }


    public List<CustomerCartItem> getCartItems(Long userId) {
        CustomerCart cart = getOrCreateCart(userId);
        return itemRepository.findByCartCartId(cart.getCartId());
    }

    public CustomerCartItem updateQuantity(Long itemId, int qty) {
        CustomerCartItem item = itemRepository.findById(itemId).orElseThrow();
        item.setQuantity(qty);
        return itemRepository.save(item);
    }

    public void removeItem(Long itemId) {
        itemRepository.deleteById(itemId);
    }

    public void clearCart(Long userId) {
        CustomerCart cart = getOrCreateCart(userId);
        itemRepository.deleteByCartCartId(cart.getCartId());
    }
   
 // ✅ Cart count
    public int getCartItemCount(Long userId) {
        CustomerCart cart = getOrCreateCart(userId);
        return itemRepository.countByCartCartId(cart.getCartId());
    }

    // ✅ Cart items with medicine details
    public List<CartItemResponse> getCartItemsWithDetails(Long userId) {
        CustomerCart cart = getOrCreateCart(userId);
        return itemRepository.findCartItemsWithMedicine(cart.getCartId());
    }


}

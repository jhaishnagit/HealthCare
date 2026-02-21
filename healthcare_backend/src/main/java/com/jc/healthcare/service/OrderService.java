package com.jc.healthcare.service;

import com.jc.healthcare.model.CustomerAddress;
import com.jc.healthcare.model.CustomerCartItem;
import com.jc.healthcare.model.CustomerOrder;
import com.jc.healthcare.model.CustomerOrderItem;
import com.jc.healthcare.model.User;
import com.jc.healthcare.repository.CustomerAddressRepository;
import com.jc.healthcare.repository.CustomerCartItemRepository;
import com.jc.healthcare.repository.CustomerOrderItemRepository;
import com.jc.healthcare.repository.CustomerOrderRepository;
import com.jc.healthcare.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private CustomerOrderRepository orderRepository;

    @Autowired
    private CustomerOrderItemRepository orderItemRepository;

    @Autowired
    private CustomerCartItemRepository cartItemRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerAddressRepository addressRepository;

    @Transactional
    public CustomerOrder placeOrder(Long userId) {

        // 1. Fetch User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // 2. Fetch default address
        CustomerAddress address = addressRepository.findByUserIdAndIsDefault(userId, 1);
        if (address == null) {
            throw new RuntimeException("No default address found for user: " + userId);
        }

        // 3. Create ORDER
        CustomerOrder order = new CustomerOrder();
        order.setUserId(userId);
        order.setAddressId(address.getAddressId());
        order.setOrderStatus("CREATED");
        order.setPaymentStatus("PENDING");
        order.setOrderDate(new Date());
        order.setUpdatedOn(new Date());

        // 🔥 IMPORTANT: SAVE ORDER FIRST
        order = orderRepository.save(order);

        // 4. Fetch cart items
        List<CustomerCartItem> cartItems = cartService.getCartItems(userId);
        double totalAmount = 0;

        // 5. Create ORDER ITEMS
        for (CustomerCartItem cartItem : cartItems) {

            CustomerOrderItem orderItem = new CustomerOrderItem();
            orderItem.setOrder(order);              // ✅ order now has ORDER_ID
            orderItem.setProductId(cartItem.getItemId());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPricePerUnit(cartItem.getPriceAtAdd());

            double subtotal = cartItem.getQuantity() * cartItem.getPriceAtAdd();
            orderItem.setSubtotal(subtotal);

            totalAmount += subtotal;

            orderItemRepository.save(orderItem);   // ✅ safe now
        }

        // 6. Update total
        order.setTotalAmount(totalAmount);
        order.setUpdatedOn(new Date());
        orderRepository.save(order);

        // 7. Clear cart
        cartService.clearCart(userId);

        return order;
    }

    /**
     * Fetch a single order
     */
    public CustomerOrder getOrder(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    /**
     * Fetch all orders for a customer
     */
    public List<CustomerOrder> getOrderHistory(Long userId) {
        return orderRepository.findByUserId(userId);
    }
   
    public List<CustomerOrder> getOrdersByShop(Long shopId) {
        return orderRepository.findByUserId(shopId);
    }

    @Transactional
    public CustomerOrder confirmOrder(Long orderId) {

        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentStatus("SUCCESS");
        order.setOrderStatus("CONFIRMED");

        order.setUpdatedOn(new Date());

        return orderRepository.save(order);
    }
    public CustomerOrder updateOrderStatus(Long orderId, String status) {

        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setOrderStatus(status);
        order.setUpdatedOn(new Date());

        return orderRepository.save(order);
    }

}

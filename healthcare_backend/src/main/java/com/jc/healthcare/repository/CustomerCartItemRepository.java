package com.jc.healthcare.repository;

import com.jc.healthcare.dto.CartItemResponse;
import com.jc.healthcare.model.CustomerCartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CustomerCartItemRepository extends JpaRepository<CustomerCartItem, Long> {

    List<CustomerCartItem> findByCartCartId(Long cartId);

    Optional<CustomerCartItem> findByCartCartIdAndItemId(Long cartId, Long itemId);

    void deleteByCartCartId(Long cartId);
    int countByCartCartId(Long cartId);
    @Query("""
    	    SELECT new com.jc.healthcare.dto.CartItemResponse(
    	        ci.cartItemId,
    	        ci.itemId,
    	        m.medicineName,
    	        m.imageUrl,
    	        ci.quantity,
    	        ci.priceAtAdd,
    	        (ci.quantity * ci.priceAtAdd)
    	    )
    	    FROM CustomerCartItem ci
    	    JOIN Medicine m ON m.id = ci.itemId
    	    WHERE ci.cart.cartId = :cartId
    	""")
    	List<CartItemResponse> findCartItemsWithMedicine(@Param("cartId") Long cartId);


}

import { useEffect, useState } from "react";
import { CartAPI } from "../../../services/api";
import "../MedicineStyling/CartModal.css";

function CartModal({ open, onClose }) {
  const [items, setItems] = useState([]);

  const groupedItems = Object.values(
  items.reduce((acc, item) => {
    if (!acc[item.itemId]) {
      acc[item.itemId] = {
        ...item,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      };
    } else {
      acc[item.itemId].quantity += item.quantity;
      acc[item.itemId].totalPrice += item.totalPrice;
    }
    return acc;
  }, {})
);

  const userId = 10;

  useEffect(() => {
    if (open) {
      CartAPI.getCartItems(userId)
        .then((res) => {
          setItems(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to load cart items", err);
        });
    }
  }, [open]);

  if (!open) return null;

  const total = items.reduce(
    (sum, item) => sum + (item.totalPrice || 0),
    0
  );

  const btnStyle = {
  padding: "4px 10px",
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

// ➕ Increase quantity (ADD one row)
const increaseQty = (item) => {
  CartAPI.addToCart({
    userId,
    medicineId: item.itemId,
    qty: 1,
    price: item.price,
  })
    .then(() => {
      setItems((prev) => [
        ...prev,
        {
          ...item,
          quantity: 1,
          totalPrice: item.price,
        },
      ]);
    })
    .catch(() => {
      alert("Failed to increase quantity");
    });
};

// ➖ Decrease quantity (backend removes ONE row by itemId)
const decreaseQty = (item) => {
  CartAPI.removeOne(item.itemId)
    .then(() => CartAPI.getCartItems(userId))
    .then((res) => setItems(res.data || []))
    .catch((err) => {
      console.error("Decrease failed:", err);
    });
};




// 🗑️ Remove item completely (remove all quantities)
const removeItem = async (itemId) => {
  try {
    // call backend remove
    await CartAPI.removeItem(itemId);

    // refresh cart from backend
    const res = await CartAPI.getCartItems(userId);
    setItems(res.data || []);
  } catch (err) {
    console.error("Remove item failed", err);
  }
};








 return (
  <>
    {open && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        {/* BACKDROP */}
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
          }}
        />

        {/* MODAL CONTENT */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            padding: "25px",
            width: "500px",
            borderRadius: "10px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h3>Shopping Cart</h3>

          {items.length === 0 ? (
  <p>Your cart is empty</p>
) : (
  <>
    {/* SCROLLABLE CART ITEMS */}
    <div className="cart-items-scroll">
      {groupedItems.map((item) => (
        <div key={item.itemId} className="cart-item">
          <img
            src={item.imageUrl || "https://via.placeholder.com/60"}
            alt={item.medicineName}
            className="cart-img"
          />

          <div className="cart-info">
            <strong>{item.medicineName}</strong>

            <div className="qty-controls">
              <button onClick={(e) => { e.stopPropagation(); decreaseQty(item); }}>-</button>
              <span>{item.quantity}</span>
              <button onClick={(e) => { e.stopPropagation(); increaseQty(item); }}>+</button>
            </div>

            <p className="price">₹{item.totalPrice}</p>
          </div>

          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              removeItem(item.itemId);
            }}
          >
            🗑️
          </button>
        </div>
      ))}
    </div>

    {/* TOTAL */}
    <h4 className="cart-total">Total: ₹{total}</h4>
  </>
)}


          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "10px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              marginTop: "10px",
            }}
          >
            Close
          </button>
        </div>
      </div>
    )}
  </>
);

}

export default CartModal;

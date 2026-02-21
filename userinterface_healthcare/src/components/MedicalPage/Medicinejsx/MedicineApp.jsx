// import React, { useState } from "react";
import MedicineNavbar from "./MedicineNavbar";
import MedicinePage from "./MedicinePage";
import CartModal from "./CartModal";
import AddCartModal from "./AddCartModal";
import { CartAPI } from "../../../services/api";
import { useEffect, useState } from "react";



export default function MedicineApp() {
  const userId = 10; // ✅ define userId
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAddCartModal, setShowAddCartModal] = useState(false);
  const [addCartMessage, setAddCartMessage] = useState("");

  console.log("STEP 1: MedicineApp is running");  


  useEffect(() => {
  CartAPI.getCartItems(userId)
    .then((res) => {
      const backendItems = res.data || [];

      const normalizedCart = backendItems.map((item) => ({
        id: item.itemId,
        medicineName: item.medicineName,
        qty: item.quantity,
        price: item.price,
      }));

      setCart(normalizedCart);
    })
    .catch((err) => {
      console.error("Failed to load cart on startup", err);
    });
}, []);

 // ✅ openCart function
  const openCart = () => {
    setShowCart(true);
  };
  const addToCart = (item) => {
  setCart((prev) => {
    const existing = prev.find((p) => p.id === item.id);

    if (existing) {
      return prev.map((p) =>
        p.id === item.id ? { ...p, qty: p.qty + 1 } : p
      );
    }

    return [...prev, { ...item, qty: 1 }];
  });
};



const cartCount = cart.reduce(
  (sum, item) => sum + item.qty,
  0
);


  return (
    <>
      {/* ✅ ONLY ONE NAVBAR */}
     <MedicineNavbar
  openCart={openCart}
  cartCount={cartCount}
/>



      <MedicinePage addToCart={addToCart} />

      <CartModal
        open={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
      />

      <AddCartModal
        open={showAddCartModal}
        message={addCartMessage}
        onClose={() => setShowAddCartModal(false)}
      />
    </>
  );
}

// Main App Component
// export default function MedicineApp() {
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [showAddCartModal, setShowAddCartModal] = useState(false);
//   const [addCartMessage, setAddCartMessage] = useState("");

//   const addToCart = (item) => {
//     setCart([...cart, item]);
//     setAddCartMessage(`${item.name || item.medicineName} added to cart!`);
//     setShowAddCartModal(true);
//     setTimeout(() => setShowAddCartModal(false), 2000);
//   };

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif' }}>
     
//       <MedicinePage addToCart={addToCart} />
//       <CartModal 
//         open={showCart} 
//         onClose={() => setShowCart(false)} 
//         cart={cart} 
//       />
//       <AddCartModal 
//         open={showAddCartModal} 
//         message={addCartMessage} 
//         onClose={() => setShowAddCartModal(false)} 
//       />
//     </div>
//   );
// }
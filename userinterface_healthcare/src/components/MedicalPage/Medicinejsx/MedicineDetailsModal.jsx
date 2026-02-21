// MedicineDetailsModal.jsx
import React, { useState } from "react";

function MedicineDetailsModal({ details, reviews, onClose, onAddReview, onAddToCart }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const {
    medicine,
    avgRating,
    ratingCount,
    soldQty,
    orderCount,
    similarMedicines
  } = details;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: 20
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 10,
          maxWidth: 900,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 30
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>{medicine.medicineName}</h2>
          <button onClick={onClose} style={{ fontSize: 22 }}>×</button>
        </div>

        {/* DETAILS LEFT – IMAGE RIGHT */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 30,
            marginTop: 20
          }}
        >
          {/* LEFT */}
          <div>
            <p>{medicine.description}</p>

            <h2 style={{ color: "#4CAF50" }}>
              ₹{medicine.pricePerUnit}
            </h2>

            <p>
              ⭐ {avgRating?.toFixed(1)} ({ratingCount})
            </p>

            <p>
              <strong>Sold:</strong> {soldQty} &nbsp;
              <strong>Orders:</strong> {orderCount}
            </p>

            <button
              onClick={() =>
                onAddToCart({
                  id: medicine.id,
                  medicineName: medicine.medicineName,
                  price: medicine.pricePerUnit
                })
              }
              style={{
                width: "100%",
                padding: 14,
                background: "#4CAF50",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                fontWeight: "bold"
              }}
            >
              ADD TO CART
            </button>
          </div>

          {/* RIGHT */}
          <div>
            {medicine.imageUrl ? (
              <img
                src={medicine.imageUrl}
                alt={medicine.medicineName}
                style={{ width: "100%", objectFit: "contain" }}
              />
            ) : (
              <div>No Image</div>
            )}
          </div>
        </div>

        {/* Similar Medicines */}
        {similarMedicines?.length > 0 && (
          <>
            <h3 style={{ marginTop: 30 }}>Similar Medicines</h3>
            <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
              {similarMedicines.map((sim) => (
                <div key={sim.id} style={{ minWidth: 150 }}>
                  {sim.medicineName}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MedicineDetailsModal;

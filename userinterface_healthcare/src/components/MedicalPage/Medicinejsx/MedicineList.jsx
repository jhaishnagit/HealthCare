import React, { useState, useEffect } from 'react';
import { MedicineAPI } from '../../../services/api';
import { CartAPI } from "../../../services/api";


// Medicine List with Pagination
function MedicineList({ addToCart }) {
  console.log("STEP 3: MedicineList got addToCart:", addToCart);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination & Filters
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [size] = useState(12);
  
  // Search & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("medicineName");
  const [direction, setDirection] = useState("asc");
  
  // Selected Medicine Details
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineDetails, setMedicineDetails] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch Medicines
  const fetchMedicines = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size,
        sortBy,
        direction,
      };
      
      if (searchQuery.trim()) {
        params.q = searchQuery.trim();
      }
      
      const response = await MedicineAPI.getGlobalMedicines(params);
      const data = response.data;
      
      setMedicines(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError("Failed to load medicines. Please try again.");
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [page, sortBy, direction, searchQuery]);

  // Handle Search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset to first page
  };

  // Handle Sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setDirection("asc");
    }
    setPage(0);
  };

  // View Medicine Details
 const viewDetails = async (medicineId, organizationId) => {
  try {
    const response =
      await MedicineAPI.getMedicineOrgDetails(medicineId, organizationId);

    setMedicineDetails(response.data);
    setReviews(response.data.reviews || []);
    setSelectedMedicine(medicineId);

  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Failed to load medicine details");
  }
};



  // Add Review
  const addReview = async (rating, comment) => {
    try {
      const userId = 10; // Replace with actual logged-in user ID
      await MedicineAPI.addReview(selectedMedicine, { userId, rating, comment });
      
      // Refresh reviews
      const reviewsResponse = await MedicineAPI.getReviews(selectedMedicine);
      setReviews(reviewsResponse.data || []);
      
      alert("Review added successfully!");
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review");
    }
  };

  return (
    <section>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>All Medicines & Essentials</h2>
      
      {/* Search & Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        />
        
        <select 
          value={sortBy} 
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(0);
          }}
          style={{
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          <option value="medicineName">Name</option>
          <option value="pricePerUnit">Price</option>
          <option value="category">Category</option>
        </select>
        
        <button
          onClick={() => handleSort(sortBy)}
          style={{
            padding: '12px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {direction === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
        
        <span style={{ marginLeft: 'auto', color: '#666' }}>
          Total: {totalElements} medicines
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px' }}>⏳</div>
          <p>Loading medicines...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Medicine Grid */}
      {!loading && !error && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {medicines.map((medicine) => (
              <div key={medicine.id} style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '15px',
                background: 'white',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div onClick={() => viewDetails(medicine.id, medicine.organizationId)}>
                  {medicine.imageUrl ? (
                    <img 
                      src={medicine.imageUrl} 
                      alt={medicine.medicineName}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'contain',
                        marginBottom: '10px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '150px',
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px',
                      borderRadius: '5px'
                    }}>
                      No Image
                    </div>
                  )}
                  
                  <h3 style={{ 
                    fontSize: '16px', 
                    margin: '0 0 8px 0',
                    height: '40px',
                    overflow: 'hidden'
                  }}>
                    {medicine.medicineName}
                  </h3>
                  
                  <p style={{ 
                    color: '#666', 
                    fontSize: '14px',
                    margin: '5px 0'
                  }}>
                    {medicine.category}
                  </p>
                  
                  <p style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: '#4CAF50',
                    margin: '10px 0'
                  }}>
                    ₹{medicine.pricePerUnit}
                  </p>
                </div>
                
                <button
  onClick={() => viewDetails(medicine.id, medicine.organizationId)}
  style={{
    width: '100%',
    padding: '10px',
    background: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  }}
>
  VIEW DETAILS
</button>



              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              alignItems: 'center',
              marginTop: '30px'
            }}>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                style={{
                  padding: '10px 20px',
                  background: page === 0 ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ← Previous
              </button>
              
              <span style={{ padding: '0 15px', fontWeight: 'bold' }}>
                Page {page + 1} of {totalPages}
              </span>
              
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                style={{
                  padding: '10px 20px',
                  background: page >= totalPages - 1 ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Medicine Details Modal */}
      {selectedMedicine && medicineDetails && (
        <MedicineDetailsModal
          details={medicineDetails}
          reviews={reviews}
          onClose={() => {
            setSelectedMedicine(null);
            setMedicineDetails(null);
            setReviews([]);
          }}
          onAddReview={addReview}
          onAddToCart={(item) => {
            addToCart(item);
            setSelectedMedicine(null);
            setMedicineDetails(null);
          }}
        />
      )}
    </section>
  );
}


// Medicine Details Modal
function MedicineDetailsModal({ details, reviews, onClose, onAddReview, onAddToCart }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { medicine, avgRating, ratingCount, soldQty, orderCount, similarMedicines } = details;

  return (
    <div onClick={onClose} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'white',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{medicine.medicineName}</h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer'
          }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            {medicine.imageUrl && (
              <img src={medicine.imageUrl} alt={medicine.medicineName} style={{
                width: '100%',
                height: '300px',
                objectFit: 'contain',
                border: '1px solid #ddd',
                borderRadius: '5px'
              }} />
            )}
          </div>
          
          <div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {medicine.description}
            </p>
            
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50', margin: '15px 0' }}>
              ₹{medicine.pricePerUnit}
            </p>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div>
                <strong>Rating:</strong> ⭐ {avgRating?.toFixed(1) || 'N/A'} ({ratingCount})
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div><strong>Sold:</strong> {soldQty}</div>
              <div><strong>Orders:</strong> {orderCount}</div>
            </div>
            
            <button onClick={() => onAddToCart({
              id: medicine.id,
              medicineName: medicine.medicineName,
              price: medicine.pricePerUnit
            })} style={{
              width: '100%',
              padding: '15px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Similar Medicines */}
        {similarMedicines && similarMedicines.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3>Similar Medicines</h3>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
              {similarMedicines.map(sim => (
                <div key={sim.id} style={{
                  minWidth: '150px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  textAlign: 'center'
                }}>
                  {sim.medicineName}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div style={{ marginTop: '30px' }}>
          <h3>Customer Reviews ({reviews.length})</h3>
          
          {/* Add Review Form */}
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h4>Write a Review</h4>
            <div style={{ marginBottom: '10px' }}>
              <label>Rating: </label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid #ddd'
              }}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}
              </select>
            </div>
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                marginBottom: '10px'
              }}
            />
            
            <button onClick={() => {
              if (comment.trim()) {
                onAddReview(rating, comment);
                setComment("");
              }
            }} style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Submit Review
            </button>
          </div>

          {/* Reviews List */}
          <div>
            {reviews.map((review, idx) => (
              <div key={idx} style={{
                borderBottom: '1px solid #eee',
                padding: '15px 0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong>User {review.userId}</strong>
                  <span style={{ color: '#666', fontSize: '14px' }}>{review.createdAt}</span>
                </div>
                <div style={{ color: '#FFB400', marginBottom: '5px' }}>
                  {'⭐'.repeat(review.rating)}
                </div>
                <p style={{ margin: 0 }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

}


export default MedicineList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./../styles/ReviewListPage.css";
import { FaSearch, FaUserCircle, FaFilter } from "react-icons/fa";

const ReviewListPage = () => {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        comment: '',
        rating: 1
    });

    useEffect(() => {
        // Get and decode token
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
                setIsAdmin(decodedToken.role === 'admin');
                setUserId(decodedToken.id); // JWT usually contains user ID
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }

        const fetchReviews = async() => {
            try {
                const response = await axios.get("http://localhost:5000/api/reviews");
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, []);

    const canModifyReview = (review) => {
        if (!userId) return false;
        return isAdmin || (userRole === 'customer' && review.userId === userId);
    };

    const handleDelete = async(id) => {
        if (!isAdmin && !canModifyReview(reviews.find(review => review._id === id))) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setReviews(reviews.filter((review) => review._id !== id));
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const handleEdit = (review) => {
        if (!isAdmin && !canModifyReview(review)) return;
        setEditingReview(review);
        setEditForm({
            comment: review.comment,
            rating: review.rating
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:5000/api/reviews/${editingReview._id}`,
                editForm,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setReviews(reviews.map(review => 
                review._id === editingReview._id ? response.data.review : review
            ));
            setShowEditModal(false);
            setEditingReview(null);
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    const filteredReviews = reviews.filter((review) =>
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="review-list-container">
            <header>
                <h2>Review List</h2>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input 
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaFilter className="filter-icon" />
                </div>
            </header>

            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Edit Review</h3>
                        <textarea
                            value={editForm.comment}
                            onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                            placeholder="Update your review"
                        />
                        <select
                            value={editForm.rating}
                            onChange={(e) => setEditForm({...editForm, rating: Number(e.target.value)})}
                        >
                            {[1,2,3,4,5].map(num => (
                                <option key={num} value={num}>{num} Stars</option>
                            ))}
                        </select>
                        <div className="modal-actions">
                            <button onClick={handleUpdate}>Save</button>
                            <button onClick={() => setShowEditModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="reviews-grid">
                {filteredReviews.map((review) => (
                    <div key={review._id} className="review-card">
                        <div className="review-header">
                            <FaUserCircle className="profile-icon" />
                            <h3>{review.userName}</h3>
                        </div>
                        <div className="review-rating">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        {canModifyReview(review) && (
                            <div className="review-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleEdit(review)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(review._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewListPage;
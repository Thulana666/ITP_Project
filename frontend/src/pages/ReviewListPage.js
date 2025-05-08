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
        title: '',
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
        return review.userId === userId;  // Only allow editing if it's the user's own review
    };

    const canDeleteReview = (review) => {
        if (!userId) return false;
        return isAdmin || review.userId === userId;  // Allow deletion for admins or review owner
    };

    const handleDelete = async(id) => {
        const review = reviews.find(review => review._id === id);
        if (!canDeleteReview(review)) {
            return;
        }
        
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
        if (!canModifyReview(review)) return;
        setEditingReview(review);
        setEditForm({
            title: review.title || '',
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

    // Add this function to get the correct image URL
    const getImageUrl = (imageName) => {
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imageName}`;
    };

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
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            placeholder="Review Title"
                            className="edit-title-input"
                        />
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
                        {review.title && (
                            <h4 className="review-title">{review.title}</h4>
                        )}
                        {review.images && review.images[0] && (
                            <img 
                                src={getImageUrl(review.images[0])}
                                alt="Review"
                                className="review-image"
                                onError={(e) => {
                                    console.error("Image failed to load:", e.target.src);
                                    e.target.style.display = 'none';
                                }}
                            />
                        )}
                        <div className="review-rating">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        <div className="review-dates">
                            <p className="event-date">
                                Event Date: {new Date(review.eventDate).toLocaleDateString()}
                            </p>
                            <p className="review-date">
                                Posted on: {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        {(canModifyReview(review) || canDeleteReview(review)) && (
                            <div className="review-actions">
                                {canModifyReview(review) && (
                                    <button 
                                        className="edit-btn"
                                        onClick={() => handleEdit(review)}
                                    >
                                        Edit
                                    </button>
                                )}
                                {canDeleteReview(review) && (
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(review._id)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewListPage;
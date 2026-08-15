import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import samsungS24 from "./assets/samsung-s24.jpg";
import "./App.css";

const products = [
  { id: 1, name: "Samsung Galaxy S24", category: "Mobiles", price: 54999, rating: 4.5, emoji: "📱", image: samsungS24, description: "Experience stunning visuals with Samsung's latest flagship. 120Hz display, powerful processor, and all-day battery life. Perfect for gaming and photography." },
  { id: 2, name: "iPhone 15", category: "Mobiles", price: 59999, rating: 4.7, emoji: "📱", description: "The ultimate iPhone. A14 Bionic chip, advanced camera system, and titanium design. Seamlessly integrated with Apple ecosystem." },
  { id: 3, name: "OnePlus 12", category: "Mobiles", price: 64999, rating: 4.6, emoji: "📱", description: "Speed meets power. Snapdragon 8 Gen 3 processor, 120W fast charging, and stunning AMOLED display. Built for performance." },
  { id: 4, name: "Redmi Note 14", category: "Mobiles", price: 16999, rating: 4.3, emoji: "📱", description: "Budget-friendly powerhouse. Great battery life, solid camera, and smooth performance for everyday use." },
  { id: 5, name: "HP Pavilion Laptop", category: "Laptops", price: 62999, rating: 4.4, emoji: "💻", description: "Perfect for professionals. 16GB RAM, 512GB SSD, Intel i5 processor. Lightweight and portable with excellent build quality." },
  { id: 6, name: "Dell Inspiron 15", category: "Laptops", price: 55999, rating: 4.3, emoji: "💻", description: "Reliable performance for work and play. 8GB RAM, 256GB SSD, and smooth graphics. Long battery life." },
  { id: 7, name: "MacBook Air M3", category: "Laptops", price: 99999, rating: 4.8, emoji: "💻", description: "The ultimate ultrabook. M3 chip, stunning Retina display, all-day battery. Perfectly designed for creative professionals." },
  { id: 8, name: "Lenovo IdeaPad", category: "Laptops", price: 44999, rating: 4.2, emoji: "💻", description: "Value-for-money laptop. Core i5 processor, 8GB RAM, ideal for students and casual users. Lightweight design." },
  { id: 9, name: "Sony Wireless Headphones", category: "Electronics", price: 7999, rating: 4.5, emoji: "🎧", description: "Premium sound quality with noise cancellation. Comfortable fit, 30-hour battery life, and fast charging." },
  { id: 10, name: "Boat Bluetooth Speaker", category: "Electronics", price: 1999, rating: 4.2, emoji: "🔊", description: "Portable and powerful. Deep bass, waterproof design, 8-hour battery. Perfect for parties and outdoor activities." },
  { id: 11, name: "Apple AirPods", category: "Electronics", price: 12999, rating: 4.6, emoji: "🎧", description: "Seamless connectivity with Apple devices. Active noise cancellation, spatial audio, and premium build quality." },
  { id: 12, name: "Samsung Smart Watch", category: "Electronics", price: 8999, rating: 4.4, emoji: "⌚", description: "Stay connected on your wrist. Health tracking, bright AMOLED display, water-resistant, and long battery life." },
  { id: 13, name: "Men's Casual Shirt", category: "Fashion", price: 899, rating: 4.1, emoji: "👕", description: "Comfortable and stylish casual shirt. 100% cotton, perfect for everyday wear. Available in multiple colors." },
  { id: 14, name: "Women's Kurti", category: "Fashion", price: 1299, rating: 4.3, emoji: "👗", description: "Traditional meets modern. Elegant kurti with embroidery details. Comfortable fit for all body types." },
  { id: 15, name: "Men's Running Shoes", category: "Footwear", price: 1799, rating: 4.2, emoji: "👟", description: "Engineered for performance. Cushioned sole, breathable mesh, perfect for running and sports activities." },
  { id: 16, name: "Women's Sneakers", category: "Footwear", price: 2299, rating: 4.4, emoji: "👟", description: "Stylish and comfortable sneakers. Durable design, cushioned insoles, ideal for casual wear and workouts." },
  { id: 17, name: "Smart LED TV 43 inch", category: "TV & Appliances", price: 28999, rating: 4.5, emoji: "📺", description: "Crystal clear 4K display with HDR support. Smart TV with built-in apps, immersive sound system." },
  { id: 18, name: "LG Washing Machine", category: "TV & Appliances", price: 32999, rating: 4.4, emoji: "🧺", description: "Efficient and reliable. Automatic wash cycles, large capacity, energy-saving technology. Quiet operation." },
  { id: 19, name: "Air Fryer", category: "Home & Kitchen", price: 3999, rating: 4.3, emoji: "🍳", description: "Healthy cooking made easy. Air fry, bake, and roast. Quick preheat, dishwasher-safe basket." },
  { id: 20, name: "Mixer Grinder", category: "Home & Kitchen", price: 2499, rating: 4.2, emoji: "🥤", description: "Powerful motor for grinding and mixing. Multiple jars, stainless steel blades, compact design." },
  { id: 21, name: "PlayStation 5", category: "Gaming", price: 49999, rating: 4.8, emoji: "🎮", description: "Next-gen gaming console. Ultra-fast SSD, stunning graphics, backward compatible with PS4 games." },
  { id: 22, name: "Gaming Keyboard", category: "Gaming", price: 2499, rating: 4.4, emoji: "⌨️", description: "Mechanical gaming keyboard. RGB lighting, responsive keys, programmable buttons for competitive gaming." },
  { id: 23, name: "Wireless Gaming Mouse", category: "Gaming", price: 1499, rating: 4.3, emoji: "🖱️", description: "Precision gaming mouse. High DPI sensor, wireless with low latency, ergonomic design." },
  { id: 24, name: "The Psychology of Money", category: "Books", price: 399, rating: 4.7, emoji: "📚", description: "Bestselling personal finance book. Learn practical money management tips and investment strategies." },
];

const categories = [
  "All",
  "Mobiles",
  "Laptops",
  "Electronics",
  "Fashion",
  "Footwear",
  "TV & Appliances",
  "Home & Kitchen",
  "Gaming",
  "Books",
];

const initialReviews = [
  { id: 1, productId: 1, name: "Rahul", rating: 5, comment: "Excellent phone! The camera quality is amazing and the display is stunning.", date: "10 Aug 2026" },
  { id: 2, productId: 1, name: "Priya", rating: 4, comment: "Great value for money. Battery lasts all day. Highly recommended!", date: "5 Aug 2026" },
  { id: 3, productId: 2, name: "Amit", rating: 5, comment: "Best iPhone ever! Super fast and the camera is incredible.", date: "2 Aug 2026" },
  { id: 4, productId: 7, name: "Sneha", rating: 5, comment: "The MacBook is perfect for my work. Lightweight and extremely fast.", date: "28 Jul 2026" },
  { id: 5, productId: 21, name: "Vikram", rating: 5, comment: "PS5 is a beast! Loading times are almost zero. Worth every rupee.", date: "15 Jul 2026" },
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailsQuantity, setDetailsQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    mobile: "",
    pincode: "",
    house: "",
    city: "",
    state: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [showMyOrders, setShowMyOrders] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState(() => {
    try {
      const savedReviews = localStorage.getItem("shopeasy_reviews");
      return savedReviews ? JSON.parse(savedReviews) : initialReviews;
    } catch {
      return initialReviews;
    }
  });
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 0,
    comment: "",
  });
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewError, setReviewError] = useState("");

  // Filter & Sort State
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // Chatbot State
  const [showChatBot, setShowChatBot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! 👋 I'm ShopEasy AI. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  // Persist reviews to localStorage
  useEffect(() => {
    localStorage.setItem("shopeasy_reviews", JSON.stringify(reviews));
  }, [reviews]);

  // Keep login state in sync with Firebase Auth session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || "");
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    });
    return unsubscribe;
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    const matchesPrice =
      (appliedMinPrice === "" ||
        product.price >= Number(appliedMinPrice)) &&
      (appliedMaxPrice === "" ||
        product.price <= Number(appliedMaxPrice));

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "4" && product.rating >= 4) ||
      (ratingFilter === "3" && product.rating >= 3);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating-high":
        return b.rating - a.rating;
      case "name-az":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const applyPriceFilter = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setRatingFilter("all");
    setSortBy("relevance");
  };

  // Reviews Helpers
  const getProductReviews = (productId) =>
    reviews.filter((review) => review.productId === productId);

  const getAverageRating = (product) => {
    const productReviews = getProductReviews(product.id);
    if (productReviews.length === 0) return product.rating;
    const total = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return Math.round((total / productReviews.length) * 10) / 10;
  };

  const getReviewCount = (productId) =>
    getProductReviews(productId).length;

  const renderStars = (rating) => {
    const filled = Math.round(rating);
    return "★".repeat(filled) + "☆".repeat(5 - filled);
  };

  const addToCart = (product) => {
    setCart((oldCart) => {
      const existing = oldCart.find((item) => item.id === product.id);

      if (existing) {
        return oldCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...oldCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((oldCart) =>
      oldCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((oldCart) => oldCart.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Validation functions
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignupMode) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (validateForm()) {
      setSubmitting(true);
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        setIsLoggedIn(true);
        setUserEmail(formData.email);
        setShowLogin(false);
        setFormData({ email: "", password: "", confirmPassword: "" });
        setErrors({});
      } catch (error) {
        setAuthError(getAuthErrorMessage(error));
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (validateForm()) {
      setSubmitting(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Save the user's profile to Firestore using the Auth UID as the
        // document ID. Wrapped in its own try/catch so a profile-save failure
        // doesn't roll back the successfully created account, while still
        // surfacing the error through the existing authError UI.
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: formData.email,
            name: formData.name || "",
            createdAt: new Date(),
          });
        } catch (err) {
          console.error("Firestore profile save failed:", err);
          setAuthError(
            "Account created, but saving your profile failed. Please try again."
          );
        }

        setIsLoggedIn(true);
        setUserEmail(formData.email);
        setShowLogin(false);
        setFormData({ email: "", password: "", confirmPassword: "" });
        setErrors({});
      } catch (error) {
        setAuthError(getAuthErrorMessage(error));
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      setIsLoggedIn(false);
      setUserEmail("");
    }
  };

  const getAuthErrorMessage = (error) => {
    const code = error?.code;
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Invalid email or password";
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/weak-password":
        return "Password is too weak";
      case "auth/invalid-email":
        return "Please enter a valid email";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      case "auth/operation-not-allowed":
        return "Email/Password sign-in is not enabled for this project";
      case "auth/invalid-api-key":
      case "auth/api-key-not-valid":
        return "Firebase API key is invalid. Check the config in src/firebase.js";
      case "auth/unauthorized-domain":
        return "This domain is not authorized. Add it in Firebase console > Authentication > Settings";
      default:
        // Show the real Firebase error so the actual cause is visible
        return error?.message || "Authentication failed. Please try again";
    }
  };

  const openLoginModal = () => {
    setShowLogin(true);
    setIsSignupMode(false);
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({});
    setAuthError("");
  };

  const closeLoginModal = () => {
    setShowLogin(false);
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({});
    setAuthError("");
  };

  const toggleSignupMode = () => {
    setIsSignupMode(!isSignupMode);
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({});
    setAuthError("");
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
    setDetailsQuantity(1);
    setReviewForm({
      name: userEmail ? userEmail.split("@")[0] : "",
      rating: 0,
      comment: "",
    });
    setReviewError("");
    setReviewHover(0);
  };

  const closeProductDetails = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
    setDetailsQuantity(1);
  };

  const increaseDetailsQuantity = () => {
    setDetailsQuantity((prev) => prev + 1);
  };

  const decreaseDetailsQuantity = () => {
    if (detailsQuantity > 1) {
      setDetailsQuantity((prev) => prev - 1);
    }
  };

  const addToCartFromDetails = () => {
    if (selectedProduct) {
      for (let i = 0; i < detailsQuantity; i++) {
        addToCart(selectedProduct);
      }
      setDetailsQuantity(1);
    }
  };

  const handleBuyNow = () => {
    if (selectedProduct) {
      for (let i = 0; i < detailsQuantity; i++) {
        addToCart(selectedProduct);
      }
      closeProductDetails();
      setShowCart(true);
    }
  };

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const isInWishlist = prevWishlist.some((item) => item.id === product.id);
      if (isInWishlist) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  const addWishlistToCart = (product) => {
    addToCart(product);
  };

  const wishlistCount = wishlist.length;

  // Checkout Functions
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (checkoutErrors[name]) {
      setCheckoutErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateCheckout = () => {
    const newErrors = {};

    if (!deliveryAddress.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!deliveryAddress.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(deliveryAddress.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!deliveryAddress.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!deliveryAddress.house.trim()) {
      newErrors.house = "House/Street is required";
    }

    if (!deliveryAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!deliveryAddress.state.trim()) {
      newErrors.state = "State is required";
    }

    setCheckoutErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateOrderId = () => {
    return "ORD" + Date.now() + Math.random().toString(36).slice(2, 11).toUpperCase();
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (validateCheckout()) {
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);

      // Create order object and add to orders list
      const newOrder = {
        id: newOrderId,
        date: new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        products: cart,
        total: cartTotal,
        deliveryAddress: deliveryAddress,
        paymentMethod: selectedPayment,
        status: "Confirmed",
      };

      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      setShowOrderSuccess(true);
      setShowCheckout(false);
      setCart([]);
      setDeliveryAddress({
        name: "",
        mobile: "",
        pincode: "",
        house: "",
        city: "",
        state: "",
      });
      setSelectedPayment("cod");
    }
  };

  const openCheckout = () => {
    setShowCheckout(true);
    setShowCart(false);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
    setCheckoutErrors({});
  };

  const closeOrderSuccess = () => {
    setShowOrderSuccess(false);
    setOrderId("");
  };

  // Review Functions
  const handleReviewSubmit = (e, productId) => {
    e.preventDefault();
    if (reviewForm.rating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
    if (!reviewForm.comment.trim()) {
      setReviewError("Please write a review comment.");
      return;
    }
    if (!reviewForm.name.trim()) {
      setReviewError("Please enter your name.");
      return;
    }

    const newReview = {
      id: Date.now(),
      productId,
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    setReviews((prevReviews) => [newReview, ...prevReviews]);
    setReviewForm({
      name: userEmail ? userEmail.split("@")[0] : "",
      rating: 0,
      comment: "",
    });
    setReviewError("");
  };

  // Chatbot Functions
  const generateAIResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();

    // Product-related queries
    if (messageLower.includes("phone") || messageLower.includes("mobile")) {
      const phones = products.filter((p) => p.category === "Mobiles");
      const cheapest = phones.reduce((prev, curr) =>
        prev.price < curr.price ? prev : curr
      );
      const mostRated = phones.reduce((prev, curr) =>
        prev.rating > curr.rating ? prev : curr
      );
      return `📱 We have ${phones.length} amazing phones! The cheapest is ${cheapest.name} at ₹${cheapest.price.toLocaleString(
        "en-IN"
      )}, and the highest-rated is ${mostRated.name} with ${mostRated.rating} stars. ⭐`;
    }

    if (messageLower.includes("laptop") || messageLower.includes("computer")) {
      const laptops = products.filter((p) => p.category === "Laptops");
      const mostRated = laptops.reduce((prev, curr) =>
        prev.rating > curr.rating ? prev : curr
      );
      return `💻 We have ${laptops.length} fantastic laptops! The best-rated is ${mostRated.name} with ${mostRated.rating} stars and priced at ₹${mostRated.price.toLocaleString(
        "en-IN"
      )}. Perfect for work and gaming! 🎮`;
    }

    if (messageLower.includes("cheapest") || messageLower.includes("cheapest product")) {
      const cheapest = products.reduce((prev, curr) =>
        prev.price < curr.price ? prev : curr
      );
      return `💰 The cheapest product in our store is ${cheapest.name} from the ${cheapest.category} category, priced at just ₹${cheapest.price.toLocaleString(
        "en-IN"
      )}! It has a rating of ⭐ ${cheapest.rating}.`;
    }

    if (messageLower.includes("best") || messageLower.includes("highest")) {
      const bestRated = products.reduce((prev, curr) =>
        prev.rating > curr.rating ? prev : curr
      );
      return `⭐ The highest-rated product is ${bestRated.name} with an impressive ${bestRated.rating} rating! It's priced at ₹${bestRated.price.toLocaleString(
        "en-IN"
      )} and is from the ${bestRated.category} category.`;
    }

    // Category queries
    if (
      messageLower.includes("electronics") ||
      messageLower.includes("headphones") ||
      messageLower.includes("earbuds")
    ) {
      const electronics = products.filter((p) => p.category === "Electronics");
      return `🎧 We have ${electronics.length} great electronics! From headphones to smart watches, all with free delivery. Browse our collection now! 📦`;
    }

    if (messageLower.includes("fashion") || messageLower.includes("clothes")) {
      const fashion = products.filter((p) => p.category === "Fashion");
      return `👕 Explore our ${fashion.length} fashionable clothing items! Comfortable, stylish, and affordable. Perfect for any occasion! ✨`;
    }

    if (messageLower.includes("shoe") || messageLower.includes("footwear")) {
      const footwear = products.filter((p) => p.category === "Footwear");
      return `👟 Check out our ${footwear.length} amazing footwear options! From casual sneakers to running shoes, we have it all! 🏃`;
    }

    // Cart-related queries
    if (messageLower.includes("cart") || messageLower.includes("add to cart")) {
      return `🛒 You have ${cartCount} items in your cart. You can add more products by clicking the "Add to Cart" button on any product! Total: ₹${cartTotal.toLocaleString(
        "en-IN"
      )}`;
    }

    // Wishlist queries
    if (messageLower.includes("wishlist")) {
      return `❤️ You have ${wishlistCount} items in your wishlist! You can view them by clicking the Wishlist button in the navbar. You can also move items from wishlist to cart anytime! 💕`;
    }

    // Checkout and payment queries
    if (
      messageLower.includes("checkout") ||
      messageLower.includes("payment") ||
      messageLower.includes("pay")
    ) {
      return `💳 We support multiple payment methods: 💵 Cash on Delivery, 📱 UPI Payment, and 💳 Credit/Debit Card. Your order is secure and encrypted. Click "Proceed to Checkout" from your cart to get started!`;
    }

    // Delivery information
    if (
      messageLower.includes("deliver") ||
      messageLower.includes("shipping") ||
      messageLower.includes("when")
    ) {
      return `🚚 We offer FREE delivery on all orders! Your items will be delivered within 2-3 business days. We guarantee 100% authentic products and easy returns & exchanges! ✅`;
    }

    // Return and refund queries
    if (
      messageLower.includes("return") ||
      messageLower.includes("refund") ||
      messageLower.includes("exchange")
    ) {
      return `🔄 We have an easy returns & exchanges policy! You can return or exchange products within 7 days of delivery. No questions asked! Just contact our customer support for hassle-free returns. 📞`;
    }

    // Order queries
    if (messageLower.includes("order")) {
      return `📦 To place an order, add items to your cart and proceed to checkout. Fill in your delivery address, select a payment method, and click "Place Order". You'll receive an Order ID for tracking! 🎉`;
    }

    // General ShopEasy help
    if (
      messageLower.includes("help") ||
      messageLower.includes("how") ||
      messageLower.includes("guide")
    ) {
      return `ℹ️ I'm here to help! You can ask me about:
• Product recommendations
• Prices and ratings
• Delivery information
• Payment methods
• Returns & refunds
• How to checkout
• Wishlist & cart help
What would you like to know? 😊`;
    }

    // Login/Account queries
    if (messageLower.includes("login") || messageLower.includes("account")) {
      return `👤 Click the "Login" button in the top-right corner to access your account or create a new one. It takes just a few seconds! Your account helps us provide personalized shopping experience. 🔐`;
    }

    // Category browsing suggestion
    if (messageLower.includes("category") || messageLower.includes("browse")) {
      return `📂 We have products in these categories: Mobiles, Laptops, Electronics, Fashion, Footwear, TV & Appliances, Home & Kitchen, Gaming, and Books! Which category interests you? 🛍️`;
    }

    // Default response
    return `😊 Thanks for your question! You can ask me about:
• Product recommendations and prices
• Best-rated or cheapest products
• Delivery and shipping info
• Payment methods and checkout
• Returns and refunds
• How to use cart and wishlist
• General ShopEasy assistance

How can I help you today? 💙`;
  };

  const addChatMessage = (sender, text) => {
    const newMessage = {
      id: chatMessages.length + 1,
      sender,
      text,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim()) {
      addChatMessage("user", chatInput);
      setChatInput("");

      // Simulate typing delay
      setIsLoadingResponse(true);
      setTimeout(() => {
        const aiResponse = generateAIResponse(chatInput);
        addChatMessage("bot", aiResponse);
        setIsLoadingResponse(false);
      }, 800);
    }
  };

  const clearChatHistory = () => {
    setChatMessages([
      {
        id: 1,
        sender: "bot",
        text: "Hi! 👋 I'm ShopEasy AI. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setChatInput("");
  };

  const sendSuggestedQuestion = (question) => {
    setChatInput(question);
    addChatMessage("user", question);
    setIsLoadingResponse(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(question);
      addChatMessage("bot", aiResponse);
      setIsLoadingResponse(false);
    }, 800);
  };

  return (
    <div className="app">

      <header className="navbar">
        <button className="logo" onClick={() => {
          setShowCart(false);
          setShowWishlist(false);
          setShowMyOrders(false);
        }}>
          ShopEasy 🛒
        </button>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <button className="login-btn" onClick={openLoginModal}>
          {isLoggedIn ? `${userEmail.split("@")[0]}` : "Login"}
        </button>

        <button
          className="wishlist-btn"
          onClick={() => {
            setShowWishlist(true);
            setShowCart(false);
            setShowMyOrders(false);
          }}
        >
          ❤️ Wishlist
          <span className="wishlist-count">{wishlistCount}</span>
        </button>

        <button
          className="orders-btn"
          onClick={() => {
            setShowMyOrders(true);
            setShowCart(false);
            setShowWishlist(false);
          }}
        >
          📦 Orders
          <span className="orders-count">{orders.length}</span>
        </button>

        <button
          className="cart-btn"
          onClick={() => {
            setShowCart(true);
            setShowWishlist(false);
            setShowMyOrders(false);
          }}
        >
          🛒 Cart
          <span className="cart-count">{cartCount}</span>
        </button>
      </header>

      {showCart ? (
        <main className="cart-page">

          <button
            className="back-btn"
            onClick={() => setShowCart(false)}
          >
            ← Continue Shopping
          </button>

          <h1>🛒 My Cart</h1>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to your cart.</p>
              <button
                className="shop-btn"
                onClick={() => setShowCart(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-container">

              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>

                    <div className="cart-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <span>{item.emoji}</span>
                      )}
                    </div>

                    <div className="cart-product-info">
                      <h3>{item.name}</h3>
                      <p>{item.category}</p>
                      <strong>
                        ₹{item.price.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="quantity">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      ₹{(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </div>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      🗑️
                    </button>

                  </div>
                ))}
              </div>

              <aside className="order-summary">
                <h2>Price Details</h2>

                <div className="summary-row">
                  <span>Items</span>
                  <span>{cartCount}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery</span>
                  <span className="free">FREE</span>
                </div>

                <hr />

                <div className="summary-total">
                  <span>Total Amount</span>
                  <span>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <button className="checkout-btn" onClick={openCheckout}>
                  Proceed to Checkout
                </button>
              </aside>

            </div>
          )}
        </main>
      ) : showMyOrders ? (
        <main className="orders-page">

          <button
            className="back-btn"
            onClick={() => setShowMyOrders(false)}
          >
            ← Continue Shopping
          </button>

          <h1>📦 My Orders</h1>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-orders-icon">📦</div>
              <h2>No orders yet</h2>
              <p>Start shopping to place your first order.</p>
              <button
                className="shop-btn"
                onClick={() => setShowMyOrders(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-container">
              <div className="orders-list">
                {orders.map((order) => (
                  <div className="order-item" key={order.id}>
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order ID: <span className="order-id">{order.id}</span></h3>
                        <p className="order-date">{order.date} at {order.time}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                          ✓ {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="order-products">
                      {order.products.map((product) => (
                        <div className="order-product" key={product.id}>
                          <div className="order-product-image">
                            {product.image ? (
                              <img src={product.image} alt={product.name} />
                            ) : (
                              <span>{product.emoji}</span>
                            )}
                          </div>
                          <div className="order-product-details">
                            <h4>{product.name}</h4>
                            <p className="order-product-category">{product.category}</p>
                            <p className="order-product-qty">Qty: {product.quantity}</p>
                          </div>
                          <div className="order-product-price">
                            ₹{(product.price * product.quantity).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-delivery">
                        <p><strong>Delivery Address:</strong></p>
                        <p>{order.deliveryAddress.name}</p>
                        <p>{order.deliveryAddress.house}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
                      </div>
                      <div className="order-totals">
                        <div className="order-total-row">
                          <span>Subtotal</span>
                          <span>₹{order.total.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="order-total-row">
                          <span>Delivery</span>
                          <span className="free-delivery">FREE</span>
                        </div>
                        <div className="order-total-row final">
                          <span>Total Amount</span>
                          <span>₹{order.total.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="order-payment">Payment: {
                          order.paymentMethod === "cod" ? "💵 Cash on Delivery" :
                            order.paymentMethod === "upi" ? "📱 UPI Payment" :
                              "💳 Debit/Credit Card"
                        }</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      ) : (
        <>
          <div className="categories">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "active-category"
                    : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <section className="hero">
            <div>
              <p className="offer">BIG SAVING DAYS</p>
              <h1>Great Deals. Great Products.</h1>
              <p>
                Shop your favourite products at amazing prices.
              </p>
              <button
                className="shop-btn"
                onClick={() => setCategory("All")}
              >
                Shop Now
              </button>
            </div>

            <div className="hero-emoji">🛍️</div>
          </section>

          <main className="products-section">

            <div className="section-title">
              <div>
                <h2>
                  {category === "All"
                    ? "All Products"
                    : category}
                </h2>
              </div>
              <p>{filteredProducts.length} products found</p>
            </div>

            <div className="filter-sort-bar">
              <div className="filters">
                <div className="filter-group">
                  <label>Price</label>
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                  <button
                    className="apply-btn"
                    onClick={applyPriceFilter}
                  >
                    Apply
                  </button>
                </div>

                <div className="filter-group">
                  <label>Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="all">All ratings</option>
                    <option value="4">4 stars & above</option>
                    <option value="3">3 stars & above</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sort</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating-high">Rating: High to Low</option>
                    <option value="name-az">Name: A to Z</option>
                  </select>
                </div>

                <button
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>

              {(appliedMinPrice !== "" ||
                appliedMaxPrice !== "" ||
                ratingFilter !== "all") && (
                  <div className="active-filters">
                    {appliedMinPrice !== "" && (
                      <span className="active-filter-chip">
                        Min: ₹{appliedMinPrice}
                      </span>
                    )}
                    {appliedMaxPrice !== "" && (
                      <span className="active-filter-chip">
                        Max: ₹{appliedMaxPrice}
                      </span>
                    )}
                    {ratingFilter !== "all" && (
                      <span className="active-filter-chip">
                        {ratingFilter}★ & above
                      </span>
                    )}
                  </div>
                )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <h2>😕 No products found</h2>
                <p>Try another search.</p>
              </div>
            ) : (
              <div className="product-grid">
                {sortedProducts.map((product) => (
                  <div
                    className="product-card"
                    key={product.id}
                    onClick={() => openProductDetails(product)}
                  >

                    <div className="product-image">
                      <button
                        className={`wishlist-heart ${isInWishlist(product.id) ? "in-wishlist" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        {isInWishlist(product.id) ? "❤️" : "🤍"}
                      </button>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <span>{product.emoji}</span>
                      )}
                    </div>

                    <div className="product-info">
                      <span className="category-name">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <div className="rating">
                        ⭐ {getAverageRating(product)}
                        <span className="rating-count">
                          {" "}({getReviewCount(product.id)}{" "}
                          {getReviewCount(product.id) === 1
                            ? "review"
                            : "reviews"}
                          )
                        </span>
                      </div>

                      <div className="price">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>

                      <p className="delivery">
                        🚚 Free Delivery
                      </p>

                      <button
                        className="add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </main>

          <footer>
            <h2>ShopEasy 🛒</h2>
            <p>Your trusted online shopping destination.</p>
            <p>© 2026 ShopEasy. All rights reserved.</p>
          </footer>
        </>
      )}

      {/* Login/Signup Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={closeLoginModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeLoginModal}>
              ✕
            </button>

            <div className="modal-header">
              <h2>{isSignupMode ? "Create Account" : "Login"}</h2>
              <p>
                {isSignupMode
                  ? "Join ShopEasy to enjoy seamless shopping"
                  : "Welcome back to ShopEasy"}
              </p>
            </div>

            <form
              onSubmit={isSignupMode ? handleSignup : handleLogin}
              className="login-form"
            >
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={errors.email ? "input-error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    isSignupMode
                      ? "Create a password (min 6 characters)"
                      : "Enter your password"
                  }
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {isSignupMode && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter your password"
                    className={
                      errors.confirmPassword ? "input-error" : ""
                    }
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}

              {authError && (
                <span className="error-message auth-error">{authError}</span>
              )}

              <button
                type="submit"
                className="form-submit-btn"
                disabled={submitting}
              >
                {isSignupMode ? "Create Account" : "Login"}
              </button>
            </form>

            <div className="modal-footer">
              <p>
                {isSignupMode
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  className="toggle-mode-btn"
                  onClick={toggleSignupMode}
                >
                  {isSignupMode ? "Login here" : "Sign up here"}
                </button>
              </p>
            </div>

            {isLoggedIn && (
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <div className="product-details-overlay" onClick={closeProductDetails}>
          <div className="product-details-content" onClick={(e) => e.stopPropagation()}>
            <button className="details-close-btn" onClick={closeProductDetails}>
              ✕
            </button>

            <div className="details-container">
              {/* Product Image Section */}
              <div className="details-image-section">
                <div className="details-product-image">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                    />
                  ) : (
                    <span>{selectedProduct.emoji}</span>
                  )}
                </div>
              </div>

              {/* Product Info Section */}
              <div className="details-info-section">
                <div className="details-header">
                  <span className="details-category">
                    {selectedProduct.category}
                  </span>
                  <h1 className="details-title">
                    {selectedProduct.name}
                  </h1>
                </div>

                <div className="details-rating-price">
                  <div className="details-rating">
                    <span className="rating-badge">
                      ⭐ {getAverageRating(selectedProduct)}
                    </span>
                    <span className="rating-text">
                      {getReviewCount(selectedProduct.id)}{" "}
                      {getReviewCount(selectedProduct.id) === 1
                        ? "review"
                        : "reviews"}
                    </span>
                  </div>
                  <div className="details-price">
                    <span className="price-label">Price</span>
                    <span className="price-value">
                      ₹{selectedProduct.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="details-description">
                  <h3>Product Description</h3>
                  <p>{selectedProduct.description}</p>
                </div>

                <div className="details-delivery">
                  <h3>Delivery Information</h3>
                  <ul>
                    <li>🚚 Free Delivery on this order</li>
                    <li>📦 Delivery in 2-3 business days</li>
                    <li>✅ 100% Authentic Product Guarantee</li>
                    <li>🔄 Easy Returns & Exchanges</li>
                  </ul>
                </div>

                <div className="details-quantity-section">
                  <label>Quantity</label>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={decreaseDetailsQuantity}
                    >
                      −
                    </button>
                    <span className="qty-display">
                      {detailsQuantity}
                    </span>
                    <button
                      className="qty-btn"
                      onClick={increaseDetailsQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="details-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={addToCartFromDetails}
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    className="buy-now-btn"
                    onClick={handleBuyNow}
                  >
                    ⚡ Buy Now
                  </button>
                </div>

                <button
                  className="back-to-products-btn"
                  onClick={closeProductDetails}
                >
                  ← Back to Products
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-heading">
                <h2>⭐ Ratings & Reviews</h2>
              </div>

              <div className="reviews-summary">
                <div className="average-rating-box">
                  <span className="average-rating-value">
                    {getAverageRating(selectedProduct)}
                  </span>
                  <div className="average-rating-stars">
                    {renderStars(getAverageRating(selectedProduct))}
                  </div>
                </div>
                <div className="reviews-summary-info">
                  <span className="reviews-count-text">
                    {getReviewCount(selectedProduct.id)}{" "}
                    {getReviewCount(selectedProduct.id) === 1
                      ? "Review"
                      : "Reviews"}
                  </span>
                  <span className="reviews-sub-text">
                    Based on customer reviews
                  </span>
                </div>
              </div>

              <div className="reviews-list">
                {getProductReviews(selectedProduct.id).length === 0 ? (
                  <p className="no-reviews">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  getProductReviews(selectedProduct.id).map((review) => (
                    <div className="review-item" key={review.id}>
                      <div className="review-header">
                        <div className="review-avatar">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="review-meta">
                          <span className="review-name">{review.name}</span>
                          <div className="review-stars-row">
                            <span className="review-stars">
                              {renderStars(review.rating)}
                            </span>
                            <span className="review-date">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="write-review">
                <h3>Write a Review</h3>
                <form
                  className="review-form"
                  onSubmit={(e) =>
                    handleReviewSubmit(e, selectedProduct.id)
                  }
                >
                  <div className="review-form-row">
                    <div className="review-field">
                      <label htmlFor="review-name">Your Name</label>
                      <input
                        id="review-name"
                        type="text"
                        className="review-input"
                        value={reviewForm.name}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your name"
                      />
                    </div>

                    <div className="review-field">
                      <label>Your Rating</label>
                      <div className="star-input">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className={`star-btn ${star <= (reviewHover || reviewForm.rating)
                              ? "selected"
                              : ""
                              }`}
                            onClick={() =>
                              setReviewForm({ ...reviewForm, rating: star })
                            }
                            onMouseEnter={() => setReviewHover(star)}
                            onMouseLeave={() => setReviewHover(0)}
                            aria-label={`${star} star`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="review-field">
                    <label htmlFor="review-comment">Your Review</label>
                    <textarea
                      id="review-comment"
                      className="review-textarea"
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          comment: e.target.value,
                        })
                      }
                      placeholder="Share your experience with this product..."
                      rows="3"
                    />
                  </div>

                  {reviewError && (
                    <p className="review-error">{reviewError}</p>
                  )}

                  <button type="submit" className="review-submit-btn">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="wishlist-overlay" onClick={() => setShowWishlist(false)}>
          <div className="wishlist-modal" onClick={(e) => e.stopPropagation()}>
            <button className="wishlist-close-btn" onClick={() => setShowWishlist(false)}>
              ✕
            </button>

            <h1>❤️ My Wishlist</h1>

            {wishlist.length === 0 ? (
              <div className="empty-wishlist">
                <div className="empty-wishlist-icon">🤍</div>
                <h2>Your Wishlist is Empty</h2>
                <p>Add items to your wishlist to save for later.</p>
                <button
                  className="shop-btn"
                  onClick={() => setShowWishlist(false)}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="wishlist-container">
                <div className="wishlist-items">
                  {wishlist.map((item) => (
                    <div className="wishlist-item" key={item.id}>
                      <div className="wishlist-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>{item.emoji}</span>
                        )}
                      </div>

                      <div className="wishlist-item-info">
                        <span className="wishlist-category">
                          {item.category}
                        </span>
                        <h3>{item.name}</h3>
                        <div className="wishlist-rating">
                          ⭐ {item.rating}
                        </div>
                        <p className="wishlist-delivery">
                          🚚 Free Delivery
                        </p>
                      </div>

                      <div className="wishlist-item-price">
                        ₹{item.price.toLocaleString("en-IN")}
                      </div>

                      <div className="wishlist-item-actions">
                        <button
                          className="wishlist-add-cart-btn"
                          onClick={() => addWishlistToCart(item)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="wishlist-remove-btn"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              className="back-wishlist-btn"
              onClick={() => setShowWishlist(false)}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="checkout-overlay" onClick={closeCheckout}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="checkout-close-btn" onClick={closeCheckout}>
              ✕
            </button>

            <h1>📦 Checkout</h1>

            <div className="checkout-container">
              {/* Order Summary */}
              <div className="checkout-summary">
                <h2>Order Summary</h2>
                <div className="checkout-items">
                  {cart.map((item) => (
                    <div className="checkout-summary-item" key={item.id}>
                      <div className="checkout-item-details">
                        <span className="checkout-item-name">
                          {item.name}
                        </span>
                        <span className="checkout-item-qty">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <span className="checkout-item-price">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="checkout-totals">
                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Delivery</span>
                    <span className="free-delivery">FREE</span>
                  </div>
                  <div className="checkout-summary-total">
                    <span>Total Amount</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address Form */}
              <div className="checkout-form">
                <h2>Delivery Address</h2>

                <form onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={deliveryAddress.name}
                      onChange={handleAddressChange}
                      placeholder="Enter your full name"
                      className={checkoutErrors.name ? "input-error" : ""}
                    />
                    {checkoutErrors.name && (
                      <span className="error-message">
                        {checkoutErrors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="mobile">Mobile Number *</label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={deliveryAddress.mobile}
                      onChange={handleAddressChange}
                      placeholder="10-digit mobile number"
                      className={checkoutErrors.mobile ? "input-error" : ""}
                    />
                    {checkoutErrors.mobile && (
                      <span className="error-message">
                        {checkoutErrors.mobile}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={deliveryAddress.pincode}
                      onChange={handleAddressChange}
                      placeholder="6-digit pincode"
                      className={checkoutErrors.pincode ? "input-error" : ""}
                    />
                    {checkoutErrors.pincode && (
                      <span className="error-message">
                        {checkoutErrors.pincode}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="house">House No./Street Address *</label>
                    <input
                      type="text"
                      id="house"
                      name="house"
                      value={deliveryAddress.house}
                      onChange={handleAddressChange}
                      placeholder="Enter house no. and street"
                      className={checkoutErrors.house ? "input-error" : ""}
                    />
                    {checkoutErrors.house && (
                      <span className="error-message">
                        {checkoutErrors.house}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={handleAddressChange}
                      placeholder="Enter your city"
                      className={checkoutErrors.city ? "input-error" : ""}
                    />
                    {checkoutErrors.city && (
                      <span className="error-message">
                        {checkoutErrors.city}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={deliveryAddress.state}
                      onChange={handleAddressChange}
                      placeholder="Enter your state"
                      className={checkoutErrors.state ? "input-error" : ""}
                    />
                    {checkoutErrors.state && (
                      <span className="error-message">
                        {checkoutErrors.state}
                      </span>
                    )}
                  </div>

                  <h2 style={{ marginTop: "25px" }}>Payment Method</h2>

                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={selectedPayment === "cod"}
                        onChange={(e) =>
                          setSelectedPayment(e.target.value)
                        }
                      />
                      <span className="payment-label">
                        💵 Cash on Delivery
                      </span>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={selectedPayment === "upi"}
                        onChange={(e) =>
                          setSelectedPayment(e.target.value)
                        }
                      />
                      <span className="payment-label">
                        📱 UPI Payment
                      </span>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={selectedPayment === "card"}
                        onChange={(e) =>
                          setSelectedPayment(e.target.value)
                        }
                      />
                      <span className="payment-label">
                        💳 Debit/Credit Card
                      </span>
                    </label>
                  </div>

                  <button type="submit" className="place-order-btn">
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Success Modal */}
      {showOrderSuccess && (
        <div className="success-overlay">
          <div className="success-modal">
            <div className="success-icon">✅</div>

            <h1>Order Placed Successfully!</h1>

            <div className="order-id-section">
              <p>Your Order ID</p>
              <div className="order-id-display">{orderId}</div>
            </div>

            <div className="order-details">
              <p>Thank you for your order! 🎉</p>
              <p>
                You will receive your items within 2-3 business days.
              </p>
              <p>A confirmation email has been sent to your registered email.</p>
            </div>

            <button
              className="close-success-btn"
              onClick={() => {
                closeOrderSuccess();
                setShowCart(false);
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Assistant Button */}
      {!showChatBot && (
        <button
          className="ai-assistant-btn"
          onClick={() => setShowChatBot(true)}
          title="Open AI Assistant"
        >
          🤖
        </button>
      )}

      {/* AI Chatbot Modal */}
      {showChatBot && (
        <div className="chatbot-modal">
          <div className="chatbot-header">
            <h3>🤖 ShopEasy AI Assistant</h3>
            <button
              className="chatbot-close-btn"
              onClick={() => setShowChatBot(false)}
              title="Close Chat"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-content">
                  {msg.sender === "bot" && (
                    <span className="message-icon">🤖</span>
                  )}
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoadingResponse && (
              <div className="chat-message bot">
                <div className="message-content">
                  <span className="message-icon">🤖</span>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chatbot-suggestions">
            {chatMessages.length === 1 && (
              <div className="suggested-questions">
                <button
                  className="suggestion-btn"
                  onClick={() => sendSuggestedQuestion("What's the best phone?")}
                >
                  📱 Best phone?
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() =>
                    sendSuggestedQuestion("What's the cheapest product?")
                  }
                >
                  💰 Cheapest product?
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => sendSuggestedQuestion("How to checkout?")}
                >
                  🛒 How to checkout?
                </button>
                <button
                  className="suggestion-btn"
                  onClick={() => sendSuggestedQuestion("What about returns?")}
                >
                  🔄 How to return?
                </button>
              </div>
            )}
          </div>

          <div className="chatbot-input-section">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                placeholder="Ask me anything..."
                className="chatbot-input"
              />
              <button
                className="send-btn"
                onClick={handleSendChatMessage}
                disabled={isLoadingResponse}
              >
                ➤
              </button>
            </div>
            <button
              className="clear-chat-btn"
              onClick={clearChatHistory}
              title="Clear Chat History"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

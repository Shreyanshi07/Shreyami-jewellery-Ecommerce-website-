
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function addToCart(product, price, image){
const isLoggedIn = localStorage.getItem("username");
if (!isLoggedIn) {

        alert("Please login to start your Shreyami Jewellery collection!");
        openAuth(); 
        return; 
    }
cart.push({name: product, price: price, image: image});

localStorage.setItem("cart", JSON.stringify(cart));
alert(`${product} added to your cart!`);

updateCart();

}
function updateCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotalDisplay = document.getElementById("cart-total"); 
    let cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.innerText = cart.length;
    }

    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        // IMPORTANT: See the 'event' passed into removeItem here
        li.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${item.image}" width="40" style="border-radius:2px;">
                <span>${item.name} - ₹${item.price}</span>
            </div>
            <button class="remove-btn" onclick="removeItem(${index}, event)">X</button>
        `;
        cartItems.appendChild(li);
        total += item.price;
    });

    if (cartTotalDisplay) {
        cartTotalDisplay.innerText = "₹" + total.toLocaleString();
    }
}
function removeItem(index, event) {
   
    if (event) {
        event.stopPropagation();
    }

    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function toggleCart(event) {
    event.stopPropagation();
    const cart = document.getElementById("cartPopup");
    document.getElementById("userMenu").classList.remove("show-menu");
    
    cart.classList.toggle("show-cart");
}

window.onclick = function(event) {
    const userMenu = document.getElementById("userMenu");
    const cartPopup = document.getElementById("cartPopup");
    
    if (userMenu) userMenu.classList.remove("show-menu");
    if (cartPopup) cartPopup.classList.remove("show-cart");
}



//  for acoount 

function toggleUserMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById("userMenu");
    menu.classList.toggle("show-menu");
}

window.onclick = function(event) {
    const menu = document.getElementById("userMenu");
    if (menu && menu.classList.contains('show-menu')) {
        menu.classList.remove('show-menu');
    }
    
}
function updateAccountUI() {
    const isLoggedIn = localStorage.getItem("username");
    const menuList = document.querySelector(".user-menu-content ul");

    if (isLoggedIn) {
    
        menuList.innerHTML = `
            <li><a href="#"><i class="fa fa-heart"></i> My Wishlist</a></li>
            <li><a href="#"><i class="fa fa-shopping-bag"></i> Order History</a></li>
            <li><a href="#" onclick="logoutUser()"><i class="fa fa-sign-out-alt"></i> Logout</a></li>
        `;
    } else {
    
        menuList.innerHTML = `
            <li><a href="#" onclick="openAuth()"><i class="fa fa-sign-in-alt"></i> Login</a></li>
            <li><a href="#" onclick="openAuth()"><i class="fa fa-user-plus"></i> Create Account</a></li>
        `;
    }

}
//lightbox function

function openLightbox(element) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const clickedImgSrc = element.querySelector('img').src;
        
        lightboxImg.src = clickedImgSrc;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; 
    }


// Function for thank uou popoup 
function processCheckout() {
    console.log("Checkout process started...");
    

    const currentUserName = localStorage.getItem("username") || "Customer";
    
    const thankYouModal = document.getElementById("thankYouModal");
    const thankYouNameElement = document.getElementById("thankYouName");
    const cartPopup = document.getElementById("cartPopup");

    if (thankYouNameElement) {
        thankYouNameElement.innerText = `Thank You, ${currentUserName}`;
    }

    if (thankYouModal) {
        thankYouModal.style.display = "block";
    }
     else {
        alert("Thank you for your purchase from Shreyami Jewellery!"); 
    }

    if (cartPopup) {
        cartPopup.classList.remove("show-cart");
    }
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#fcfcfc'] 
    });

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
    
const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
const total = currentCart.reduce((sum, item) => sum + item.price, 0);

if (currentCart.length > 0) {
    let orders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    orders.push({
        id: Math.floor(Math.random() * 10000), 
        date: new Date().toLocaleDateString(),
        total: total,
        items: currentCart
    });
    localStorage.setItem("orderHistory", JSON.stringify(orders));
}
}
function closeThankYou() {
    document.getElementById("thankYouModal").style.display = "none";
}


//loginnnn
function openAuth() {
    document.getElementById("authModal").style.display = "block";
}

function closeAuth() {
    document.getElementById("authModal").style.display = "none";
}

function toggleAuth() {
    const login = document.getElementById("loginForm");
    const signup = document.getElementById("signupForm");
    
    if (login.style.display === "none") {
        login.style.display = "block";
        signup.style.display = "none";
    } else {
        login.style.display = "none";
        signup.style.display = "block";
    }
}

// connect the Backend!
async function handleAuth(event, type) {
    event.preventDefault();
    
    const email = (type === 'login') ? document.getElementById('loginEmail').value : document.getElementById('signupEmail').value;
    const password = (type === 'login') ? document.getElementById('loginPass').value : document.getElementById('signupPass').value;
    const name = (type === 'signup') ? document.getElementById('signupName').value : '';

    try {
        const response = await fetch('http://localhost:5000/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, email, password, name })
        });

        const data = await response.json();

        if (data.success) {
            alert(`Hello ${data.user}, Welcome to Shreyami!`);
            localStorage.setItem("username", data.user); 
            window.location.reload(); 
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        console.log("Backend not running yet! Run 'node server.js' first.");
    }
}

window.onload = function() {
    const savedName = localStorage.getItem("username");
    const userNameDisplay = document.querySelector(".user-menu-content h3");

    if (savedName && userNameDisplay) {
        userNameDisplay.innerText = savedName; 
    }
};


// The Logout Function
function logoutUser() {
    localStorage.removeItem("username");
    alert("Logged out successfully. See you soon!");
    window.location.reload();
}

// Function to open/close the menu
function toggleUserMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById("userMenu");
    menu.classList.toggle("show-user-menu");
}

window.onload = function() {
    const savedName = localStorage.getItem("username");
    const nameById = document.getElementById("displayUserName");
    const nameByQuery = document.querySelector(".user-menu-content h3");

    if (savedName) {
        if (nameById) nameById.innerText = savedName;
        if (nameByQuery) nameByQuery.innerText = savedName;
        console.log("Shreyami Home: User updated to " + savedName);
    }
};


function searchProduct() {
    // 1. Get the input
    const searchBar = document.getElementById("searchInput");
    if (!searchBar) return; // Safety check
    const term = searchBar.value.toLowerCase();
    
    // 2. Find ALL types of products you used (Home and Collection)
    const items = document.querySelectorAll(".product, .product-card");

    items.forEach(item => {
        // 3. Find the title inside the card
        const title = item.querySelector("h3");
        if (title) {
            const name = title.innerText.toLowerCase();

            // 4. THE FIX: If it matches, remove 'display: none'
            if (name.includes(term)) {
                item.style.setProperty("display", "", "important"); 
                // Using "" lets the CSS take back control (Flex/Grid)
            } else {
                item.style.setProperty("display", "none", "important");
            }
        }
    });
}

    // 5. Update the "showing X products" count (Only for Collection page)
    const countDisplay = document.getElementById('product-count');
    if (countDisplay) {
        const visibleProducts = document.querySelectorAll(".product-card[style='display: block;']").length;
        countDisplay.textContent = visibleProducts;
    }

    // --- WISHLIST LOGIC ---

    function addToWishlist(name, price) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    
    if (!wishlist.find(item => item.name === name)) {
        wishlist.push({ name, price });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert(name + " added to your Shreyami Wishlist! ✨");
    } else {
        alert("This piece is already in your wishlist.");
    }
}

function openWishlist() {
    const modal = document.getElementById("wishlistModal");
    const container = document.getElementById("wishlistItems");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.length > 0) {
        container.innerHTML = wishlist.map(item => `
            <div class="wish-item">
                <span>${item.name} - ₹${item.price}</span>
                <button onclick="addToCartFromWishlist('${item.name}')">Add to Cart</button>
            </div>
        `).join('');
    }
    modal.style.display = "block";
}

// --- ORDERS LOGIC ---
function openOrders() {
    const modal = document.getElementById("ordersModal");
    const container = document.getElementById("ordersList");
    const orders = JSON.parse(localStorage.getItem("orderHistory")) || [];

    if (orders.length > 0) {
        container.innerHTML = orders.map(order => `
            <div class="order-item">
                <strong>Order #${order.id}</strong> - ${order.date}<br>
                Total: ₹${order.total}
            </div>
        `).join('<hr>');
    }
    modal.style.display = "block";
}

// Close function for all modals
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}


function openSettings() {
    const newName = prompt("Enter your new display name:", localStorage.getItem("username"));
    if (newName) {
        localStorage.setItem("username", newName);
        alert("Name updated! Refresh to see changes.");
        location.reload(); // Quickest way to update the whole UI
    }
}


function openDashboard(type) {
    const section = document.getElementById("userDashboard");
    const title = document.getElementById("dashboardTitle");
    const content = document.getElementById("dashboardContent");
    
    section.style.display = "block";
    section.scrollIntoView({ behavior: 'smooth' }); 

    if (type === 'wishlist') {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    if (wishlist.length === 0) {
        content.innerHTML = `<p style="text-align:center; padding: 50px; color: #888; font-style: italic;">Your wishlist is empty. Start hearting your favorite jewels!</p>`;
    } else {
        // We create a Grid of elegant cards
        content.innerHTML = `
            <div class="lux-wishlist-grid">
                ${wishlist.map((item, index) => `
                    <div class="lux-wish-card">
                    <div class="wish-img-container">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                        <div class="lux-wish-info">
                            <h4>${item.name}</h4>
                            <p class="lux-price">₹${item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div class="lux-wish-actions">
                            <button onclick="addToCartFromWishlist('${item.name}', ${item.price}, '${item.image}')" class="lux-add-btn">Add to Bag</button>
                            <button onclick="removeFromWishlist(${index})" class="lux-remove-link">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
} else if (type === 'orders') {
        title.innerHTML = "My Orders";
        let orderData = JSON.parse(localStorage.getItem("orderHistory")) || [];
        content.innerHTML = orderData.length > 0 
            ? orderData.map(order => `<p>📦 Order #${order.id} - Total: ₹${order.total}</p>`).join('')
            : "<p>No orders yet. Your first Shreyami piece is waiting!</p>";
            
    } else if (type === 'settings') {
        title.innerHTML = "Account Settings";
        const currentName = localStorage.getItem("username");
        content.innerHTML = `
            <div style="max-width:300px;">
                <label>Update Username:</label>
                <input type="text" id="newNameInput" value="${currentName}" style="width:100%; padding:10px; margin:10px 0;">
                <button onclick="saveNewName()" class="auth-btn" style="padding:10px;">Update Profile</button>
            </div>
        `;
    }
}

function closeDashboard() {
    document.getElementById("userDashboard").style.display = "none";
}

function saveNewName() {
    const val = document.getElementById("newNameInput").value;
    if(val) {
        localStorage.setItem("username", val);
        alert("Profile Updated!");
        location.reload();
    }
}


// --- WISHLIST ENGINE ---
function addToWishlist(name, price, image) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.some(item => item.name === name);

    if (exists) {
        alert("This piece is already in your wishlist! ✨");
    } else {
        wishlist.push({ name: name, price: price, image: image});
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert(name + " added to your collection! ♡");
        event.target.classList.add('fa-solid');  
    }
    
}
function addToCartFromWishlist(name, price, image) {
    if (typeof addToCart === "function") {
        addToCart(name, price, image);
       // alert(name + " added to your bag! ✨");
    } else {
        alert("Item added!");
        console.log("Make sure your main cart function is named 'addToCart'");
    }
}
function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    openDashboard('wishlist'); // Refresh the view
   
}
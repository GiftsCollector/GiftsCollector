// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// DOM Elements
const balanceAmount = document.getElementById('balance-amount');
const userAvatar = document.getElementById('user-avatar').querySelector('img');
const walletAddress = document.getElementById('wallet-address').querySelector('span');
const cartCount = document.getElementById('cart-count');
const cartIndicator = document.getElementById('cart-indicator');
const addFundsBtn = document.getElementById('add-funds-btn');
const viewCartBtn = document.getElementById('view-cart-btn');
const marketGrid = document.getElementById('market-grid');
const myCollectionsContainer = document.getElementById('my-collections-container');
const myGiftsGrid = document.getElementById('my-gifts-grid');
const createCollectionBtn = document.getElementById('create-collection-btn');
const searchInput = document.getElementById('search-input');
const backButton = document.getElementById('back-button');
const refreshButton = document.getElementById('refresh-button');

// Navigation tabs
const marketTab = document.getElementById('market-tab');
const myCollectionsTab = document.getElementById('my-collections-tab');
const addCollectionTab = document.getElementById('add-collection-tab');
const myGiftsTab = document.getElementById('my-gifts-tab');

// Content views
const marketView = document.getElementById('market-view');
const myCollectionsView = document.getElementById('my-collections-view');
const addCollectionView = document.getElementById('add-collection-view');
const myGiftsView = document.getElementById('my-gifts-view');
const cartView = document.getElementById('cart-view');
const giftDetailsView = document.getElementById('gift-details-view');
const collectionDetailsView = document.getElementById('collection-details-view');

// Modals
const sortModal = document.getElementById('sort-modal');
const priceModal = document.getElementById('price-modal');
const sortOption = document.getElementById('sort-option');
const priceOption = document.getElementById('price-option');

// Cart elements
const cartItems = document.getElementById('cart-items');
const cartTotalItems = document.getElementById('cart-total-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Filter categories
const filterCategories = document.querySelectorAll('.filter-category');

// Sample data (would be replaced with real data from the bot)
let gifts = [];
let collections = [];
let myGifts = [];
let userInfo = {
    username: 'User',
    balance: 0,
    avatar: null
};

// Shopping cart
let cart = [];

// Current view and filter settings
let currentView = 'market';
let currentSort = 'latest';
let currentPriceFilter = 'all';
let currentCategory = 'all';
let searchTerm = '';

// Initialize the app
function initApp() {
    // Set up Telegram theme
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
    } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
    }
    
    // Get user info from Telegram if available
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        userInfo.username = user.username || user.first_name || 'User';
        
        // If user has a photo, use it
        if (user.photo_url) {
            userInfo.avatar = user.photo_url;
            userAvatar.src = user.photo_url;
        }
        
        // Update user display name (wallet address)
        walletAddress.textContent = userInfo.username;
    }
    
    // Fetch initial data
    fetchData();
    
    // Add event listeners
    addEventListeners();
    
    // Set up initial view
    showView('market');
}

// Fetch data from the bot
function fetchData() {
    showLoading(true);
    
    // In a real implementation, this would fetch data from the bot
    // For now, we'll use sample data
    
    // Get gifts for marketplace
    gifts = [
        {
            id: 1,
            name: "Easter Egg",
            giftId: "#114748",
            price: 4.4,
            image: "https://via.placeholder.com/300/9c27b0/FFFFFF?text=Easter+Egg",
            background: "#9c27b0",
            category: "premium",
            forSale: true,
            status: "available",
            owner: "MarketBot"
        },
        {
            id: 2,
            name: "Easter Egg",
            giftId: "#104709",
            price: 3.96,
            image: "https://via.placeholder.com/300/e67e22/FFFFFF?text=Easter+Egg",
            background: "#e67e22",
            category: "gold",
            forSale: true,
            status: "available",
            owner: "JohnDoe"
        },
        {
            id: 3,
            name: "Easter Egg",
            giftId: "#103456",
            price: 20.45,
            image: "https://via.placeholder.com/300/8bc34a/FFFFFF?text=Easter+Egg",
            background: "#8bc34a",
            category: "silver",
            forSale: true,
            status: "available",
            owner: "AliceWonder"
        },
        {
            id: 4,
            name: "Easter Egg",
            giftId: "#109876",
            price: 0.75,
            image: "https://via.placeholder.com/300/e74c3c/FFFFFF?text=Easter+Egg",
            background: "#e74c3c",
            category: "silver",
            forSale: true,
            status: "available",
            owner: "BobBuilder"
        }
    ];
    
    // Get collections
    collections = [
        {
            id: 101,
            name: "Birthday Collection",
            description: "A collection of birthday gifts",
                        thumbnail: "https://via.placeholder.com/300/3498db/FFFFFF?text=Birthday",
            giftCount: 3,
            totalPrice: 45.5,
            owner: userInfo.username,
            forSale: false
        },
        {
            id: 102,
            name: "Silver Collection",
            description: "A collection of silver gifts",
            thumbnail: "https://via.placeholder.com/300/bdc3c7/FFFFFF?text=Silver",
            giftCount: 5,
            totalPrice: 120.75,
            owner: userInfo.username,
            forSale: true
        }
    ];
    
    // Get my gifts
    myGifts = [
        {
            id: 201,
            name: "Premium Gift",
            giftId: "#205678",
            price: 7.25,
            image: "https://via.placeholder.com/300/9b59b6/FFFFFF?text=Premium+Gift",
            background: "#9b59b6",
            category: "premium",
            forSale: false,
            status: "available",
            owner: userInfo.username
        },
        {
            id: 202,
            name: "Special Package",
            giftId: "#207890",
            price: 12.40,
            image: "https://via.placeholder.com/300/2ecc71/FFFFFF?text=Special+Package",
            background: "#2ecc71",
            category: "gold",
            forSale: true,
            status: "available",
            owner: userInfo.username
        }
    ];
    
    // Update balance
    userInfo.balance = 1.394;
    updateBalance(userInfo.balance);
    
    // Render views
    renderMarket();
    renderMyCollections();
    renderMyGifts();
    
    showLoading(false);
}

// Update user balance display
function updateBalance(balance) {
    userInfo.balance = balance;
    balanceAmount.textContent = balance.toFixed(3);
}

// Show/hide loading indicator
function showLoading(show) {
    const existingLoader = document.querySelector('.loading');
    
    if (show) {
        if (!existingLoader) {
            const loader = document.createElement('div');
            loader.className = 'loading';
            loader.innerHTML = '<div class="loading-spinner"></div>';
            
            // Add to current view
            const currentViewElement = document.querySelector('.content-view:not([style*="display: none"])');
            if (currentViewElement) {
                currentViewElement.appendChild(loader);
            }
        }
    } else {
        if (existingLoader) {
            existingLoader.remove();
        }
    }
}

// Show a specific view and hide others
function showView(viewName) {
    // Hide all views
    marketView.style.display = 'none';
    myCollectionsView.style.display = 'none';
    addCollectionView.style.display = 'none';
    myGiftsView.style.display = 'none';
    cartView.style.display = 'none';
    giftDetailsView.style.display = 'none';
    collectionDetailsView.style.display = 'none';
    
    // Show the selected view
    switch (viewName) {
        case 'market':
            marketView.style.display = 'block';
            break;
        case 'myCollections':
            myCollectionsView.style.display = 'block';
            break;
        case 'addCollection':
            addCollectionView.style.display = 'block';
            break;
        case 'myGifts':
            myGiftsView.style.display = 'block';
            break;
        case 'cart':
            cartView.style.display = 'block';
            renderCart();
            break;
        case 'giftDetails':
            giftDetailsView.style.display = 'block';
            break;
        case 'collectionDetails':
            collectionDetailsView.style.display = 'block';
            break;
    }
    
    // Update current view
    currentView = viewName;
    
    // Update active tab
    updateActiveTab();
}

// Update active tab in navigation
function updateActiveTab() {
    // Remove active class from all tabs
    marketTab.classList.remove('active');
    myCollectionsTab.classList.remove('active');
    addCollectionTab.classList.remove('active');
    myGiftsTab.classList.remove('active');
    
    // Add active class to current tab
    switch (currentView) {
        case 'market':
        case 'giftDetails':
        case 'cart':
            marketTab.classList.add('active');
            break;
        case 'myCollections':
        case 'collectionDetails':
            myCollectionsTab.classList.add('active');
            break;
        case 'addCollection':
            addCollectionTab.classList.add('active');
            break;
        case 'myGifts':
            myGiftsTab.classList.add('active');
            break;
    }
}

// Render marketplace gifts
function renderMarket() {
    // Clear the container
    marketGrid.innerHTML = '';
    
    // Filter and sort gifts
    const filteredGifts = gifts.filter(gift => {
        // Apply category filter
        if (currentCategory !== 'all' && gift.category !== currentCategory) {
            return false;
        }
        
        // Apply price filter
        if (currentPriceFilter === 'under-1' && gift.price >= 1) {
            return false;
        } else if (currentPriceFilter === '1-5' && (gift.price < 1 || gift.price > 5)) {
            return false;
        } else if (currentPriceFilter === '5-20' && (gift.price < 5 || gift.price > 20)) {
            return false;
        } else if (currentPriceFilter === 'over-20' && gift.price <= 20) {
            return false;
        }
        
        // Apply search filter
        if (searchTerm && !gift.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        
        return gift.forSale; // Only show gifts for sale
    });
    
    // Sort gifts
    filteredGifts.sort((a, b) => {
        if (currentSort === 'latest') {
            return b.id - a.id; // Newest first (assuming higher id = newer)
        } else if (currentSort === 'oldest') {
            return a.id - b.id; // Oldest first
        } else if (currentSort === 'price-high') {
            return b.price - a.price; // Highest price first
        } else if (currentSort === 'price-low') {
            return a.price - b.price; // Lowest price first
        }
        return 0;
    });
    
    // Check if we have any gifts to display
    if (filteredGifts.length === 0) {
        marketGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-gift empty-icon"></i>
                <h3 class="empty-title">No Gifts Found</h3>
                <p class="empty-message">Try changing your filters or check back later for new gifts.</p>
            </div>
        `;
        return;
    }
    
    // Create gift cards
    filteredGifts.forEach(gift => {
        const card = createGiftCard(gift);
        marketGrid.appendChild(card);
    });
}

// Render my collections
function renderMyCollections() {
    // Clear the container
    myCollectionsContainer.innerHTML = '';
    
    // Check if we have any collections
    if (collections.length === 0) {
        myCollectionsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-layer-group empty-icon"></i>
                <h3 class="empty-title">No Collections Yet</h3>
                <p class="empty-message">Create your first collection to organize and showcase your gifts.</p>
                <button class="primary-button" id="create-first-collection-btn">
                    <i class="fas fa-plus"></i> Create Collection
                </button>
            </div>
        `;
        
        // Add event listener to the create button
        const createFirstBtn = document.getElementById('create-first-collection-btn');
        if (createFirstBtn) {
            createFirstBtn.addEventListener('click', () => {
                showView('addCollection');
            });
        }
        
        return;
    }
    
    // Create collection cards
    collections.forEach(collection => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.setAttribute('data-id', collection.id);
        
        card.innerHTML = `
            <img src="${collection.thumbnail}" alt="${collection.name}" class="collection-thumbnail">
            <div class="collection-info">
                <div>
                    <h3 class="collection-name">${collection.name}</h3>
                    <p class="collection-description">${collection.description}</p>
                </div>
                <div>
                    <div class="collection-stats">
                        <div class="collection-stat">
                            <i class="fas fa-gift"></i>
                            <span>${collection.giftCount} gifts</span>
                        </div>
                        <div class="collection-stat">
                            <i class="fas fa-gem"></i>
                            <span>${collection.totalPrice.toFixed(2)} TON</span>
                        </div>
                    </div>
                    <div class="collection-actions">
                        <button class="collection-action-btn primary" data-action="view" data-id="${collection.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${collection.forSale ? 
                            `<button class="collection-action-btn" data-action="remove-sale" data-id="${collection.id}">
                                <i class="fas fa-ban"></i> Remove from Sale
                            </button>` : 
                            `<button class="collection-action-btn" data-action="sell" data-id="${collection.id}">
                                <i class="fas fa-tag"></i> Sell
                            </button>`
                        }
                        <button class="collection-action-btn" data-action="unpack" data-id="${collection.id}">
                            <i class="fas fa-box-open"></i> Unpack
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        myCollectionsContainer.appendChild(card);
        
        // Add event listeners to action buttons
        const actionButtons = card.querySelectorAll('.collection-action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = button.getAttribute('data-action');
                const collectionId = button.getAttribute('data-id');
                handleCollectionAction(action, collectionId);
            });
        });
        
        // Add event listener to the whole card
        card.addEventListener('click', () => {
            viewCollectionDetails(collection.id);
        });
    });
}

// Render my gifts
function renderMyGifts() {
    // Clear the container
    myGiftsGrid.innerHTML = '';
    
    // Check if we have any gifts
    if (myGifts.length === 0) {
        myGiftsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-gift empty-icon"></i>
                <h3 class="empty-title">No Gifts Yet</h3>
                <p class="empty-message">Forward gift photos to the bot to add them to your collection.</p>
            </div>
        `;
        return;
    }
    
    // Create gift cards
    myGifts.forEach(gift => {
        const card = createGiftCard(gift, true);
        myGiftsGrid.appendChild(card);
    });
}

// Create a gift card element
function createGiftCard(gift, isMyGift = false) {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.setAttribute('data-id', gift.id);
    
    const inCartClass = cart.some(item => item.id === gift.id) ? 'in-cart' : '';
    
    card.innerHTML = `
        <img src="${gift.image}" alt="${gift.name}" class="gift-image">
        <div class="gift-buttons">
            <button class="gift-btn gift-info-btn" data-id="${gift.id}">
                <i class="fas fa-info-circle"></i>
            </button>
            ${isMyGift ? 
                `<button class="gift-btn gift-action-btn" data-action="return" data-id="${gift.id}">
                    <i class="fas fa-undo"></i>
                </button>` : 
                `<button class="gift-btn add-to-cart-btn ${inCartClass}" data-id="${gift.id}">
                    <i class="fas fa-cart-plus"></i>
                </button>`
            }
        </div>
        <div class="gift-details">
            <div class="gift-name">${gift.name}</div>
            <div class="gift-id">${gift.giftId}</div>
        </div>
        <div class="gift-price" style="background-color: ${gift.background || '#2ea6ff'}">
            ${gift.price.toFixed(2)} <i class="fas fa-gem"></i>
        </div>
    `;
    
    // Add event listeners
    const infoButton = card.querySelector('.gift-info-btn');
    infoButton.addEventListener('click', (e) => {
        e.stopPropagation();
        viewGiftDetails(gift.id);
    });
    
    if (isMyGift) {
        const actionButton = card.querySelector('.gift-action-btn');
        actionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = actionButton.getAttribute('data-action');
            const giftId = actionButton.getAttribute('data-id');
            handleGiftAction(action, giftId);
        });
    } else {
        const cartButton = card.querySelector('.add-to-cart-btn');
        cartButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const giftId = parseInt(cartButton.getAttribute('data-id'));
            toggleCartItem(giftId);
            
            // Toggle in-cart class
            cartButton.classList.toggle('in-cart');
        });
    }
    
    // Whole card click for details
    card.addEventListener('click', () => {
        viewGiftDetails(gift.id);
    });
    
    return card;
}

// Render cart
function renderCart() {
    // Clear the container
    cartItems.innerHTML = '';
    
    // Check if cart is empty
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart empty-icon"></i>
                <h3 class="empty-title">Your Cart is Empty</h3>
                <p class="empty-message">Add gifts to your cart to purchase them.</p>
                <button class="primary-button" id="continue-shopping-btn">
                    <i class="fas fa-store"></i> Continue Shopping
                </button>
            </div>
        `;
        
        // Hide summary
        document.getElementById('cart-summary').style.display = 'none';
        
        // Add event listener to continue shopping button
        const continueBtn = document.getElementById('continue-shopping-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                showView('market');
            });
        }
        
        return;
    }
    
    // Show summary
    document.getElementById('cart-summary').style.display = 'block';
    
    // Calculate total
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Update summary
    cartTotalItems.textContent = cart.length;
    cartTotalPrice.textContent = `${totalPrice.toFixed(2)} TON`;
    
    // Create cart items
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-id">${item.giftId}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">
                        <i class="fas fa-gem"></i> ${item.price.toFixed(2)}
                    </div>
                    <button class="remove-from-cart" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        
        // Add event listener to remove button
        const removeButton = cartItem.querySelector('.remove-from-cart');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const giftId = parseInt(removeButton.getAttribute('data-id'));
            removeFromCart(giftId);
        });
    });
}

// View gift details
function viewGiftDetails(giftId) {
    // Find the gift
    const gift = findGiftById(giftId);
    if (!gift) return;
    
    // Create gift details card
    const detailsContainer = document.getElementById('gift-details-container');
    detailsContainer.innerHTML = '';
    
    const detailCard = document.createElement('div');
    detailCard.className = 'gift-detail-card';
    
    const statusClass = gift.status === 'available' ? 'status-available' : 'status-in-collection';
    const isOwner = gift.owner === userInfo.username;
    
    detailCard.innerHTML = `
        <img src="${gift.image}" alt="${gift.name}" class="gift-detail-image">
        <div class="gift-detail-info">
            <div class="gift-detail-header">
                <h3 class="gift-detail-title">${gift.name}</h3>
                <div class="gift-detail-price">
                    <i class="fas fa-gem"></i> ${gift.price.toFixed(2)}
                </div>
            </div>
            <div class="gift-detail-id">${gift.giftId}</div>
            <div class="gift-detail-status ${statusClass}">
                ${gift.status.charAt(0).toUpperCase() + gift.status.slice(1)}
            </div>
            <div class="gift-detail-owner">
                Owner: ${gift.owner}
            </div>
            <div class="gift-detail-actions">
                ${isOwner ? 
                    `${gift.forSale ? 
                        `<button class="action-button secondary-action" data-action="remove-sale" data-id="${gift.id}">
                            <i class="fas fa-ban"></i> Remove from Sale
                        </button>` : 
                        `<button class="action-button secondary-action" data-action="sell" data-id="${gift.id}">
                            <i class="fas fa-tag"></i> Put on Sale
                        </button>`
                    }
                    <button class="action-button secondary-action" data-action="add-to-collection" data-id="${gift.id}">
                        <i class="fas fa-folder-plus"></i> Add to Collection
                    </button>` : 
                    `${gift.forSale ? 
                        `<button class="action-button primary-action" data-action="buy" data-id="${gift.id}">
                            <i class="fas fa-shopping-bag"></i> Buy Now
                        </button>
                        <button class="action-button secondary-action" data-action="add-to-cart" data-id="${gift.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>` : 
                        `<button class="action-button secondary-action" data-action="contact" data-id="${gift.id}">
                            <i class="fas fa-envelope"></i> Contact Owner
                        </button>`
                    }`
                }
            </div>
        </div>
    `;
    
    detailsContainer.appendChild(detailCard);
    
    // Add event listeners to action buttons
    const actionButtons = detailCard.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = button.getAttribute('data-action');
            const id = button.getAttribute('data-id');
            handleGiftAction(action, id);
        });
    });
    
    // Show details view
    showView('giftDetails');
}

// View collection details
function viewCollectionDetails(collectionId) {
    // Find the collection
    const collection = collections.find(c => c.id === parseInt(collectionId));
    if (!collection) return;
    
    // Create collection details
    const detailsContainer = document.getElementById('collection-details-container');
    detailsContainer.innerHTML = '';
    
    const detailHeader = document.createElement('div');
    detailHeader.className = 'collection-detail-header';
    
    detailHeader.innerHTML = `
        <h2 class="collection-detail-title">${collection.name}</h2>
        <p class="collection-detail-description">${collection.description}</p>
        <div class="collection-detail-stats">
            <div class="collection-detail-stat">
                <div class="stat-value">${collection.giftCount}</div>
                <div class="stat-label">Gifts</div>
            </div>
            <div class="collection-detail-stat">
                <div class="stat-value">${collection.totalPrice.toFixed(2)}</div>
                <div class="stat-label">TON</div>
            </div>
            <div class="collection-detail-stat">
                <div class="stat-value">${collection.owner}</div>
                <div class="stat-label">Owner</div>
            </div>
        </div>
        <div class="gift-detail-actions">
            ${collection.owner === userInfo.username ? 
                `${collection.forSale ? 
                    `<button class="action-button secondary-action" data-action="remove-sale-collection" data-id="${collection.id}">
                        <i class="fas fa-ban"></i> Remove from Sale
                    </button>` : 
                    `<button class="action-button secondary-action" data-action="sell-collection" data-id="${collection.id}">
                        <i class="fas fa-tag"></i> Sell Collection
                    </button>`
                }
                <button class="action-button secondary-action" data-action="unpack-collection" data-id="${collection.id}">
                    <i class="fas fa-box-open"></i> Unpack Collection
                </button>` : 
                `${collection.forSale ? 
                    `<button class="action-button primary-action" data-action="buy-collection" data-id="${collection.id}">
                        <i class="fas fa-shopping-bag"></i> Buy Collection
                    </button>` : 
                    `<button class="action-button secondary-action" data-action="contact-collection" data-id="${collection.id}">
                        <i class="fas fa-envelope"></i> Contact Owner
                    </button>`
                }`
            }
        </div>
    `;
    
    detailsContainer.appendChild(detailHeader);
    
    // Add event listeners to action buttons
    const actionButtons = detailHeader.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = button.getAttribute('data-action');
            const id = button.getAttribute('data-id');
            handleCollectionAction(action, id);
        });
    });
    
    // Add gifts in this collection (for demo, just show random gifts)
    const giftsTitle = document.createElement('h3');
    giftsTitle.className = 'collection-gifts-title';
    giftsTitle.textContent = 'Gifts in this Collection';
    detailsContainer.appendChild(giftsTitle);
    
    const giftsGrid = document.createElement('div');
    giftsGrid.className = 'gift-grid';
    
    // Get random gifts from our available gifts
    const collectionGifts = [...gifts, ...myGifts].slice(0, collection.giftCount);
    
    collectionGifts.forEach(gift => {
        const card = createGiftCard({...gift, status: 'in_collection'});
        giftsGrid.appendChild(card);
    });
    
    detailsContainer.appendChild(giftsGrid);
    
    // Show details view
    showView('collectionDetails');
}

// Find a gift by ID across all gift arrays
function findGiftById(giftId) {
    const id = parseInt(giftId);
    return gifts.find(g => g.id === id) || myGifts.find(g => g.id === id);
}

// Toggle a gift in the cart
function toggleCartItem(giftId) {
    const gift = findGiftById(giftId);
    if (!gift) return;
    
    // Check if already in cart
    const existingIndex = cart.findIndex(item => item.id === giftId);
    
    if (existingIndex !== -1) {
        // Remove from cart
        cart.splice(existingIndex, 1);
    } else {
        // Add to cart
        cart.push(gift);
        
        // Haptic feedback if available
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
        
        // Show toast notification
        showToast('Added to cart', 'success');
    }
    
    // Update cart UI
    updateCartUI();
}

// Remove item from cart
function removeFromCart(giftId) {
    const existingIndex = cart.findIndex(item => item.id === giftId);
    
    if (existingIndex !== -1) {
        // Remove from cart
        cart.splice(existingIndex, 1);
        
        // Update cart UI
        updateCartUI();
        
        // Rerender cart view if currently visible
        if (currentView === 'cart') {
            renderCart();
        }
    }
}

// Update cart UI indicators
function updateCartUI() {
    // Update cart count
    cartCount.textContent = cart.length;
    
    // Show/hide cart indicator
    if (cart.length > 0) {
        cartIndicator.classList.add('active');
    } else {
        cartIndicator.classList.remove('active');
    }
}

// Handle gift actions
function handleGiftAction(action, giftId) {
    console.log(`Handling gift action: ${action} for gift ${giftId}`);
    
    switch (action) {
        case 'buy':
            buyGift(giftId);
            break;
        case 'add-to-cart':
            toggleCartItem(parseInt(giftId));
            // Switch back to details view (will refresh the UI)
            viewGiftDetails(parseInt(giftId));
            break;
        case 'sell':
            sellGift(giftId);
            break;
        case 'remove-sale':
            removeGiftFromSale(giftId);
            break;
        case 'add-to-collection':
            addGiftToCollection(giftId);
            break;
        case 'return':
            returnGiftToAccount(giftId);
            break;
        case 'contact':
            contactGiftOwner(giftId);
            break;
    }
}

// Handle collection actions
function handleCollectionAction(action, collectionId) {
    console.log(`Handling collection action: ${action} for collection ${collectionId}`);
    
    switch (action) {
        case 'view':
            viewCollectionDetails(parseInt(collectionId));
            break;
        case 'sell':
        case 'sell-collection':
            sellCollection(collectionId);
            break;
        case 'remove-sale':
        case 'remove-sale-collection':
            removeCollectionFromSale(collectionId);
            break;
        case 'unpack':
        case 'unpack-collection':
            unpackCollection(collectionId);
            break;
        case 'buy-collection':
            buyCollection(collectionId);
            break;
        case 'contact-collection':
            contactCollectionOwner(collectionId);
            break;
    }
}

// Add event listeners
function addEventListeners() {
    // Navigation tabs
    marketTab.addEventListener('click', () => showView('market'));
    myCollectionsTab.addEventListener('click', () => showView('myCollections'));
    addCollectionTab.addEventListener('click', () => showView('addCollection'));
    myGiftsTab.addEventListener('click', () => showView('myGifts'));
    
    // Cart view button
    viewCartBtn.addEventListener('click', () => showView('cart'));
    
    // Add funds button
    addFundsBtn.addEventListener('click', handleAddFunds);
    
    // Create collection button
    createCollectionBtn.addEventListener('click', handleCreateCollection);
    
    // Checkout button
    checkoutBtn.addEventListener('click', handleCheckout);
    
    // Filter categories
    filterCategories.forEach(category => {
        category.addEventListener('click', () => {
            // Remove active class from all categories
            filterCategories.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked category
            category.classList.add('active');
            
            // Update current category
            currentCategory = category.getAttribute('data-category');
            
            // Rerender market
            renderMarket();
        });
    });
    
    // Sort option
    sortOption.addEventListener('click', () => {
        // Show sort modal
        sortModal.classList.add('active');
    });
    
    // Price option
    priceOption.addEventListener('click', () => {
        // Show price modal
        priceModal.classList.add('active');
    });
    
    // Modal options
    document.querySelectorAll('.modal-option').forEach(option => {
        option.addEventListener('click', () => {
            const modal = option.closest('.modal');
            const value = option.getAttribute('data-value');
            
            if (modal.id === 'sort-modal') {
                // Update sort
                currentSort = value;
                sortOption.querySelector('.filter-value').textContent = option.textContent;
            } else if (modal.id === 'price-modal') {
                // Update price filter
                currentPriceFilter = value;
                priceOption.querySelector('.filter-value').textContent = option.textContent;
            }
            
            // Close modal
            modal.classList.remove('active');
            
            // Rerender market
            renderMarket();
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            // Close parent modal
            button.closest('.modal').classList.remove('active');
        });
    });
    
    // Search input
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.trim();
        renderMarket();
    });
    
    // Back button
    backButton.addEventListener('click', handleBackButton);
    
    // Refresh button
    refreshButton.addEventListener('click', () => {
        fetchData();
        showToast('Refreshed content', 'info');
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Handle back button
function handleBackButton() {
    // If in detail view, go back to previous view
    if (currentView === 'giftDetails') {
        if (previousView === 'cart') {
            showView('cart');
        } else if (previousView === 'myGifts') {
            showView('myGifts');
        } else {
            showView('market');
        }
    } else if (currentView === 'collectionDetails') {
        showView('myCollections');
    } else if (currentView === 'cart') {
        showView('market');
    } else {
        // Otherwise, send back event to Telegram
        tg.close();
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Track previous view for back button
let previousView = 'market';

// Before changing view, store current view
const originalShowView = showView;
showView = function(viewName) {
    if (currentView !== viewName) {
        previousView = currentView;
    }
    originalShowView(viewName);
};

// Action functions

// Handle add funds
function handleAddFunds() {
    console.log('Add funds clicked');
    
    // Send message to bot
    sendDataToBot({
        action: 'deposit_request'
    });
    
    // Close the WebApp
    tg.close();
}

// Handle create collection
function handleCreateCollection() {
    console.log('Create collection clicked');
    
    // Send message to bot
    sendDataToBot({
        action: 'create_collection'
    });
    
    // Close the WebApp
    tg.close();
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // Calculate total
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Check if user has enough balance
    if (userInfo.balance < totalPrice) {
        showToast('Insufficient balance', 'error');
        return;
    }
    
    console.log('Checkout clicked');
    
    // Format cart data for the bot
    const cartData = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        giftId: item.giftId
    }));
    
    // Send message to bot
    sendDataToBot({
        action: 'checkout',
        cart: cartData,
        totalPrice: totalPrice
    });
    
    // Clear cart and UI
    cart = [];
    updateCartUI();
    renderCart();
    
    // Show success message
    showToast('Order has been sent', 'success');
}

// Buy gift
function buyGift(giftId) {
    const gift = findGiftById(giftId);
    if (!gift) return;
    
    // Check if user has enough balance
    if (userInfo.balance < gift.price) {
        showToast('Insufficient balance', 'error');
        return;
    }
    
    console.log(`Buy gift: ${giftId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'buy_gift',
        gift_id: giftId,
        price: gift.price
    });
    
    // Show confirmation
    showToast('Purchase request sent', 'success');
    
    // Close WebApp
    tg.close();
}

// Sell gift
function sellGift(giftId) {
    console.log(`Sell gift: ${giftId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'sell_gift',
        gift_id: giftId
    });
    
    // Close WebApp
    tg.close();
}

// Remove gift from sale
function removeGiftFromSale(giftId) {
    console.log(`Remove gift from sale: ${giftId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'remove_sale_gift',
        gift_id: giftId
    });
    
    // Update UI
    const gift = findGiftById(giftId);
    if (gift) {
        gift.forSale = false;
        
        // If in details view, refresh it
        if (currentView === 'giftDetails') {
            viewGiftDetails(parseInt(giftId));
        }
        
        // Rerender market
        renderMarket();
        renderMyGifts();
    }
    
    // Show confirmation
    showToast('Gift removed from sale', 'success');
}

// Add gift to collection
function addGiftToCollection(giftId) {
    console.log(`Add gift to collection: ${giftId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'add_to_collection',
        gift_id: giftId
    });
    
    // Close WebApp
    tg.close();
}

// Return gift to account
function returnGiftToAccount(giftId) {
    console.log(`Return gift to account: ${giftId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'return_gift',
        gift_id: giftId
    });
    
    // Close WebApp
    tg.close();
}

// Contact gift owner
function contactGiftOwner(giftId) {
    console.log(`Contact gift owner: ${giftId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'contact_gift_owner',
        gift_id: giftId
    });
    
    // Close WebApp
    tg.close();
}

// Sell collection
function sellCollection(collectionId) {
    console.log(`Sell collection: ${collectionId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'sell_collection',
        collection_id: collectionId
    });
    
    // Close WebApp
    tg.close();
}

// Remove collection from sale
function removeCollectionFromSale(collectionId) {
    console.log(`Remove collection from sale: ${collectionId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'remove_sale_collection',
        collection_id: collectionId
    });
    
    // Update UI
    const collection = collections.find(c => c.id === parseInt(collectionId));
    if (collection) {
        collection.forSale = false;
        
        // If in details view, refresh it
        if (currentView === 'collectionDetails') {
            viewCollectionDetails(parseInt(collectionId));
        }
        
        // Rerender collections
        renderMyCollections();
    }
    
    // Show confirmation
    showToast('Collection removed from sale', 'success');
}

// Unpack collection
function unpackCollection(collectionId) {
    console.log(`Unpack collection: ${collectionId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'unpack_collection',
        collection_id: collectionId
    });
    
    // Close WebApp
    tg.close();
}

// Buy collection
function buyCollection(collectionId) {
    const collection = collections.find(c => c.id === parseInt(collectionId));
    if (!collection) return;
    
    // Check if user has enough balance
    if (userInfo.balance < collection.totalPrice) {
        showToast('Insufficient balance', 'error');
        return;
    }
    
    console.log(`Buy collection: ${collectionId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'buy_collection',
        collection_id: collectionId,
        price: collection.totalPrice
    });
    
    // Show confirmation
    showToast('Purchase request sent', 'success');
    
    // Close WebApp
    tg.close();
}

// Contact collection owner
function contactCollectionOwner(collectionId) {
    console.log(`Contact collection owner: ${collectionId}`);
    
    // Send message to bot
    sendDataToBot({
        action: 'contact_collection_owner',
        collection_id: collectionId
    });
    
    // Close WebApp
    tg.close();
}

// Send data to the Telegram bot
function sendDataToBot(data) {
    // Add user info if available
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        data.user_id = tg.initDataUnsafe.user.id;
        data.username = tg.initDataUnsafe.user.username;
    }
    
    // Send data to the bot
    tg.sendData(JSON.stringify(data));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle messages from the bot
window.addEventListener('message', (event) => {
    if (event.source === window && event.data && typeof event.data === 'string') {
        try {
            const data = JSON.parse(event.data);
            console.log('Received data from bot:', data);
            
            // Process different types of data
            if (data.type === 'balance_update') {
                updateBalance(data.balance);
            } else if (data.type === 'gifts_update') {
                gifts = data.gifts || gifts;
                renderMarket();
            } else if (data.type === 'collections_update') {
                collections = data.collections || collections;
                renderMyCollections();
            } else if (data.type === 'my_gifts_update') {
                myGifts = data.gifts || myGifts;
                renderMyGifts();
            }
        } catch (error) {
            console.error('Error parsing bot message:', error);
        }
    }
});

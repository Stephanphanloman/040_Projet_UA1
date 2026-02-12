// ===============================
// Maitres Fleuristes - Application JavaScript
// ===============================

// Donnees des produits
const products = [
  { id: 1, name: "Bouquet Signature", price: 45.00, image: "img/Bouquet.jpg" },
  { id: 2, name: "Plante interieure premium", price: 32.00, image: "img/Interieur.jpg" },
  { id: 3, name: "Vase decoratif", price: 39.00, image: "img/Vase.jpg" },
  { id: 4, name: "Arrangement floral", price: 55.00, image: "img/arrangement.jpg" }
];

// Panier (stockage local)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===============================
// Initialisation au chargement
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  initProducts();
  initCartModal();
  updateCartDisplay();
});

// ===============================
// Initialisation des produits
// ===============================
function initProducts() {
  const productElements = document.querySelectorAll('.product');
  
  productElements.forEach((productEl, index) => {
    const product = products[index];
    if (!product) return;
    
    // Ajouter l'attribut data-id
    productEl.dataset.id = product.id;
    
    // Creer le bouton d'ajout au panier s'il n'existe pas
    if (!productEl.querySelector('.add-to-cart-btn')) {
      const addBtn = document.createElement('button');
      addBtn.className = 'add-to-cart-btn';
      addBtn.textContent = 'Ajouter au panier';
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id);
      });
      productEl.appendChild(addBtn);
    }
  });
}

// ===============================
// Gestion du panier
// ===============================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartDisplay();
  showNotification(product.name + ' ajoute au panier');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartDisplay();
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartDisplay();
  }
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartDisplay();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ===============================
// Affichage du panier
// ===============================
function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  // Mettre a jour le compteur
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
  }
  
  // Mettre a jour les articles du panier
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">${item.price.toFixed(2)} $ CAD</span>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="qty-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Supprimer">X</button>
          </div>
        </div>
      `).join('');
    }
  }
  
  // Mettre a jour le total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (cartTotal) {
    cartTotal.textContent = total.toFixed(2);
  }
}

// ===============================
// Modal du panier
// ===============================
function initCartModal() {
  const cartBtn = document.getElementById('cart-btn');
  const cartModal = document.getElementById('cart-modal');
  
  if (!cartBtn || !cartModal) return;
  
  // Ajouter le bouton de fermeture
  if (!cartModal.querySelector('.close-cart')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-cart';
    closeBtn.textContent = 'X';
    closeBtn.addEventListener('click', closeCart);
    cartModal.insertBefore(closeBtn, cartModal.firstChild);
  }
  
  // Ajouter le bouton vider le panier
  if (!cartModal.querySelector('.clear-cart-btn')) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-cart-btn';
    clearBtn.textContent = 'Vider le panier';
    clearBtn.addEventListener('click', clearCart);
    cartModal.appendChild(clearBtn);
  }
  
  // Ouvrir/fermer le panier
  cartBtn.addEventListener('click', toggleCart);
  
  // Fermer en cliquant a l'exterieur
  document.addEventListener('click', (e) => {
    if (cartModal.classList.contains('open') && 
        !cartModal.contains(e.target) && 
        !cartBtn.contains(e.target)) {
      closeCart();
    }
  });
  
  // Fermer avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
    }
  });
}

function toggleCart() {
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    cartModal.classList.toggle('open');
  }
}

function openCart() {
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    cartModal.classList.add('open');
  }
}

function closeCart() {
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    cartModal.classList.remove('open');
  }
}

// ===============================
// Notifications
// ===============================
function showNotification(message) {
  // Supprimer l'ancienne notification si elle existe
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Creer la nouvelle notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animation d'apparition
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Disparition apres 2 secondes
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

// ===============================
// Navigation fluide
// ===============================
document.querySelectorAll('header nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});
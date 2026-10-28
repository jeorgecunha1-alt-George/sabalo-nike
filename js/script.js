const products = [
  { id: 1, name: "Air Style Black", price: 45000, img: "images/black.jpg" },
  { id: 2, name: "White Runner", price: 38000, img: "images/white-runner.jpg" },
  { id: 3, name: "Red Urban", price: 52000, img: "images/red.jpg" },
  { id: 4, name: "Grey Minimal", price: 41000, img: "images/grey.jpg" },
  { id: 5, name: "Blue Sport", price: 47000, img: "images/blue.jpg" },
  { id: 6, name: "White Classic", price: 39000, img: "images/minimal-white.jpg" }
];

let cart = JSON.parse(localStorage.getItem('sabaloCart')) || [];

const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout');

function renderProducts() {
  productList.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="price">${p.price.toLocaleString()} Kz</div>
        <button class="add-btn" data-id="${p.id}">Adicionar ao Carrinho</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  alert(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('sabaloCart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center; padding:2rem; color:#aaa;">Carrinho vazio</p>';
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          ${item.qty} × ${item.price.toLocaleString()} Kz
        </div>
        <button class="remove-btn" data-id="${item.id}">Remover</button>
      </div>
    `).join('');

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
    });
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  cartTotal.textContent = total.toLocaleString();
}

function openCart() {
  cartModal.classList.add('show');
  updateCartUI();
}

function closeCart() {
  cartModal.classList.remove('show');
}

// Eventos
openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('O carrinho está vazio!');
    return;
  }
  alert('Obrigado pela compra!\n\nEm breve podes adicionar pagamento real (MBWay, Multicaixa, etc.).');
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
});

// Fechar modal ao clicar fora
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) closeCart();
});

// Inicializar
renderProducts();
updateCartUI();

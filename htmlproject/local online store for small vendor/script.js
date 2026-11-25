const products = [
  {
    id:'apples',
    name:'Fresh Apples',
    category:'Fruits',
    price:120,
    unit:'per kg',
    image:'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600',
    tag:'Best seller'
  },
  {
    id:'banana',
    name:'Banana',
    category:'Fruits',
    price:50,
    unit:'per dozen',
    image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600',
    tag:'Fresh'
  },
  {
    id:'orange',
    name:'Orange',
    category:'Fruits',
    price:80,
    unit:'per kg',
    image:'https://images.unsplash.com/photo-1547514701-42782101795e?w=600'
  },
  {
    id:'tomato',
    name:'Tomato',
    category:'Vegetables',
    price:30,
    unit:'per kg',
    image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600'
  },
  {
    id:'potato',
    name:'Potato',
    category:'Vegetables',
    price:35,
    unit:'per kg',
    image:'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600'
  },
  {
    id:'onion',
    name:'Onion',
    category:'Vegetables',
    price:40,
    unit:'per kg',
    image:'https://images.unsplash.com/photo-1508747703725-719777637510?w=600'
  },
  {
    id:'spinach',
    name:'Spinach',
    category:'Vegetables',
    price:25,
    unit:'per bunch',
    image:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600',
    tag:'Fresh'
  },
  {
    id:'milk',
    name:'Milk Pack',
    category:'Dairy & Eggs',
    price:60,
    unit:'per pack',
    image:'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600',
    tag:'Daily pick'
  },
  {
    id:'eggs',
    name:'Farm Eggs',
    category:'Dairy & Eggs',
    price:90,
    unit:'per dozen',
    image:'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600'
  },
  {
    id:'paneer',
    name:'Paneer',
    category:'Dairy & Eggs',
    price:90,
    unit:'200 g',
    image:'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600'
  },
  {
    id:'curd',
    name:'Fresh Curd',
    category:'Dairy & Eggs',
    price:35,
    unit:'per cup',
    image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlNpV3G0kbrYe6EF9niTly1VlTj6hKSfYJvqyE0UnHNA&s=10'
  },
  {
    id:'bread',
    name:'Artisan Bread',
    category:'Bakery',
    price:40,
    unit:'per loaf',
    image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600'
  },
  {
    id:'rice',
    name:'Premium Rice',
    category:'Pantry',
    price:80,
    unit:'per kg',
    image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600'
  },
  {
    id:'chocolate',
    name:'Chocolate',
    category:'Snacks',
    price:25,
    unit:'per bar',
    image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600'
  },
  {
    id:'drink',
    name:'Cold Drink',
    category:'Beverages',
    price:45,
    unit:'per bottle',
    image:'https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600'
  }
];

const categoryList = [
  'All',
  'Fruits',
  'Vegetables',
  'Dairy & Eggs',
  'Bakery',
  'Pantry',
  'Snacks',
  'Beverages'
];

let activeCategory = 'All';
let cart = JSON.parse(localStorage.getItem('freshmartCart') || '{}');
let orders = JSON.parse(localStorage.getItem('freshmartOrders') || '[]');

const money = value => '₹' + Number(value).toLocaleString('en-IN');

function saveCart() {
  localStorage.setItem('freshmartCart', JSON.stringify(cart));
}

function renderCategories() {
  document.getElementById('categories').innerHTML = categoryList.map(category =>
    `<button class="category ${activeCategory === category ? 'active' : ''}"
      onclick="setCategory('${category}')">${category}</button>`
  ).join('');
}

function setCategory(category) {
  activeCategory = category;
  renderCategories();
  renderProducts();
}

function renderProducts() {
  const query = document.getElementById('search').value.trim().toLowerCase();

  const visibleProducts = products.filter(product =>
    (activeCategory === 'All' || product.category === activeCategory) &&
    (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  );

  const area = document.getElementById('productList');

  if (!visibleProducts.length) {
    area.innerHTML = '<div class="empty-products">No products found. Try another search.</div>';
    return;
  }

  area.innerHTML = visibleProducts.map(product => `
    <article class="product">
      <div class="photo">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      ${product.tag ? `<span class="tag">${product.tag}</span>` : ''}
      <div class="info">
        <div class="category-name">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="unit">${product.unit}</div>
        <div class="product-foot">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" onclick="addToCart('${product.id}')">＋ Add</button>
        </div>
      </div>
    </article>
  `).join('');
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  saveCart();
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

function cartCount() {
  return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
}

function subtotal() {
  return Object.entries(cart).reduce((sum, [id, quantity]) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * quantity;
  }, 0);
}

function renderCart() {
  const count = cartCount();
  const sub = subtotal();
  const delivery = sub === 0 || sub >= 499 ? 0 : 35;
  const total = sub + delivery;

  document.getElementById('cartCount').textContent = count;

  const rows = Object.entries(cart);
  const contents = document.getElementById('cartContents');

  if (!rows.length) {
    contents.innerHTML = `
      <div class="cart-empty">
        Your cart is empty.<br>
        Choose a few fresh favourites to get started.
      </div>
    `;
  } else {
    contents.innerHTML = '<div class="cart-items">' + rows.map(([id, quantity]) => {
      const product = products.find(item => item.id === id);

      return `
        <div class="cart-row">
          <img src="${product.image}" alt="">
          <div>
            <h4>${product.name}</h4>
            <small>${money(product.price)} · ${product.unit}</small>
            <div class="qty">
              <button type="button" aria-label="Decrease ${product.name}"
                onclick="changeQty('${id}',-1)">−</button>
              <span>${quantity}</span>
              <button type="button" aria-label="Increase ${product.name}"
                onclick="changeQty('${id}',1)">+</button>
              <button class="remove" type="button"
                onclick="removeItem('${id}')">Remove</button>
            </div>
          </div>
          <span class="line-total">${money(product.price * quantity)}</span>
        </div>
      `;
    }).join('') + '</div>';
  }

  document.getElementById('totals').innerHTML = rows.length ? `
    <div class="totals">
      <div class="total-line">
        <span>Subtotal</span><span>${money(sub)}</span>
      </div>
      <div class="total-line">
        <span>Delivery</span><span>${delivery === 0 ? 'Free' : money(delivery)}</span>
      </div>
      ${sub > 0 && sub < 499 ? `
        <div class="total-line">
          <span>Add ${money(499 - sub)} for free delivery</span><span></span>
        </div>
      ` : ''}
      <div class="total-line grand">
        <span>Total</span><span>${money(total)}</span>
      </div>
    </div>
  ` : '';

  const button = document.getElementById('placeButton');
  button.disabled = count === 0;
  button.textContent = `Place order · ${money(total)}`;
}

function placeOrder(event) {
  event.preventDefault();

  if (!cartCount()) return;

  const order = {
    number: 'FM' + Date.now().toString().slice(-7),
    name: document.getElementById('customerName').value.trim(),
    phone: document.getElementById('customerPhone').value.trim(),
    address: document.getElementById('customerAddress').value.trim(),
    items: Object.entries(cart).map(([id, quantity]) => ({
      name: products.find(product => product.id === id).name,
      quantity
    })),
    total: subtotal() + (subtotal() >= 499 ? 0 : 35),
    date: new Date().toLocaleString()
  };

  orders.unshift(order);
  localStorage.setItem('freshmartOrders', JSON.stringify(orders));

  cart = {};
  saveCart();
  renderCart();
  renderOrders();

  document.getElementById('orderForm').reset();
  document.getElementById('notice').textContent =
    `Order ${order.number} placed successfully!`;
}

function renderOrders() {
  const host = document.getElementById('orderHistory');

  if (!orders.length) {
    host.innerHTML = '';
    return;
  }

  host.innerHTML = `
    <div class="orders-list">
      <div class="category-name">Recent orders</div>
      ${orders.slice(0, 3).map(order => `
        <div class="order-card">
          <strong>Order ${order.number}</strong> · ${money(order.total)}<br>
          ${order.items.map(item => `${item.name} × ${item.quantity}`).join(', ')}<br>
          <small>${order.date}</small>
        </div>
      `).join('')}
    </div>
  `;
}

renderCategories();
renderProducts();
renderCart();
renderOrders();
 const products = [
    { id: 1, name: "Смартфон Apple iPhone 15 Pro 128GB", category: "phones", price: 44999, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", desc: "Дисплей Super Retina XDR 6.1\", чип A17 Pro, титановий корпус." },
    { id: 2, name: "Смартфон Samsung Galaxy S24 Ultra", category: "phones", price: 47999, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500", desc: "Экран Dynamic AMOLED 2X 6.8\", Snapdragon 8 Gen 3, камера 200 МП." },
    { id: 3, name: "Ноутбук Apple MacBook Air 13\" M2", category: "laptops", price: 42999, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500", desc: "Чип Apple M2, 8 ГБ оперативної пам'яті, 256 ГБ SSD, вага 1.24 кг." },
    { id: 4, name: "Ігрова консоль Sony PlayStation 5 Slim", category: "gaming", price: 22999, img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500", desc: "Підтримка 4K 120Hz, SSD 1 ТБ, геймпад DualSense." },
    { id: 5, name: "Відеокарта ASUS ROG Strix RTX 4070 Super", category: "laptops", price: 29999, img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500", desc: "12 ГБ GDDR6X, потужне охолодження, трасування променів." },
    { id: 6, name: "Робот-пилосос Roborock S8 White", category: "smarthome", price: 21999, img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500", desc: "Сухе та вологе прибирання, лазерна навігація LiDAR, 6000 Па." },
    { id: 7, name: "Холодильник Samsung Family Hub", category: "smarthome", price: 69999, img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500", desc: "Розумний холодильник з сенсорним дисплеєм та моніторингом свежості." },
    { id: 8, name: "Бездротові навушники Sony WH-1000XM5", category: "audio", price: 14999, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", desc: "Найкраще активне шумозаглушення (ANC), до 30 годин роботи." }
  ];
  
  let cart = [];
  let favorites = [];
  let currentCategory = "all";
  let maxPrice = 80000;
  let searchQuery = "";
  let discountPercent = 0;
  
  // Елементи DOM
  const productsGrid = document.getElementById("productsGrid");
  const cartBtn = document.getElementById("cartBtn");
  const cartModal = document.getElementById("cartModal");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const cartTotalPrice = document.getElementById("cartTotalPrice");
  const cartCount = document.getElementById("cartCount");
  const favCount = document.getElementById("favCount");
  const themeToggle = document.getElementById("themeToggle");
  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const categoryFilter = document.getElementById("categoryFilter");
  const promoInput = document.getElementById("promoInput");
  const applyPromoBtn = document.getElementById("applyPromoBtn");
  const productModal = document.getElementById("productModal");
  const productDetailContent = document.getElementById("productDetailContent");
  const closeProduct = document.getElementById("closeProduct");
  
  // Рендер товарів
  function renderProducts() {
    const filtered = products.filter(p => {
      const matchCat = currentCategory === "all" || p.category === currentCategory;
      const matchPrice = p.price <= maxPrice;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchPrice && matchSearch;
    });
  
    document.getElementById("productCount").innerText = Показано ${filtered.length} товарів;
  
    productsGrid.innerHTML = filtered.map(p => `
      <div class="product-card">
        <button class="fav-icon-btn ${favorites.includes(p.id) ? 'active' : ''}" onclick="toggleFav(${p.id})">
          <i class="fa-solid fa-heart"></i>
   </button>
        <img src="${p.img}" class="product-img" onclick="showProductDetails(${p.id})" alt="${p.name}">
        <div class="product-info">
          <div class="product-title" onclick="showProductDetails(${p.id})">${p.name}</div>
          <div class="product-price">${p.price.toLocaleString()} грн</div>
          <button class="btn btn-primary" onclick="addToCart(${p.id})">У кошик</button>
        </div>
      </div>
    ).join("");
  }
  
  // Додавання d кошик
  function addToCart(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty++;
    } else {
      cart.push({ id, qty: 1 });
    }
    updateCart();
  }
  
  // Оновлення кошика
  function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.innerText = totalItems;
  
    let totalSum = 0;
    cartItems.innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      const itemTotal = p.price * item.qty;
      totalSum += itemTotal;
      return 
        <div class="cart-item">
          <img src="${p.img}">
          <div style="flex: 1;">
            <h4>${p.name}</h4>
            <p>${p.price.toLocaleString()} грн × ${item.qty}</p>
          </div>
          <button onclick="removeFromCart(${p.id})" style="background:none; border:none; color:red; cursor:pointer;">&times;</button>
        </div>
      ;
    }).join("");
  
    if (discountPercent > 0) {
      totalSum = totalSum * ((100 - discountPercent) / 100);
    }
  
    cartTotalPrice.innerText = ${Math.round(totalSum).toLocaleString()} грн;
  }
  
  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
  }
  
  function toggleFav(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(fId => fId !== id);
    } else {
      favorites.push(id);
    }
    favCount.innerText = favorites.length;
    renderProducts();
  }
  
  function showProductDetails(id) {
    const p = products.find(prod => prod.id === id);
    productDetailContent.innerHTML = 
      <div class="product-detail-layout">
        <img src="${p.img}">
        <div>
          <h2>${p.name}</h2>
          <p style="margin: 15px 0; color: var(--text-secondary);">${p.desc}</p>
          <h3 style="color: var(--accent); margin-bottom: 20px;">${p.price.toLocaleString()} грн</h3>
          <button class="btn btn-primary" onclick="addToCart(${p.id})">Додати в кошик</button>
        </div>
      </div>
    ;
    productModal.classList.add("active");
  }
  
  // Події
  cartBtn.onclick = () => cartModal.classList.add("active");
  closeCart.onclick = () => cartModal.classList.remove("active");
  closeProduct.onclick = () => productModal.classList.remove("active");
  
  themeToggle.onclick = () => {
    const isLight = document.body.getAttribute("data-theme") === "light";
    document.body.setAttribute("data-theme", isLight ? "dark" : "light");
  };
  
  searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderProducts();
  };
  
  priceRange.oninput = (e) => {
    maxPrice = Number(e.target.value);
    priceValue.innerText = ${maxPrice.toLocaleString()} грн`;
    renderProducts();
  };
  
  categoryFilter.onclick = (e) => {
    if (e.target.tagName === "LI") {
      document.querySelectorAll("#categoryFilter li").forEach(li => li.classList.remove("active"));
      e.target.classList.add("active");
      currentCategory = e.target.dataset.cat;
      renderProducts();
    }
  };
  
  applyPromoBtn.onclick = () => {
    if (promoInput.value.toUpperCase() === "UKR10") {
      discountPercent = 10;
      alert("Промокод додано! Знижка 10%");
      updateCart();
    } else {
      alert("Невідомий промокод");
    }
  };
  
  // Ініціалізація
  renderProducts();
 document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Смартфон Apple iPhone 15 Pro 128GB", category: "phones", price: 44999, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500" },
    { id: 2, name: "Смартфон Samsung Galaxy S24 Ultra", category: "phones", price: 47999, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500" },
    { id: 3, name: "Ноутбук Apple MacBook Air 13\" M2", category: "laptops", price: 42999, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
    { id: 4, name: "Ігрова консоль Sony PlayStation 5 Slim", category: "gaming", price: 22999, img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500" },
    { id: 5, name: "Відеокарта ASUS ROG Strix RTX 4070 Super", category: "laptops", price: 29999, img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500" },
    { id: 6, name: "Робот-пилосос Roborock S8 White", category: "smarthome", price: 21999, img: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=500" },
    { id: 7, name: "Холодильник Samsung Family Hub", category: "smarthome", price: 69999, img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd38?w=500" },
    { id: 8, name: "Бездротові навушники Sony WH-1000XM5", category: "audio", price: 14999, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" }
  ];

  let cart = [];
  let favorites = [];
  let currentCategory = "all";
  let maxPrice = 80000;
  let searchQuery = "";

  // Элементы из HTML
  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const categoryItems = document.querySelectorAll("#categoryFilter li");
  const productCount = document.getElementById("productCount");
  const cartCount = document.getElementById("cartCount");
  const favCount = document.getElementById("favCount");
  const cartBtn = document.getElementById("cartBtn");
  const cartModal = document.getElementById("cartModal");
  const closeCart = document.getElementById("closeCart");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalPrice = document.getElementById("cartTotalPrice");

  // Функция отрисовки товаров
  function renderProducts() {
    if (!productsGrid) return;

    const filtered = products.filter(product => {
      const matchCategory = (currentCategory === "all") || (product.category === currentCategory);
      const matchPrice = product.price <= maxPrice;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchPrice && matchSearch;
    });

    productsGrid.innerHTML = "";
    if (productCount) {
      productCount.textContent = `Показано ${filtered.length} товарів`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `<p class="no-products" style="color: #fff; grid-column: 1 / -1; text-align: center; padding: 20px;">Нічого не знайдено</p>`;
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.style.cssText = "background: #1e1e2f; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 10px rgba(0,0,0,0.3);";
      
      const isFav = favorites.includes(product.id);

      card.innerHTML = `
        <div>
          <div style="position: relative;">
            <img src="${product.img}" alt="${product.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
 <button class="fav-toggle-btn" data-id="${product.id}" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; color: ${isFav ? '#ef4444' : '#fff'}; display: flex; align-items: center; justify-content: center;">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
          <h3 style="font-size: 16px; margin-bottom: 8px; color: #fff;">${product.name}</h3>
        </div>
        <div>
          <p class="price" style="font-weight: bold; color: #38bdf8; font-size: 18px; margin-bottom: 12px;">${product.price.toLocaleString()} грн</p>
          <button class="add-to-cart-btn" data-id="${product.id}" style="background: #38bdf8; color: #000; border: none; padding: 10px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; transition: background 0.2s;">У кошик</button>
        </div>
      ;

      productsGrid.appendChild(card);
    });

    // Навешиваем клики на кнопки в карточках
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.currentTarget.getAttribute("data-id"));
        addToCart(id);
      });
    });

    document.querySelectorAll(".fav-toggle-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.currentTarget.getAttribute("data-id"));
        toggleFavorite(id);
      });
    });
  }

  // Добавление в кошик
  window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
      cart.push(product);
      updateCartUI();
    }
  };

  // Избранное
  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
    } else {
      favorites.push(id);
    }
    if (favCount) favCount.textContent = favorites.length;
    renderProducts();
  }

  // Обновление кошика
  function updateCartUI() {
    if (cartCount) cartCount.textContent = cart.length;
    
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = "";
      let total = 0;

      cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement("div");
        div.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 8px;";
        div.innerHTML = 
          <span style="color: #fff; font-size: 14px;">${item.name}</span>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="color: #38bdf8; font-weight: bold;">${item.price} грн</span>
            <button onclick="window.removeFromCart(${index})" style="background: transparent; border: none; color: #ef4444; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
          </div>
        ;
        cartItemsContainer.appendChild(div);
      });

      if (cartTotalPrice) cartTotalPrice.textContent = ${total.toLocaleString()} грн;
    }
  }

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
  };

  // Поиск
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Фильтр по категориям
  categoryItems.forEach(item => {
    item.addEventListener("click", () => {
      categoryItems.forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      currentCategory = item.getAttribute("data-cat");
      renderProducts();
    });
  });

  // Ползунок цены
  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      maxPrice = Number(e.target.value);
      if (priceValue) priceValue.textContent = ${maxPrice.toLocaleString()} грн`;
      renderProducts();
    });
  }

  // Открытие/закрытие модального окна кошика
  if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", () => {
      cartModal.style.display = "flex";
    });
  }
 if (closeCart && cartModal) {
    closeCart.addEventListener("click", () => {
      cartModal.style.display = "none";
    });
  }

  // Первый запуск
  renderProducts();
});
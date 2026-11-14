document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Смартфон Apple iPhone 15 Pro 128GB", category: "phones", price: 44999, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500" },
    { id: 2, name: "Смартфон Samsung Galaxy S24 Ultra", category: "phones", price: 47999, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500" },
    { id: 3, name: "Ноутбук Apple MacBook Air 13\" M2", category: "laptops", price: 42999, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500" },
    { id: 4, name: "Ігрова консоль Sony PlayStation 5 Slim", category: "gaming", price: 22999, img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500" },
    { id: 5, name: "Відеокарта ASUS ROG Strix RTX 4070 Super", category: "laptops", price: 90000, img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTO7Z0OTzd7em3Nvq-TZtefIhC4kVM-3AkAJA_76xRsdhp-UYvsaBS8avTmCxqvIiMz_AVlgfDEBp80NBiaPRQ7KX9o1ZAKLNYbpHlsCA&usqp=CAc" },
    { id: 6, name: "Робот-пилосос Roborock S8 White", category: "smarthome", price: 21999, img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQU3rTFGia1cCjiRZALnHbjOh8-qVQMdc60_4BhUYWKykphOVplkGsZZZ1vfFt1uQHF4HhAOlNyJYtTR5B6lO-c82didkO58A_itJErwqRHtLVYWku9I3v7hiNLKv7xAQg3B_-nSLzdRjg&usqp=CAc?w-500" },
    { id: 7, name: "Холодильник Samsung Family Hub", category: "smarthome", price: 122658, img: "https://images.prom.ua/6333256659_w449_h430_holodilnik-samsung-family.jpg" },
    { id: 8, name: "Бездротові навушники Sony WH-1000XM5", category: "audio", price: 14999, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" }
  ];

  let cart = [];
  let favorites = [];
  let currentCategory = "all";
  let maxPrice = 150000;
  let searchQuery = "";
  let currentCurrency = "UAH";

  // Курсы валют относительно гривны
  const exchangeRates = {
    UAH: 1,
    USD: 41.5,
    EUR: 43.5
  };

  const currencySymbols = {
    UAH: "грн",
    USD: "$",
    EUR: "€"
  };

  // Конвертация и форматирование цены
  function formatPrice(priceInUah) {
    const rate = exchangeRates[currentCurrency];
    const converted = priceInUah / rate;
    const symbol = currencySymbols[currentCurrency];

    if (currentCurrency === "UAH") {
      return `${Math.round(converted).toLocaleString()} ${symbol}`;
    } else {
      return `${symbol}${converted.toFixed(2)}`;
    }
  }

  // Элементы из HTML
  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");
  const categoryItems = document.querySelectorAll("#categoryFilter li");
  const productCount = document.getElementById("productCount");
  
  const currencySelect = document.getElementById("currencySelect");
  
  const favBtn = document.getElementById("favBtn");
  const favCount = document.getElementById("favCount");
  const favModal = document.getElementById("favModal");
  const closeFav = document.getElementById("closeFav");
  const favItemsContainer = document.getElementById("favItemsContainer");

  const cartBtn = document.getElementById("cartBtn");
  const cartCount = document.getElementById("cartCount");
  const cartModal = document.getElementById("cartModal");
  const closeCart = document.getElementById("closeCart");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalPrice = document.getElementById("cartTotalPrice");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Переключение валюты
  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      currentCurrency = e.target.value;
      if (priceValue) priceValue.textContent = formatPrice(maxPrice);
      renderProducts();
      updateCartUI();
      updateFavModalUI();
    });
  }

  // Отрисовка карточек товаров
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
          <p class="price" style="font-weight: bold; color: #38bdf8; font-size: 18px; margin-bottom: 12px;">${formatPrice(product.price)}</p>
          <button class="add-to-cart-btn" data-id="${product.id}" style="background: #38bdf8; color: #000; border: none; padding: 10px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold; transition: background 0.2s;">У кошик</button>
        </div>
      `;

      productsGrid.appendChild(card);
    });

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

  // Добавление в корзину
  window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
      cart.push(product);
      updateCartUI();
    }
  };

  // Переключение избранного
  function toggleFavorite(id) {
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
    } else {
      favorites.push(id);
    }
    if (favCount) favCount.textContent = favorites.length;
    renderProducts();
    updateFavModalUI();
  }

  // Отрисовка списка лайкнутых товаров
  function updateFavModalUI() {
    if (!favItemsContainer) return;

    favItemsContainer.innerHTML = "";
    if (favorites.length === 0) {
      favItemsContainer.innerHTML = `<p style="color: #aaa; text-align: center; padding: 20px;">Список обраного порожній</p>`;
      return;
    }

    favorites.forEach(id => {
      const product = products.find(p => p.id === id);
      if (!product) return;

      const itemDiv = document.createElement("div");
      itemDiv.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: #2a2a3f; padding: 10px; border-radius: 8px; margin-bottom: 8px;";
      itemDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${product.img}" alt="${product.name}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px;">
          <div>
            <div style="color: #fff; font-size: 13px; font-weight: bold;">${product.name}</div>
            <div style="color: #38bdf8; font-size: 13px; font-weight: bold;">${formatPrice(product.price)}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button onclick="window.addToCart(${product.id})" style="background: #38bdf8; color: #000; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: bold;">У кошик</button>
          <button onclick="window.removeFav(${product.id})" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 15px;"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      favItemsContainer.appendChild(itemDiv);
    });
  }

  window.removeFav = function(id) {
    favorites = favorites.filter(favId => favId !== id);
    if (favCount) favCount.textContent = favorites.length;
    renderProducts();
    updateFavModalUI();
  };

  // Обновление корзины
  function updateCartUI() {
    if (cartCount) cartCount.textContent = cart.length;
    
    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = "";
      let total = 0;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="color: #aaa; text-align: center; padding: 20px;">Ваш кошик порожній</p>`;
      } else {
        cart.forEach((item, index) => {
          total += item.price;
          const div = document.createElement("div");
          div.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 8px;";
          div.innerHTML = `
            <span style="color: #fff; font-size: 14px; max-width: 65%;">${item.name}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="color: #38bdf8; font-weight: bold;">${formatPrice(item.price)}</span>
              <button onclick="window.removeFromCart(${index})" style="background: transparent; border: none; color: #ef4444; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
          cartItemsContainer.appendChild(div);
        });
      }

      if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(total);
    }
  }

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    updateCartUI();
  };

  // Оформление заказа
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Ваш кошик порожній!");
        return;
      }
      alert(`Дякуємо за замовлення на суму ${cartTotalPrice.textContent}! Менеджер зв'яжеться з вами найближчим часом.`);
      cart = [];
      updateCartUI();
      if (cartModal) cartModal.style.display = "none";
    });
  }

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
      if (priceValue) priceValue.textContent = formatPrice(maxPrice);
      renderProducts();
    });
  }

  // Открытие/закрытие корзины
  if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", () => {
      updateCartUI();
      cartModal.style.display = "flex";
    });
  }

  if (closeCart && cartModal) {
    closeCart.addEventListener("click", () => {
      cartModal.style.display = "none";
    });
  }

  // Открытие/закрытие избранного
  if (favBtn && favModal) {
    favBtn.addEventListener("click", () => {
      updateFavModalUI();
      favModal.style.display = "flex";
    });
  }

  if (closeFav && favModal) {
    closeFav.addEventListener("click", () => {
      favModal.style.display = "none";
    });
  }

  // Закрытие модалок по клику на темный фон вокруг окна
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.style.display = "none";
    if (e.target === favModal) favModal.style.display = "none";
  });

  // Первый запуск
  renderProducts();
  updateCartUI();
});
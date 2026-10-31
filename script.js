 document.addEventListener("DOMContentLoaded", () => {
    // Масив товарів інтернет-магазину
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
  
    // Глобальні змінні стану
    let cart = [];
    let favorites = [];
    let currentCategory = "all";
    let maxPrice = 80000;
    let searchQuery = "";
  
    // Елементи DOM
    const productsGrid = document.getElementById("productsGrid");
    const searchInput = document.getElementById("searchInput");
    const priceRange = document.getElementById("priceRange");
    const maxPriceLabel = document.getElementById("maxPriceLabel");
    const categoryButtons = document.querySelectorAll(".category-btn");
    const cartCount = document.getElementById("cartCount");
    const favoritesCount = document.getElementById("favoritesCount");
  
    // Функція рендерингу (відображення) товарів
    function renderProducts() {
      if (!productsGrid) return;
  
      // Фільтрація товарів
      const filtered = products.filter(product => {
        const matchCategory = (currentCategory === "all") || (product.category === currentCategory);
        const matchPrice = (product.price || 0) <= maxPrice;
        const matchSearch = product.name.toLowerCase().includes((searchQuery || "").toLowerCase());
  
        return matchCategory && matchPrice && matchSearch;
      });
  
      // Очищення сітки
      productsGrid.innerHTML = "";
  
      // Якщо нічого не знайдено
      if (filtered.length === 0) {
        productsGrid.innerHTML = <p class="no-products" style="color: #fff; grid-column: 1 / -1; text-align: center; padding: 20px;">Показано 0 товарів</p>;
        return;
      }
  
      // Виведення відфільтрованих товарів
      filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = 
          <img src="${product.img}" alt="${product.name}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
          <h3 style="font-size: 16px; margin-bottom: 8px; color: #fff;">${product.name}</h3>
          <p class="price" style="font-weight: bold; color: #38bdf8; font-size: 18px; margin-bottom: 12px;">${product.price} грн</p>
          <button onclick="addToCart(${product.id})" style="background: #38bdf8; color: #000; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold;">У кошик</button>
        ;
        productsGrid.appendChild(card);
      });
    }
  
    // Додавання в кошик
    window.addToCart = function(id) {
      const item = products.find(p => p.id === id);
      if (item) {
        cart.push(item);
        if (cartCount) cartCount.textContent = cart.length;
        alert(Товар "${item.name}" додано до кошика!);
      }
    };
// Обробники подій для категорій
    if (categoryButtons) {
      categoryButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          categoryButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentCategory = btn.getAttribute("data-cat") || "all";
          renderProducts();
        });
      });
    }
  
    // Обробник пошуку
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderProducts();
      });
    }
  
    // Обробник цінового повзунка
    if (priceRange) {
      priceRange.addEventListener("input", (e) => {
        maxPrice = Number(e.target.value);
        if (maxPriceLabel) maxPriceLabel.textContent = ${maxPrice} грн;
        renderProducts();
      });
    }
  
    // Первинний запуск рендерингу при завантаженні сторінки
    renderProducts();
  });
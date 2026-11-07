document.addEventListener("DOMContentLoaded", () => {
  // Масив товарів
  const products = [
      { id: 1, name: "Ігровий ноутбук ASUS", price: 32000, category: "laptops", image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400" },
      { id: 2, name: "Смартфон UltraPhone", price: 18500, category: "phones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
      { id: 3, name: "Бездротові навушники", price: 2400, category: "accessories", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
      { id: 4, name: "Механічна клавіатура", price: 3100, category: "accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400" }
  ];

  let cart = [];
  let favorites = [];

  const productsGrid = document.getElementById("products-grid");
  const productCount = document.getElementById("product-count");
  const searchInput = document.getElementById("search-input");
  const categoryBtns = document.querySelectorAll(".category-btn");

  function renderProducts(items) {
      if (!productsGrid) return;

      productsGrid.innerHTML = "";

      if (productCount) {
          productCount.textContent = `Показано ${items.length} товарів`;
      }

      if (items.length === 0) {
          productsGrid.innerHTML = `<p class="no-products" style="color: #fff; grid-column: 1/-1; text-align: center; padding: 40px;">Товарів не знайдено</p>`;
          return;
      }

      items.forEach(product => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.style.cssText = "background: #1e1e2f; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between; color: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
          
          const isFav = favorites.includes(product.id);

          card.innerHTML = `
              <div>
                  <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;">
                  <h3 style="font-size: 16px; margin: 0 0 8px 0;">${product.name}</h3>
                  <p style="font-weight: bold; color: #818cf8; margin: 0 0 15px 0;">${product.price} грн</p>
              </div>
              <div style="display: flex; gap: 10px;">
                  <button class="buy-btn" data-id="${product.id}" style="flex: 1; background: #4f46e5; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold;">У кошик</button>
                  <button class="fav-btn" data-id="${product.id}" style="background: ${isFav ? '#ef4444' : '#334155'}; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">❤️</button>
              </div>
          `;

          productsGrid.appendChild(card);
      });

      // Навішування подій на кнопки купівлі
      document.querySelectorAll(".buy-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
              const id = parseInt(e.target.getAttribute("data-id"));
              const product = products.find(p => p.id === id);
              if (product) {
                  cart.push(product);
                  alert(`Товар "${product.name}" додано до кошика!`);
              }
          });
      });

      // Навішування подій на обране
      document.querySelectorAll(".fav-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
              const id = parseInt(e.target.getAttribute("data-id"));
              const index = favorites.indexOf(id);
              if (index > -1) {
                  favorites.splice(index, 1);
              } else {
                  favorites.push(id);
              }
              renderProducts(items);
          });
      });
  }

  // Пошук
  if (searchInput) {
      searchInput.addEventListener("input", (e) => {
          const query = e.target.value.toLowerCase();
          const filtered = products.filter(p => p.name.toLowerCase().includes(query));
          renderProducts(filtered);
      });
  }

  // Фільтрація за категоріями
  categoryBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
          categoryBtns.forEach(b => b.classList.remove("active"));
          e.target.classList.add("active");
          const category = e.target.getAttribute("data-category");

          if (category === "all") {
              renderProducts(products);
          } else {
              const filtered = products.filter(p => p.category === category);
              renderProducts(filtered);
          }
      });
  });

  // Початковий рендер
  renderProducts(products);
});
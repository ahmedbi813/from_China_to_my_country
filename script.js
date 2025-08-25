async function loadProducts() {
    const res = await fetch('data.json')
    const data = await res.json();
    const products = data.record; // استخدام المفتاح record

    const list = document.getElementById('product-list');
    const searchInput = document.getElementById('search');

    function displayProducts(filtered) {
      if (!list) return;
      list.innerHTML = '';
      filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.innerHTML = `<img src="${product.image}" alt="${product.name}"><p>${product.name}</p>`;
        card.onclick = () => {
          if (product.link) window.location.href = product.link;
        };
        list.appendChild(card);
      });
    }

    displayProducts(products);

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        displayProducts(products.filter(p => p.keyword && p.keyword.toLowerCase().includes(term)));
      });
    }

  } catch (err) {
    console.error("حدث خطأ أثناء تحميل المنتجات:", err);
  }
}

if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/index.html') {
  loadProducts();
}

if (window.location.pathname.includes('product.html')) {
  (async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');

      const res = await fetch('https://api.jsonbin.io/v3/b/68ab9fc7ae596e708fd41b27', {
        headers: {
          "X-Master-Key": "$2a$10$xUeBM8cH3xsSekZmD0vrt.lyMGueumhQwvl04H3PuFAeLDB4BRFpC"
        }
      });
      if (!res.ok) throw new Error(`فشل التحميل: ${res.status}`);

      const data = await res.json();
      const products = data.record;
      const product = products.find(p => p.id.toString() === id);

      const container = document.getElementById('product-detail');
      if (product && container) {
        container.innerHTML = `
          <h2>${product.name}</h2>
          <img src="${product.image}" alt="${product.name}" class="Image_Size">
          <p id="Description">${product.description}</p>
          <a href="${product.link}" target="_blank" class="btn">تفاصيل المنتج</a>
        `;
      } else if (container) {
        container.innerHTML = `<p>المنتج غير موجود</p>`;
      }
    } catch (err) {
      console.error("حدث خطأ أثناء تحميل تفاصيل المنتج:", err);
    }
  })();
}


// تحميل المنتجات في index.html
async function loadProducts() {
  const list = document.getElementById('product-list');
  const searchInput = document.getElementById('search');
  if (!list) return;

  try {
    const res = await fetch("data.json"); // قراءة البيانات من ملف محلي
    if (!res.ok) throw new Error(`فشل التحميل: ${res.status}`);

    const products = await res.json();

    // عرض آخر 12 منتج فقط (الأحدث أولاً)
    const latestProducts = products.slice(-12).reverse();

    function displayProducts(filtered) {
      list.innerHTML = '';
      filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.innerHTML = `
          <img src="${product.image}" width="50%" height="50%" loading="lazy" alt="${product.name}">
          <h3>${product.name}</h3>
          <p style="margin:20px;direction:rtl;">${product.description}</p>
        `;
        card.onclick = () => {
          window.location.href = `${product.link}`;
        };
        list.appendChild(card);
      });
    }

    displayProducts(latestProducts);

    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        // البحث يشمل كل المنتجات وليس مقتصرًا على آخر 12
        const filteredProducts = products.filter(p =>
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.keyword && p.keyword.toLowerCase().includes(term))
        );
        displayProducts(filteredProducts);
      });
    }
  } catch (err) {
    console.error("حدث خطأ أثناء تحميل المنتجات:", err);
    list.innerHTML = "<p>❌ فشل تحميل المنتجات</p>";
  }
}

// تحميل تفاصيل المنتج في product.html
async function loadProductDetail() {
  const container = document.getElementById('product-detail');
  if (!container) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const res = await fetch("data.json"); // قراءة نفس الملف
    if (!res.ok) throw new Error(`فشل التحميل: ${res.status}`);

    const products = await res.json();
    const product = products.find(p => p.id.toString() === id);

    if (product) {
      container.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}" class="Image_Size">
        <p id="Description">${product.description || "لا يوجد وصف"}</p>
        ${product.link ? `<a href="${product.link}" target="_blank" class="btn">تفاصيل المنتج</a>` : ""}
        <a href="index.html" class="btn">🔙 رجوع</a>
      `;
    } else {
      container.innerHTML = `<p>⚠️ المنتج غير موجود</p>`;
    }
  } catch (err) {
    console.error("حدث خطأ أثناء تحميل تفاصيل المنتج:", err);
    container.innerHTML = "<p>❌ فشل تحميل المنتج</p>";
  }
}

// استدعاء الدوال
loadProducts();
loadProductDetail();


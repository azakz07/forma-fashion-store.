
/* =================================
   FORMA FASHION STORE
   PRODUCTS
================================= */

const products = [
    {
        id: 1,
        name: "Пиджак прямого кроя",
        category: "Женская",
        price: 32900,
        tag: "БЕСТСЕЛЛЕР",
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 2,
        name: "Базовая футболка",
        category: "Мужская",
        price: 12900,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 3,
        name: "Платье Soft Line",
        category: "Женская",
        price: 27900,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 4,
        name: "Рубашка свободная",
        category: "Мужская",
        price: 21900,
        tag: "",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 5,
        name: "Тренч Everyday",
        category: "Женская",
        price: 45900,
        tag: "LIMITED",
        image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 6,
        name: "Свитшот Essential",
        category: "Мужская",
        price: 24900,
        tag: "",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 7,
        name: "Сумка Mini Form",
        category: "Аксессуары",
        price: 19900,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 8,
        name: "Джинсы Straight",
        category: "Женская",
        price: 26900,
        tag: "",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 9,
        name: "Куртка Urban",
        category: "Мужская",
        price: 38900,
        tag: "",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 10,
        name: "Очки Studio",
        category: "Аксессуары",
        price: 14900,
        tag: "",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 11,
        name: "Топ Minimal",
        category: "Женская",
        price: 9900,
        tag: "",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85"
    },
    {
        id: 12,
        name: "Кросс-боди сумка",
        category: "Аксессуары",
        price: 22900,
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85"
    }
];


/* =================================
   STORAGE
================================= */

function readStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn("Ошибка сохранения:", error);
        toast("Не удалось сохранить данные.");
        return false;
    }
}

const savedCart = readStorage("forma-fashion-cart", {});
let cart = {};

if (savedCart && typeof savedCart === "object" && !Array.isArray(savedCart)) {
    for (const [id, qty] of Object.entries(savedCart)) {
        const exists = products.some(p => p.id === Number(id));

        if (exists && Number.isInteger(Number(qty)) && Number(qty) > 0) {
            cart[id] = Math.min(Number(qty), 99);
        }
    }
}

const savedFavorites = readStorage("forma-fashion-favorites", []);

let favorites = Array.isArray(savedFavorites)
    ? [...new Set(savedFavorites.map(Number).filter(
        id => products.some(p => p.id === id)
    ))]
    : [];

let activeFilter = "all";
let favoritesOnly = false;


/* =================================
   ELEMENTS
================================= */

const grid = document.getElementById("productGrid");
const cartOverlay = document.getElementById("cartOverlay");
const toastEl = document.getElementById("toast");

const money = number =>
    new Intl.NumberFormat("ru-RU").format(number) + " ₸";


/* =================================
   NOTIFICATIONS
================================= */

function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");

    clearTimeout(toastEl._timer);

    toastEl._timer = setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2200);
}


/* =================================
   RENDER PRODUCTS
================================= */

function renderProducts() {
    const query = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    let list = products.filter(product => {
        const matchesCategory =
            activeFilter === "all" ||
            product.category === activeFilter;

        const matchesSearch =
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);

        const matchesFavorites =
            !favoritesOnly ||
            favorites.includes(product.id);

        return matchesCategory && matchesSearch && matchesFavorites;
    });

    const sort = document.getElementById("sortSelect").value;

    if (sort === "low") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        list.sort((a, b) => b.price - a.price);
    }

    grid.innerHTML = list.map(product => `
        <article class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                ${
                    product.tag
                    ? `<span class="product-tag">${product.tag}</span>`
                    : ""
                }

                <button
                    class="heart ${favorites.includes(product.id) ? "active" : ""}"
                    data-fav="${product.id}"
                    aria-label="Добавить в избранное"
                >
                    ${favorites.includes(product.id) ? "♥" : "♡"}
                </button>

                <button
                    class="quick-add"
                    data-add="${product.id}"
                >
                    ДОБАВИТЬ В СУМКУ +
                </button>

            </div>

            <div class="product-info">

                <div>
                    <p class="product-name">${product.name}</p>
                    <p class="product-category">${product.category}</p>
                </div>

                <p class="product-price">${money(product.price)}</p>

            </div>

        </article>
    `).join("");

    document.getElementById("resultCount").textContent =
        `${list.length} ПОЗИЦИЙ`;

    document.getElementById("noResults").hidden =
        list.length !== 0;
}


/* =================================
   FILTERS
================================= */

document.getElementById("filters").addEventListener("click", event => {
    const button = event.target.closest("[data-filter]");

    if (!button) return;

    activeFilter = button.dataset.filter;
    favoritesOnly = false;

    document.querySelectorAll(".filter").forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts();
});


/* =================================
   CATEGORY LINKS
================================= */

document.querySelectorAll("[data-category]").forEach(link => {
    link.addEventListener("click", () => {
        activeFilter = link.dataset.category;
        favoritesOnly = false;

        document.querySelectorAll(".filter").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.filter === activeFilter
            );
        });

        renderProducts();
    });
});


/* =================================
   SEARCH
================================= */

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchToggle").addEventListener("click", () => {
    searchPanel.classList.toggle("open");

    if (searchPanel.classList.contains("open")) {
        searchInput.focus();
    }
});

document.getElementById("closeSearch").addEventListener("click", () => {
    searchPanel.classList.remove("open");
    searchInput.value = "";
    renderProducts();
});

searchInput.addEventListener("input", renderProducts);


/* =================================
   SORTING
================================= */

document.getElementById("sortSelect").addEventListener("change", renderProducts);


/* =================================
   FAVORITES
================================= */

function saveFavorites() {
    writeStorage("forma-fashion-favorites", favorites);
}

grid.addEventListener("click", event => {
    const button = event.target.closest("[data-fav]");

    if (!button) return;

    const id = Number(button.dataset.fav);

    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
        toast("Удалено из избранного");
    } else {
        favorites.push(id);
        toast("Добавлено в избранное");
    }

    saveFavorites();
    renderProducts();
});

document.getElementById("showFavorites").addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    activeFilter = "all";

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === "all"
        );
    });

    toast(favoritesOnly ? "Твои избранные товары" : "Весь каталог");

    renderProducts();

    document.getElementById("catalog").scrollIntoView({
        behavior: "smooth"
    });
});


/* =================================
   CART
================================= */

function saveCart() {
    writeStorage("forma-fashion-cart", cart);
}

function addToCart(id) {
    const product = products.find(item => item.id === id);

    if (!product) return;

    cart[id] = Math.min((cart[id] || 0) + 1, 99);

    saveCart();
    renderCart();

    toast("Товар добавлен в сумку");
}

grid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    addToCart(Number(button.dataset.add));
});


function renderCart() {
    const items = Object.entries(cart)
        .map(([id, qty]) => ({
            product: products.find(p => p.id === Number(id)),
            qty
        }))
        .filter(item => item.product);

    const count = items.reduce((sum, item) => sum + item.qty, 0);

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.qty,
        0
    );

    document.getElementById("cartCount").textContent = count;

    document.getElementById("drawerCount").textContent =
        `(${count})`;

    document.getElementById("cartTotal").textContent =
        money(total);

    document.getElementById("cartItems").innerHTML = items.length
        ? items.map(({ product, qty }) => `
            <div class="cart-row">

                <img src="${product.image}" alt="${product.name}">

                <div>
                    <b>${product.name}</b>
                    <small>${money(product.price)}</small>

                    <div class="qty">
                        <button data-qty="${product.id}" data-change="-1">−</button>
                        <span>${qty}</span>
                        <button data-qty="${product.id}" data-change="1">+</button>
                    </div>
                </div>

                <button
                    class="remove"
                    data-remove="${product.id}"
                    aria-label="Удалить товар"
                >×</button>

            </div>
        `).join("")
        : `<p class="cart-empty">Твоя сумка пока пуста.<br>Самое время это исправить ✳</p>`;

    const shippingNote = document.getElementById("shippingNote");

    if (total === 0) {
        shippingNote.textContent = "Бесплатная доставка от 30 000 ₸";
    } else if (total >= 30000) {
        shippingNote.textContent = "У тебя бесплатная доставка!";
    } else {
        shippingNote.textContent =
            `Добавь ещё ${money(30000 - total)} для бесплатной доставки`;
    }

    document.getElementById("checkout").disabled = count === 0;
}


/* =================================
   CHANGE QUANTITY
================================= */

document.getElementById("cartItems").addEventListener("click", event => {
    const qtyButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");

    if (qtyButton) {
        const id = qtyButton.dataset.qty;
        const change = Number(qtyButton.dataset.change);

        cart[id] = (cart[id] || 0) + change;

        if (cart[id] <= 0) {
            delete cart[id];
        }

        saveCart();
        renderCart();
    }

    if (removeButton) {
        delete cart[removeButton.dataset.remove];

        saveCart();
        renderCart();

        toast("Товар удалён");
    }
});


/* =================================
   OPEN AND CLOSE CART
================================= */

function openCart() {
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

document.getElementById("openCart").addEventListener("click", openCart);

document.getElementById("closeCart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        closeCart();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        searchPanel.classList.remove("open");
    }
});


/* =================================
   MOBILE MENU
================================= */

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
});

mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        if (link.dataset.nav) {
            activeFilter = link.dataset.nav;
            favoritesOnly = false;

            document.querySelectorAll(".filter").forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.filter === activeFilter
                );
            });

            renderProducts();
        }
    });
});


/* =================================
   NEWSLETTER
================================= */

document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = event.target.querySelector("input").value.trim();

    if (!email) return;

    document.getElementById("newsletterMessage").textContent =
        "Спасибо! Это демонстрационная форма подписки.";

    event.target.reset();
});


/* =================================
   CHECKOUT
================================= */

document.getElementById("checkout").addEventListener("click", () => {
    toast("Демонстрационный магазин: оплата пока не подключена.");
});


/* =================================
   INITIALIZATION
================================= */

renderProducts();
renderCart();

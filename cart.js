document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de carrito v3 cargado");

    // Selectores comunes
    const cartButtons = document.querySelectorAll('.btn-add-cart');
    const cartCountSpan = document.getElementById('cart-count');

    // Selectores específicos de carrito.html
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const emptyMessage = document.querySelector('.cart-empty');

    // Inicializar contador al cargar
    updateCartCounter();

    // --- ESCUCHA PARA AÑADIR ---
    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const btn = e.currentTarget;

            const product = {
                id: Date.now(), // ID único para evitar problemas al borrar
                title: btn.getAttribute('data-title') || "Producto",
                price: btn.getAttribute('data-price') || "0.00",
                img: btn.getAttribute('data-img') || "img/logo.png",
                desc: btn.getAttribute('data-desc') || "Sin descripción."
            };

            let cart = getCart();
            cart.push(product);
            saveCart(cart);

            updateCartCounter();
            alert(`¡Ha añadido "${product.title}" al carrito!`);
        });
    });

    // --- FUNCIONES MÚCLEO ---
    function getCart() {
        try {
            const data = localStorage.getItem('cart');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error al leer localStorage", e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCounter() {
        if (cartCountSpan) {
            const cart = getCart();
            cartCountSpan.textContent = cart.length;
            // Animación pequeña si ha cambiado
            cartCountSpan.style.transform = "scale(1.2)";
            setTimeout(() => { cartCountSpan.style.transform = "scale(1)"; }, 200);
        }
    }

    // --- RENDERIZADO (Solo si estamos en la página del carrito) ---
    if (cartItemsContainer) {
        renderCart();
    }

    function renderCart() {
        const cart = getCart();
        console.log("Renderizando carrito con items:", cart.length);

        if (cart.length === 0) {
            if (emptyMessage) {
                emptyMessage.style.display = 'flex';
                const p = emptyMessage.querySelector('p');
                if (p) p.textContent = "TU CARRITO ESTÁ VACÍO";
            }
            if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (cartItemsContainer) {
                cartItemsContainer.style.display = 'grid';
                cartItemsContainer.innerHTML = '';

                cart.forEach((item, index) => {
                    const article = document.createElement('article');
                    article.className = 'cart-item';
                    article.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.img}" alt="${item.title}">
                        </div>
                        <div class="cart-item-info">
                            <h3>${item.title}</h3>
                            <p class="cart-item-price">${item.price} €</p>
                            <div class="cart-buttons-row">
                                <button class="btn-show-desc btn-cart-action" data-id="${item.id}">Ver descripción</button>
                                <button class="btn-remove btn-cart-action" data-id="${item.id}" style="background-color: #ffcccc; color: #cc0000; border-color: #cc0000;">Eliminar</button>
                            </div>
                            <div class="cart-item-desc" id="desc-${item.id}" style="display: none; margin-top: 15px; background: #f9f9f9; padding: 10px; border-left: 3px solid #8B1A1A;">
                                <p>${item.desc}</p>
                            </div>
                        </div>
                    `;
                    cartItemsContainer.appendChild(article);
                });

                // Asignar eventos de nuevo
                document.querySelectorAll('.btn-show-desc').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.currentTarget.getAttribute('data-id');
                        const d = document.getElementById(`desc-${id}`);
                        if (d.style.display === 'none') {
                            d.style.display = 'block';
                            e.currentTarget.textContent = 'Ocultar descripción';
                        } else {
                            d.style.display = 'none';
                            e.currentTarget.textContent = 'Ver descripción';
                        }
                    });
                });

                document.querySelectorAll('.btn-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.currentTarget.getAttribute('data-id');
                        removeItemFromCart(id);
                    });
                });
            }
        }
    }

    function removeItemFromCart(id) {
        let cart = getCart();
        // Filtrar por ID
        cart = cart.filter(item => item.id.toString() !== id.toString());
        saveCart(cart);
        updateCartCounter();
        renderCart();
    }
});

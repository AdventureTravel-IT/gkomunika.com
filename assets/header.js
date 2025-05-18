let cartFetched = false;

async function updateCartCount() {
  try {
    const res = await fetch('/cart.js');
    if (!res.ok) throw new Error('Failed to load cart data');

    const { item_count } = await res.json();
    const countEl = document.getElementById('cart-count');

    if (item_count > 0) {
      countEl.textContent = item_count;
      countEl.style.display = 'flex';
    } else {
      countEl.style.display = 'none';
    }

    cartFetched = true; // tandai bahwa cart sudah di-fetch
  } catch (err) {
    console.error('Error updating cart count:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Fetch hanya sekali saat refresh
  updateCartCount();
});

document.addEventListener('submit', async (e) => {
  if (e.target.matches('form[action^="/cart/add"]')) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to add product to cart');

      // Jika tombol add-to-cart-mobile yang digunakan, trigger update
      if (e.target.closest('.add-to-cart-mobile')) {
        await updateCartCount();
      }
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  }
});

// Jika ada tombol manual untuk trigger ulang, misalnya
document.querySelectorAll('.add-to-cart-mobile').forEach(button => {
  button.addEventListener('click', async () => {
    await updateCartCount();
  });
});


  function toggleMenu() {
    const sidebar = document.getElementById('sidebar-menu');
    const icon = document.getElementById('menu-icon');
    sidebar.classList.toggle('active');
    icon.classList.toggle('open');
  }
let cartFetched = false;

async function updateCartCount() {
  try {
    const res = await fetch("/cart.js?_=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load cart data");

    const { item_count } = await res.json();
    const count = item_count || 0;
    if (typeof window.updateCartBadge === "function") {
      window.updateCartBadge(count);
    } else {
      const badges = document.querySelectorAll(".header-cart-badge, #cart-count");
      badges.forEach((el) => {
        el.textContent = count;
        el.style.display = count > 0 ? "inline-flex" : "none";
      });
    }

    cartFetched = true; // tandai bahwa cart sudah di-fetch
  } catch (err) {}
}

document.addEventListener("DOMContentLoaded", () => {
  // Fetch hanya sekali saat refresh
  updateCartCount();
});

document.addEventListener("submit", async (e) => {
  if (e.target.matches('form[action^="/cart/add"]')) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch("/cart/add.js", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product to cart");

      // Jika tombol add-to-cart-mobile yang digunakan, trigger update
      if (e.target.closest(".add-to-cart-mobile")) {
        await updateCartCount();
      }
    } catch (err) {}
  }
});

// Jika ada tombol manual untuk trigger ulang, misalnya
document.querySelectorAll(".add-to-cart-mobile").forEach((button) => {
  button.addEventListener("click", async () => {
    await updateCartCount();
  });
});

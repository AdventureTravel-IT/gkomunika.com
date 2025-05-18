
  document.addEventListener("DOMContentLoaded", function () {
    const subImagesWrapper = document.querySelector(".main-product-sub-images");
    const scrollLeftBtn = document.querySelector(".scroll-btn.left");
    const scrollRightBtn = document.querySelector(".scroll-btn.right");
    const mainImage = document.getElementById("mainImage");
    const subImages = document.querySelectorAll(".sub-image");

    // Fungsi untuk memeriksa posisi scroll
    const checkScrollPosition = () => {
      const maxScrollLeft = subImagesWrapper.scrollWidth - subImagesWrapper.clientWidth;
      scrollLeftBtn.style.display = subImagesWrapper.scrollLeft === 0 ? "none" : "block";
      scrollRightBtn.style.display = subImagesWrapper.scrollLeft >= maxScrollLeft ? "none" : "block";
    };

    // Fungsi untuk scroll gambar
    window.scrollSubImages = (direction) => {
      const scrollAmount = 150; // Sesuaikan jarak scroll
      subImagesWrapper.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300); // Delay untuk memastikan posisi scroll sudah diperbarui
    };

    // Fungsi untuk mengganti gambar utama
    const updateMainImage = (src, clickedImage) => {
      mainImage.src = src;
      subImages.forEach(img => img.classList.remove("active"));
      clickedImage.classList.add("active");
    };

    // Atur gambar pertama sebagai default
    if (subImages.length > 0) {
      updateMainImage(subImages[0].dataset.src, subImages[0]);
    }

    // Event delegation untuk sub-images
    subImagesWrapper.addEventListener("click", (e) => {
      if (e.target.classList.contains("sub-image")) {
        updateMainImage(e.target.dataset.src, e.target);
      }
    });

    // Cek posisi scroll saat halaman dimuat
    checkScrollPosition();

    // Event listener saat scroll manual
    subImagesWrapper.addEventListener("scroll", checkScrollPosition);
  });

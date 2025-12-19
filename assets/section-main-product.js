document.addEventListener("DOMContentLoaded", function () {
  const subImagesWrapper = document.querySelector(".main-product-sub-images");
  const scrollLeftBtn = document.querySelector(".scroll-btn.left");
  const scrollRightBtn = document.querySelector(".scroll-btn.right");
  const mainImage = document.getElementById("mainImage");
  const subImages = document.querySelectorAll(".sub-image");

  if (!subImagesWrapper || !subImages.length) return;

  const checkScrollPosition = () => {
    const maxScrollLeft =
      subImagesWrapper.scrollWidth - subImagesWrapper.clientWidth;

    scrollLeftBtn.style.display =
      subImagesWrapper.scrollLeft <= 5 ? "none" : "block";

    scrollRightBtn.style.display =
      subImagesWrapper.scrollLeft >= maxScrollLeft - 5
        ? "none"
        : "block";
  };

  window.scrollSubImages = (direction) => {
    subImagesWrapper.scrollBy({
      left: direction * 150,
      behavior: "smooth",
    });
  };

  function updateMainImage(src, img) {
    mainImage.src = src;
    subImages.forEach((image) => image.classList.remove("active"));
    img.classList.add("active");
  }

  subImagesWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("sub-image")) {
      updateMainImage(e.target.dataset.src, e.target);
    }
  });

  subImagesWrapper.addEventListener("scroll", checkScrollPosition);
  checkScrollPosition();
});

document.addEventListener("DOMContentLoaded", function () {
  const subImagesWrapper = document.querySelector(".main-product-sub-images");
  const scrollLeftBtn = document.querySelector(".scroll-btn.left");
  const scrollRightBtn = document.querySelector(".scroll-btn.right");

  if (!subImagesWrapper) return;

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

  subImagesWrapper.addEventListener("scroll", checkScrollPosition);
  checkScrollPosition();
});

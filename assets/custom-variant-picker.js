document.addEventListener("DOMContentLoaded", function () {
  const durationDropdown = document.querySelector("[data-option-index='0']"); // Dropdown Durasi
  const dataPlanDropdown = document.querySelector("[data-option-index='1']"); // Dropdown Data Plan
  const variantData = {{ product.variants | json }};
  const optionSelectors = document.querySelectorAll(".variant-option");
  const priceElements = {
    desktop: document.getElementById("selected-price-desktop"),
    mobile: document.getElementById("selected-price-mobile"),
  };
  const variantIdInput = document.getElementById("selected-variant-id");
  const resetVariantBtn = document.getElementById("reset-variant");

  // Fungsi untuk memperbarui opsi Data Plan berdasarkan Durasi yang dipilih
  function updateDataPlanOptions() {
    const selectedDuration = durationDropdown.value;

    dataPlanDropdown.querySelectorAll("option:not(:first-child)").forEach(option => {
      const allowedDurations = option.getAttribute("data-duration").split(",").filter(Boolean);
      option.disabled = !allowedDurations.includes(selectedDuration);
      option.style.color = option.disabled ? "#aaa" : "";
    });

    if (dataPlanDropdown.selectedOptions[0].disabled) {
      dataPlanDropdown.value = "";
    }
  }

  // Fungsi untuk memperbarui harga dan varian yang dipilih
  function updatePrice() {
    const selectedVariant = getSelectedVariant();
    if (!selectedVariant) return;

    const formattedPrice = new Intl.NumberFormat("{{ shop.locale }}", {
      style: "currency",
      currency: "{{ shop.currency }}"
    }).format(selectedVariant.price / 100);

    priceElements.desktop.innerHTML = formattedPrice;
    priceElements.mobile.innerHTML = formattedPrice;
    variantIdInput.value = selectedVariant.id;

    document.getElementById("selected-option-1").textContent = selectedVariant.option1;
    document.getElementById("selected-option-2").textContent = selectedVariant.option2;

    if (typeof Currency !== "undefined" && Currency.currentCurrency) {
      Currency.convertAll("{{ shop.currency }}", Currency.currentCurrency, "span.money");
    }
  }

  // Fungsi untuk mendapatkan varian yang dipilih
  function getSelectedVariant() {
    const selectedOptions = Array.from(optionSelectors).map(select => select.value);
    return variantData.find(variant =>
      variant.options.every((option, index) => option === selectedOptions[index])
    );
  }

  // Fungsi untuk mereset varian ke keadaan awal
  function resetVariant() {
    optionSelectors.forEach(select => (select.value = ""));
    updatePrice();
  }

  // Event listeners
  durationDropdown?.addEventListener("change", updateDataPlanOptions);
  optionSelectors.forEach(selector => selector.addEventListener("change", updatePrice));
  resetVariantBtn?.addEventListener("click", resetVariant);

  document.getElementById("buy-now-button")?.addEventListener("click", function (e) {
    e.preventDefault();
    const selectedVariantId = variantIdInput.value;
    if (selectedVariantId) {
      window.location.href = `/checkout?variant=${selectedVariantId}&quantity=1`;
    } else {
      alert("Pilih varian terlebih dahulu!");
    }
  });

  // Inisialisasi
  updateDataPlanOptions();
  updatePrice();
});

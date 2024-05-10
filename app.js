document.addEventListener("DOMContentLoaded", function () {
  let images = [];
  let traits = [];

  document
    .getElementById("image-input")
    .addEventListener("change", function (event) {
      images = Array.from(event.target.files);
      updateImagePreviews(images);
    });

  function updateImagePreviews(images) {
    const previewContainer = document.getElementById("image-preview");
    previewContainer.innerHTML = ""; // Clear existing previews
    images.forEach((image) => {
      const imgElement = document.createElement("img");
      imgElement.src = URL.createObjectURL(image);
      imgElement.classList.add("w-24", "h-24", "object-cover");
      previewContainer.appendChild(imgElement);
    });
  }

  document.getElementById("add-trait").addEventListener("click", addTrait);

  function addTrait() {
    const traitNameInput = document.querySelector(
      "#traits-container input:nth-child(1)",
    );
    const traitValueInput = document.querySelector(
      "#traits-container input:nth-child(2)",
    );
    traits.push({ name: traitNameInput.value, value: traitValueInput.value });
    traitNameInput.value = ""; // Clear input after adding
    traitValueInput.value = ""; // Clear input after adding
  }

  document
    .getElementById("compress-images")
    .addEventListener("click", compressAndDownloadImages);

  function compressAndDownloadImages() {
    images.forEach((image, index) => {
      const compressor = new Compressor(image, {
        quality: 0.6, // Adjust the quality as needed
        success(result) {
          downloadImage(result, `${index}.png`);
          console.log("Compression successful:", result);
        },
        error(err) {
          console.error("Compression error:", err.message);
        },
      });
    });
  }

  function downloadImage(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  document
    .getElementById("generate-metadata")
    .addEventListener("click", function () {
      const description = document.getElementById("default-description").value;
      const link = document.getElementById("default-link").value;
      const metadata = images.map((image, index) => ({
        filename: `${index}.png`,
        description: description,
        link: link,
        properties: traits,
      }));
      downloadMetadata(metadata);
    });

  function downloadMetadata(metadata) {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metadata.json";
    a.click();
  }
});

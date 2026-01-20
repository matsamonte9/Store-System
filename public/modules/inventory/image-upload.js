export function imageAction(existingImage = null) {
  const imageContainer = document.querySelector('.js-image-input-container');
  const fileInput = document.querySelector('.js-image-input');
  const previewDiv = document.querySelector('.js-preview-button');

  let uploadedFile = null;

  // Show existing image if provided
  if (existingImage) {
    previewDiv.classList.remove('hidden');
    previewDiv.onclick = () => {
      const imgWindow = window.open('');
      imgWindow.document.write(`<img src="${existingImage}" style="max-width:100%; max-height:100vh;">`);
    };
  }

  // Click container to trigger file input
  imageContainer.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    uploadedFile = file;
    previewDiv.classList.remove('hidden');
    previewDiv.onclick = () => {
      const imgWindow = window.open('');
      imgWindow.document.write(`<img src="${URL.createObjectURL(uploadedFile)}" style="max-width:100%; max-height:100vh;">`);
    };
  });

  // Drag & drop functionality
  imageContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageContainer.classList.add('dragover');
  });

  imageContainer.addEventListener('dragleave', () => {
    imageContainer.classList.remove('dragover');
  });

  imageContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    imageContainer.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    fileInput.files = e.dataTransfer.files;
    uploadedFile = file;
    previewDiv.classList.remove('hidden');
    previewDiv.onclick = () => {
      const imgWindow = window.open('');
      imgWindow.document.write(`<img src="${URL.createObjectURL(uploadedFile)}" style="max-width:100%; max-height:100vh;">`);
    };
  });
}

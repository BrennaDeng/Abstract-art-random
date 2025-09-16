/* find modal */
let infoModal = document.getElementById("infoDialog");
/* find modal close button and add an eventlistener */
document.getElementById("infoDialogCloseButton").addEventListener("click", () => {
  infoModal.close();
});
/* find open button */
let openModalButton = document.getElementById("infoModalButton");
openModalButton.addEventListener("click", () => {
  infoModal.showModal();
});
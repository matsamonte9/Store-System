import { renderCheckPriceProduct } from "./check-price-ui.js";

import { errorModal } from "../shared/modals.js";

export async function checkPriceByBarcode(barcode) {
  try {
    const { data: { product } } = await axios.get(
      `/api/v1/products/check-price?barcode=${barcode}`,
      { withCredentials: true }
    );

    renderCheckPriceProduct(product);
  } catch (error) {
    const errmsg = error.response.data.msg;
    errorModal(errmsg);
  }
}

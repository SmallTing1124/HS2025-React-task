import PropTypes from 'prop-types';

import axios from 'axios';

import { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
  getProducts,
  modalMode,
  tempProduct,
  setTempProduct,
  isOpen,
  setIsOpen,
}) {
  //產品詳情頁：綁定DOM
  const productModalRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(productModalRef.current);
      modalInstance.show();
    }
  }, [isOpen]);

  // 關閉 Modal：產品詳情頁
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    productModalRef.current.addEventListener('hidden.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    setIsOpen(false);
  };

  // Modal產品詳情頁：取得 input 的資料
  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Modal產品詳情頁：檔案上傳
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file-to-upload', file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/${API_PATH}/admin/upload`,
        formData
      );
      const uploadedImageUrl = res.data.imageUrl;

      setTempProduct({
        ...tempProduct,
        imageUrl: uploadedImageUrl,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Modal產品詳情頁：取得 input 多圖的資料
  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct((pre) => ({
      ...pre,
      imagesUrl: newImages,
    }));
  };

  // Modal產品詳情頁：刪除(1張)多圖
  const handleDelImage = (currentIndex) => {
    const newImages = tempProduct.imagesUrl.filter(
      (item, i) => currentIndex !== i
    );

    setTempProduct((pre) => ({
      ...pre,
      imagesUrl: newImages,
    }));
  };

  // Modal產品詳情頁：新增(1張)多圖
  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];
    setTempProduct((pre) => ({
      ...pre,
      imagesUrl: newImages,
    }));
  };

  // 新增商品：取API
  const createProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
      getProducts();
      handleCloseProductModal();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(`新增商品失敗：${error.response.data.message}`);
      } else {
        console.log(error);
      }
    }
  };
  // 更新商品：取API
  const updateProduct = async () => {
    try {
      await axios.put(
        `${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
      getProducts();
      handleCloseProductModal();
    } catch (error) {
      alert(`修改商品失敗:${error.response.data.message}`);
    }
  };

  // 執行API [新增/更新]商品
  const handleUpdateProduct = async () => {
    if (modalMode === 'create') {
      await createProduct();
    } else {
      await updateProduct();
    }
  };

  return (
    <>
      <div
        ref={productModalRef}
        id="productModal"
        className="modal"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalMode === 'create' ? '新增產品' : '編輯產品'}
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseProductModal}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <div className="mb-5">
                      <label htmlFor="fileInput" className="form-label">
                        圖片上傳
                      </label>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="form-control"
                        id="fileInput"
                        name="file-to-upload"
                        onChange={(e) => handleFileChange(e)}
                      />
                    </div>
                    {/* <div className="input-group">
                      <input
                        value={tempProduct.imageUrl}
                        onChange={handleModalInputChange}
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        required
                      />
                    </div> */}

                    <div className="border rounded text-center bg-dark mt-2 overflow-hidden">
                      <img
                        src={tempProduct.imageUrl}
                        alt={tempProduct.title}
                        className="object-fit-contain "
                        height="150"
                      />
                    </div>
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label d-flex justify-content-between"
                        >
                          副圖 {index + 1}
                          {tempProduct.imagesUrl.length > 1 && (
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                              onClick={() => {
                                handleDelImage(index);
                              }}
                            ></button>
                          )}
                        </label>
                        <input
                          value={image}
                          onChange={(e) => handleImageChange(e, index)}
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                          required
                        />
                        {image && (
                          <div className="border rounded text-center bg-dark overflow-hidden mb-4">
                            <img
                              src={image}
                              alt={`副圖 ${index + 1}`}
                              className="object-fit-contain "
                              height="150"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 && (
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={handleAddImage}
                        >
                          新增圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      value={tempProduct.title}
                      onChange={handleModalInputChange}
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      value={tempProduct.category}
                      onChange={handleModalInputChange}
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      value={tempProduct.unit}
                      onChange={handleModalInputChange}
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        value={tempProduct.origin_price}
                        onChange={handleModalInputChange}
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        value={tempProduct.price}
                        onChange={handleModalInputChange}
                        name="price"
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      value={tempProduct.description}
                      onChange={handleModalInputChange}
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      value={tempProduct.content}
                      onChange={handleModalInputChange}
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      required
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      checked={tempProduct.is_enabled}
                      onChange={handleModalInputChange}
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseProductModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateProduct}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
ProductModal.propTypes = {
  getProducts: PropTypes.func.isRequired,
  modalMode: PropTypes.string,
  tempProduct: PropTypes.object.isRequired,
  setTempProduct: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};
export default ProductModal;

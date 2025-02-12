import PropTypes from 'prop-types';

import { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

function DelProductModal({ deleteProduct, getProducts, isOpen, setIsOpen ,tempProduct}) {
  const delProductModalRef = useRef(null);

  // 開啟 Modal：刪除確認頁
  useEffect(() => {
    if (isOpen) {
      const modalInstance = Modal.getInstance(delProductModalRef.current);
      modalInstance.show();
    }
  },[isOpen]);

  // 關閉 Modal：刪除確認頁
  const handleCloseDelProductModal = () => {

    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();

    delProductModalRef.current.addEventListener('hidden.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    setIsOpen(false);
  };

  useEffect(() => {
    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  // 執行API [刪除] 商品
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();
      getProducts();
      handleCloseDelProductModal();
    } catch (error) {
      console.log(error);
      alert('更新商品失敗');
    }
  };

  return (
    <>
      <div
        ref={delProductModalRef}
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                onClick={handleCloseDelProductModal}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              你是否要刪除? <br />
              <h4 className="text-danger fw-bold">{tempProduct.title}</h4>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseDelProductModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteProduct}
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
DelProductModal.propTypes = {
  deleteProduct: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  tempProduct: PropTypes.object
};
export default DelProductModal;

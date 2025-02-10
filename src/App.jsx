import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'bootstrap';
import './App.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultModalState = {
  imageUrl: '',
  title: '',
  category: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [''],
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });

  const [products, setProducts] = useState([]);
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const getProducts = async () => {
    try {
      // 取得產品資料
      const productsRes = await axios.get(
        `${BASE_URL}/api/${API_PATH}/admin/products`
      );
      setProducts(productsRes.data.products);
    } catch (error) {
      console.log(error);
      alert('取得產品失敗');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 登入請求
      const accountRes = await axios.post(`${BASE_URL}/admin/signin`, account);
      const { token, expired } = accountRes.data;

      // 儲存 token 到 cookie
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; `;
      axios.defaults.headers.common['Authorization'] = token;

      getProducts();
      // 設定登入狀態
      setIsAuth(true);
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        console.log(error);
      }
    }
  };

  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_URL}/api/user/check`);
      getProducts();
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkUserLogin();
  }, []);

  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [modalMode, setModalMode] = useState(null);

  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);

  useEffect(() => {
    new Modal(productModalRef.current, {
      backdrop: false,
    });
    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  // 開啟 Modal
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState);
        break;
      case 'edit':
        setTempProduct(product);
        break;

      default:
        break;
    }

    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.show();
  };
  const handleCloseProductModal = () => {
    const modalInstance = Modal.getInstance(productModalRef.current);
    modalInstance.hide();
    productModalRef.current.addEventListener('hidden.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
   
  };

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.show();
  };

  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();

    delProductModalRef.current.addEventListener('hidden.bs.modal', () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
  };

  const handleModalInputChange = (e) => {
    const { value, name, checked, type } = e.target;
    setTempProduct({
      ...tempProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = value;
    setTempProduct((pre) => ({
      ...pre,
      imagesUrl: newImages,
    }));
  };

  const handleDelImage = (currentIndex) => {
    const newImages = tempProduct.imagesUrl.filter(
      (item, i) => currentIndex !== i
    );

    setTempProduct((pre) => ({
      ...pre,
      imagesUrl: newImages,
    }));
  };

  const handleAddImage = () => {
    const newImages = [...tempProduct.imagesUrl, ''];
    setTempProduct((pre) => ({
      ...pre,
      imagesUrl: newImages,
    }));
  };

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

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/api/${API_PATH}/admin/product/${tempProduct.id}`
      );
    } catch (error) {
      alert(`修改商品失敗：${error.response.data.message}`);
    }
  };

  const handleUpdateProduct = async () => {
    if (modalMode === 'create') {
      await createProduct();
    } else {
      await updateProduct();
    }
  };

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
      {isAuth ? (
        <div className="container">
          <div className="row mt-5 justify-content">
            <div className="col-lg-10">
              <div className="d-flex justify-content-between align-items-end">
                <h2 className="mt-5">產品列表</h2>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleOpenProductModal('create');
                  }}
                >
                  建立新的產品
                </button>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody style={{ verticalAlign: 'middle' }}>
                  {products.map((product) => {
                    return (
                      <tr key={product.id}>
                        <td>
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            height="60"
                            width="120"
                            className="object-fit-cover border rounded"
                          />{' '}
                          {product.title}
                        </td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>
                          {product.is_enabled ? (
                            <span className="text-success">啟用</span>
                          ) : (
                            <span>未啟用</span>
                          )}
                        </td>

                        <td>
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                handleOpenProductModal('edit', product);
                              }}
                            >
                              編輯
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => {
                                handleOpenDelProductModal(product);
                              }}
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h1 className="mb-5">請先登入</h1>
          <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                value={account.username}
                name="username"
                onChange={handleInputChange}
                autoComplete="username"
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                name="password"
                value={account.password}
                onChange={handleInputChange}
                autoComplete="current-password"
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-primary">登入</button>
          </form>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}

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
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
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
                    </div>

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
                      value={tempProduct.name}
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

export default App;

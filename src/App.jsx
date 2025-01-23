// import { useState } from 'react'
import axios from 'axios';
import { useState } from 'react';
import './App.css';

const BASE_UR = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });
  const [tempProduct, setTempProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 登入請求
      const accountRes = await axios.post(`${BASE_UR}/admin/signin`, account);
      const { token, expired } = accountRes.data;
      
      // 儲存 token 到 cookie
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; `;
      axios.defaults.headers.common['Authorization'] = token;
      
      // 取得產品資料
      const productsRes =await axios.get(`${BASE_UR}/api/${API_PATH}/admin/products`);
      setProducts(productsRes.data.products);
      
      // 設定登入狀態
      setIsAuth(true);
    } catch (error) {
      if(error.response && error.response.data){
        alert(error.response.data.message);
      }else{
        console.log(error)
      }
    }
  };

  const checkUserLogin = async () => {
    try {
      await axios.post(`${BASE_UR}/api/user/check`);
      alert('使用者已登入！');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6">
              <button
                onClick={checkUserLogin}
                type="button"
                className="btn btn-success"
              >
                檢查使用者是否登入
              </button>
              <h2 className="mt-5">產品列表</h2>
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
                <tbody>
                  {products.map((product) => {
                    console.log(product);
                    return (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? '是' : '否'}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setTempProduct(product);
                            }}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTempProduct(null);
                    }}
                    className="btn-close"
                    aria-label="Close"
                  ></button>
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt={tempProduct.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct?.imagesUrl?.map((imgUrl, index) => {
                        return (
                          <img
                            key={index}
                            src={imgUrl}
                            className="col-2 object-fit-cover "
                            alt={tempProduct.title}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
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
    </>
  );
}

export default App;

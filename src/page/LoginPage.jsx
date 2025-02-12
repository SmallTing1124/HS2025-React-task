import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });

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
      const accountRes = await axios.post(`${BASE_URL}/admin/signin`, account);
      const { token, expired } = accountRes.data;

      // 儲存 token 到 cookie
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}; `;

      // token 設定為 Axios 的全域預設 Authorization 標頭
      // axios 發送的請求都會自動附帶這個 token
      axios.defaults.headers.common['Authorization'] = token;

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

  return (
    <>
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
    </>
  );
}

LoginPage.propTypes = {
  setIsAuth: PropTypes.func,
};
export default LoginPage;

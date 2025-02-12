import PropTypes from 'prop-types';

function ProductList({
  products,
  setTempProduct,
  setIsDelOpen,
  handleOpenProductModal,
}) {
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDelOpen(true);
  };
  return (
    <>
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
    </>
  );
}

ProductList.propTypes = {
  products: PropTypes.array,
  setTempProduct: PropTypes.func,
  setIsDelOpen: PropTypes.func,
  handleOpenProductModal: PropTypes.func,
};

export default ProductList;

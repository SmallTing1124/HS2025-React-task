import PropTypes from 'prop-types';

function Pagination({ getProducts, pageInfo }) {
  const handlePageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
            <a
              className="page-link"
              href="#"
              onClick={() => handlePageChange(pageInfo.current_page - 1)}
            >
              上一頁
            </a>
          </li>
          {[...Array(pageInfo.total_pages).keys()].map((num) => {
            return (
              <li
                key={num}
                className={`page-item  ${
                  pageInfo.current_page === num + 1 && 'active'
                } `}
              >
                <a
                  className="page-link"
                  onClick={() => handlePageChange(num + 1)}
                  href="#"
                >
                  {num + 1}
                </a>
              </li>
            );
          })}

          <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
            <a
              className="page-link"
              href="#"
              onClick={() => handlePageChange(pageInfo.current_page + 1)}
            >
              下一頁
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

Pagination.propTypes = {
  getProducts: PropTypes.func,
  pageInfo: PropTypes.object,
};
export default Pagination;

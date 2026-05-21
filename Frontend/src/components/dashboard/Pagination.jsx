import React from 'react';
import './Pagination.scss';

const Pagination = ({ current = 1, total = 5, from = 1, to = 12, count = 58 }) => (
  <div className="pagination">
    <span className="pagination__info">
      Showing {from}–{to} of {count}
    </span>
    <div className="pagination__controls">
      <button className="pagination__btn" disabled={current === 1} aria-label="Previous">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      {Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={`pagination__btn pagination__btn--page ${page === current ? 'pagination__btn--active' : ''}`}
          aria-current={page === current ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      {total > 5 && <span className="pagination__ellipsis">•••</span>}
      <button className="pagination__btn" disabled={current === total} aria-label="Next">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  </div>
);

export default Pagination;

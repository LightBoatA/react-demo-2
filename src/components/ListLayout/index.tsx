import React, { useMemo } from 'react';
// import './index.less';
interface IProps {
  title: string;
  searchBar?: any;
  list: any;
  className: string;
  btns?: any;
}
export const ListLayout: React.FC<IProps> = props => {
  const { className, searchBar, list, title, btns } = props;
  return useMemo(() => {
    return (
      <div className={`layout-list ${className}`}>
        {searchBar && <div className="search-bar card mb15" style={{ height: 120 }}>
          <div className="title">
            {title}
          </div>
          {searchBar}
        </div>}
        <div className="table card">
          <div className="btns mb15 flex flex-h-end">
            {btns}
          </div>
          {list}
        </div>
      </div>
    );
  }, [btns, className, list, searchBar, title]);

};

export default ListLayout;
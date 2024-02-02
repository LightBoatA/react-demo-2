// SearchBar.tsx

import React, { useState, useCallback } from 'react';
import { Select } from 'antd';
import './index.less'

interface SearchBarProps {
    cityList: { fullname: string, location: { lat: number, lng: number } }[];
    keyword: string;
    handleSelectCityName: (name: string) => void;
    searchHandle: (value: string) => void;
    suggestionList: any[];
    selectSuggestionHandle: (item: any) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    cityList,
    keyword,
    handleSelectCityName,
    searchHandle,
    suggestionList,
    selectSuggestionHandle,
}) => {
    return (
        <div className="qq-map-search-bar">
            <Select
                className='search-select'
                style={{ width: 120 }}
                onChange={handleSelectCityName}
                placeholder={'泰州市'}
                options={cityList.map(item => ({
                    label: item.fullname,
                    value: item.fullname,
                }))}
            />
            <div className="search-input">
                <input
                    type="text"
                    placeholder="搜索地址"
                    value={keyword}
                    onChange={(e) => searchHandle(e.target.value)}
                />
                {suggestionList.length > 0 ? (
                    <ul className="suggestion-wrap">
                        {suggestionList.map((item, index) => (
                            <li
                                key={index}
                                className="suggestion-item"
                                onClick={() => {
                                    selectSuggestionHandle(item);
                                }}
                            >
                                {item.title}
                            </li>
                        ))}
                    </ul>
                ) : (
                    ""
                )}
            </div>
            
        </div>
    );
};

export default SearchBar;

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Select, Space } from 'antd';
import './index.less';

interface SearchBarProps {
    cityList: { fullname: string; location: { lat: number; lng: number } }[];
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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDocumentClick = useCallback(
        (e: MouseEvent) => {
            if (
                !suggestionRef.current?.contains(e.target as Node) &&
                !inputRef.current?.contains(e.target as Node)
            ) {
                setShowSuggestions(false);
            }
        },
        []
    );

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [handleDocumentClick]);

    const handleInputFocus = useCallback(() => {
        setShowSuggestions(true);
    }, []);

    return (
        <div className="qq-map-search-bar mb10">
            <div className="search1">
                <Space>
                    {/* <span>建筑位置：</span> */}
                    <Select
                        className="search-select"
                        style={{ width: 120 }}
                        onChange={handleSelectCityName}
                        placeholder={'泰州市'}
                        options={cityList.map((item) => ({
                            label: item.fullname,
                            value: item.fullname,
                        }))}
                    />
                </Space>
                
            </div>

            {/* <span>详细地址：</span> */}
            <div className="search-input" ref={inputRef}>
                <input
                    type="text"
                    placeholder="请输入详细地址"
                    value={keyword}
                    onChange={(e) => searchHandle(e.target.value)}
                    onFocus={handleInputFocus}
                />
                {showSuggestions && suggestionList.length > 0 && (
                    <ul className="suggestion-wrap" ref={suggestionRef}>
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
                )}
            </div>
        </div>
    );
};

export default SearchBar;

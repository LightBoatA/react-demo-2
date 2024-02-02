import React, { ReactNode, useState } from 'react';
import { Select, Input, Dropdown, Menu, Col, Row } from 'antd';
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
    // const [visible, setVisible] = useState(false);

    // const handleVisibleChange = (flag: boolean) => {
    //     setVisible(flag);
    // };

    const menu = (menus: ReactNode) => {
        const comp = (suggestionList && suggestionList.length)
            ? <Menu>
                {suggestionList.map((item, index) => (
                    <Menu.Item
                        key={index}
                        onClick={() => {
                            selectSuggestionHandle(item);
                        }}
                    >
                        {item.title}
                    </Menu.Item>
                ))}
            </Menu>
            : <></>
        return comp;
    }

return (
    <Row className="flex flex-v-center qq-map-search-bar">
        <Col >建筑位置：</Col>
        <Col span={8}>
            <Select
                style={{ width: 180 }}
                onChange={handleSelectCityName}
                placeholder={'泰州市'}
                options={cityList.map((item) => ({
                    label: item.fullname,
                    value: item.fullname,
                }))}
            />
        </Col>
        <Col>详细地址：</Col>
        <Col span={10}>
            <Dropdown
                // open={suggestionList && suggestionList.length && !!keyword.trim()}
                // onOpenChange={handleVisibleChange}
                dropdownRender={menu}
                trigger={['click']}
            >
                <Input
                    type="text"
                    placeholder="搜索地址"
                    value={keyword}
                    onChange={(e) => searchHandle(e.target.value)}
                />
            </Dropdown>
        </Col>



    </Row>

    // </div>
);
};

export default SearchBar;

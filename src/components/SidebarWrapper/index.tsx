// SidebarWrapper.tsx

import React, { useState, useMemo } from 'react';
import './index.less';

interface SidebarWrapperProps {
    children: React.ReactNode;
    direction: 'left' | 'right';
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children, direction }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const sidebarClass = `sidebar ${isSidebarOpen ? 'open' : 'closed'}`;
    const contentWrapperClass = `content-wrapper direction-${direction}`;

    return useMemo(() => {
        return (
            <div className="sidebar-wrapper">
                <div className={sidebarClass}>
                    <div className={contentWrapperClass}>
                        {children}
                    </div>
                    <button
                        onClick={handleToggleSidebar}
                        className={`toggle-button ${direction}`}
                    >
                        {isSidebarOpen ? '收缩' : '展开'}
                    </button>
                </div>

            </div>
        );
    }, [sidebarClass, contentWrapperClass, children, handleToggleSidebar, direction, isSidebarOpen]);
};

export default SidebarWrapper;

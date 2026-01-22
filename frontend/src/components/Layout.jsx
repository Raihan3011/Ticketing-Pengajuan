import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <div className={`${isSidebarExpanded ? 'ml-48' : 'ml-16'} transition-all duration-300`}>
                <Header />
                <div className="p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
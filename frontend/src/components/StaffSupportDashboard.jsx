import { useState, useEffect } from "react";

function TrackTicketSection() {
    const [ticketId, setTicketId] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchResult({
            id: ticketId,
            title: "Sistem login bermasalah",
            status: "In Progress",
            priority: "High",
            created: "2024-01-15",
            assignedTo: "John Staff"
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lacak Status Tiket</h3>
                <p className="text-gray-600">Masukkan ID tiket untuk melihat status terkini</p>
            </div>

            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        placeholder="Contoh: TKT-2024-00123"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        🔍 Cari
                    </button>
                </div>
            </form>

            {searchResult && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Hasil Pencarian:</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">ID Tiket:</span>
                            <span className="font-medium">{searchResult.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Judul:</span>
                            <span className="font-medium">{searchResult.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                {searchResult.status}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Prioritas:</span>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                {searchResult.priority}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Ditangani oleh:</span>
                            <span className="font-medium">{searchResult.assignedTo}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function StaffSupportDashboard() {
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        technical: 0
    });
    const [activeTab, setActiveTab] = useState("assigned");

    useEffect(() => {
        setStats({
            assigned: 12,
            inProgress: 8,
            resolved: 25,
            technical: 5
        });
        
        setTickets([
            {
                id: "TKT-2024-001",
                title: "Sistem login bermasalah",
                priority: "High",
                status: "In Progress",
                type: "Technical",
                assignedAt: "2024-01-15",
                customer: "John Doe"
            },
            {
                id: "TKT-2024-002", 
                title: "Request akses database",
                priority: "Medium",
                status: "Assigned",
                type: "Support",
                assignedAt: "2024-01-14",
                customer: "Jane Smith"
            }
        ]);
    }, []);

    const getPriorityColor = (priority) => {
        switch(priority) {
            case "Critical": return "bg-red-100 text-red-800";
            case "High": return "bg-orange-100 text-orange-800";
            case "Medium": return "bg-yellow-100 text-yellow-800";
            case "Low": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getTypeIcon = (type) => {
        return type === "Technical" ? "🔧" : "💬";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Staff Support Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Kelola tiket support dan teknis dalam satu dashboard
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Assigned</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                📋
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                ⚡
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Resolved</p>
                                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                ✅
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Technical</p>
                                <p className="text-2xl font-bold text-purple-600">{stats.technical}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                🔧
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Lacak Tiket</p>
                                <button 
                                    onClick={() => setActiveTab("track")}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 mt-1"
                                >
                                    Cari Tiket
                                </button>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                📍
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: "assigned", label: "Assigned Tickets", icon: "📋" },
                                { id: "technical", label: "Technical Issues", icon: "🔧" },
                                { id: "support", label: "Support Requests", icon: "💬" },
                                { id: "track", label: "Lacak Tiket", icon: "📍" },
                                { id: "completed", label: "Completed", icon: "✅" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                        activeTab === tab.id
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="p-6">
                        {activeTab === "track" ? (
                            <TrackTicketSection />
                        ) : (
                        <div className="space-y-4">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                {getTypeIcon(ticket.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {ticket.id} • {ticket.customer}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {ticket.status}
                                            </span>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                                Handle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                🔍 Search Tickets
                            </button>
                            <button 
                                onClick={() => setActiveTab("track")}
                                className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                📍 Lacak Tiket
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                📊 Generate Report
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                ⚙️ System Status
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">Ticket TKT-001 resolved</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">New technical issue assigned</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <p className="text-sm text-gray-600">Priority ticket updated</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Resolution Rate</span>
                                <span className="text-sm font-medium text-green-600">92%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Avg Response Time</span>
                                <span className="text-sm font-medium text-blue-600">2.5h</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                                <span className="text-sm font-medium text-purple-600">4.8/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
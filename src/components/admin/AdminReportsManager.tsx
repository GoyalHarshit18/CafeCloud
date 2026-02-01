import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, Users, TrendingUp, Calendar } from 'lucide-react';
import { BASE_URL, getAuthToken } from '@/lib/api';

export const AdminReportsManager = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, activeTables: 0 });
    const [staffSales, setStaffSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('today'); // today, week, month

    useEffect(() => {
        fetchReports();
    }, [filter]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch(`${BASE_URL}/api/reports/${filter}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setStats({
                    totalSales: data.kpis.totalRevenue,
                    totalOrders: data.kpis.totalOrders,
                    activeTables: 0 // Will integrate live tables later if needed
                });
                // Note: staffSales logic can be expanded here if the backend provides it, 
                // for now we'll show empty or keep placeholders if not in API.
                // The current API doesn't return staff performance, so we'll just update KPI.
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Sales & Analytics</h2>
                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-md bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Branch Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-foreground">₹{stats.totalSales.toLocaleString()}</div>
                        <p className="text-xs text-status-free font-bold mt-1">+12% from yesterday</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Operational Orders</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-foreground">{stats.totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">Daily volume</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Table Occupancy</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-foreground">{stats.activeTables}</div>
                        <p className="text-xs text-muted-foreground mt-1">Live customers</p>
                    </CardContent>
                </Card>
            </div>

            {/* Staff Performance */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Staff Performance Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {staffSales.map((staff, i) => (
                            <div key={staff.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-primary text-xl">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{staff.name}</p>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{staff.orders} Orders Processed</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-xl text-primary">₹{staff.sales.toLocaleString()}</p>
                                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-status-free">
                                        <TrendingUp className="w-3 h-3" />
                                        <span>EXCELLENT</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

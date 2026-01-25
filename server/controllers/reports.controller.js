import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Table from '../models/Table.js';
import Product from '../models/Product.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';

export const getReportsByPeriod = async (req, res) => {
    try {
        const { period } = req.params;

        // Calculate date range based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        }

        // Fetch paid orders within the period
        const orders = await Order.findAll({
            where: {
                status: 'paid',
                paidAt: {
                    [Op.gte]: startDate
                }
            },
            include: [
                {
                    model: OrderItem,
                    as: 'items',
                    include: [Product]
                },
                {
                    model: Table
                }
            ],
            order: [['paidAt', 'DESC']]
        });

        // Calculate KPIs
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Calculate total customers (estimate: 2 per order)
        const totalCustomers = totalOrders * 2;

        // Calculate top products
        const productStats = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.productId;
                const productName = item.Product?.name || item.name;

                if (!productStats[productId]) {
                    productStats[productId] = {
                        name: productName,
                        quantity: 0,
                        revenue: 0
                    };
                }

                productStats[productId].quantity += item.quantity;
                productStats[productId].revenue += parseFloat(item.price) * item.quantity;
            });
        });

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Calculate hourly data (for today only)
        let hourlyData = [];
        if (period === 'today') {
            const hourlyStats = {};

            orders.forEach(order => {
                const hour = new Date(order.paidAt).getHours();
                if (!hourlyStats[hour]) {
                    hourlyStats[hour] = {
                        orders: 0,
                        revenue: 0
                    };
                }
                hourlyStats[hour].orders += 1;
                hourlyStats[hour].revenue += parseFloat(order.total);
            });

            // Format hourly data
            for (let hour = 9; hour <= 22; hour++) {
                const stats = hourlyStats[hour] || { orders: 0, revenue: 0 };
                const hourLabel = hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`;
                hourlyData.push({
                    hour: hourLabel,
                    orders: stats.orders,
                    revenue: stats.revenue
                });
            }
        }

        res.status(200).json({
            kpis: {
                totalRevenue,
                totalOrders,
                avgOrderValue,
                totalCustomers
            },
            topProducts,
            hourlyData,
            recentTransactions: orders.slice(0, 10).map(order => ({
                id: order.id,
                tableNumber: order.Table?.number || 0,
                customerName: order.customerName || '',
                customerMobile: order.customerMobile || '',
                createdAt: order.createdAt,
                paidAt: order.paidAt,
                total: parseFloat(order.total),
                paymentMethod: order.paymentMethod,
                status: order.status
            }))
        });
    } catch (error) {
        console.error('Reports error:', error);
        res.status(500).json({ message: error.message });
    }
};

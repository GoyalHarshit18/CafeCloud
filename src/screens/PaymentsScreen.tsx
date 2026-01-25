import { usePOS } from '@/hooks/use-pos';
import { format } from 'date-fns';
import { CreditCard, Calendar, IndianRupee, Table as TableIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PaymentsScreen = () => {
    const { orders } = usePOS();

    // Filter for paid orders and sort by date descending
    const paidOrders = orders
        .filter((order) => order.status === 'paid')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Payments & Transactions</h1>
                    <p className="text-muted-foreground">View your recent payment history and transaction details</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Table</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Payment Method</th>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {paidOrders.length > 0 ? (
                                paidOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-secondary/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <TableIcon className="w-4 h-4 text-primary" />
                                                <span className="font-medium italic">Table {order.tableNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">{order.customerName || 'Walk-in Customer'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                                                    order.paymentMethod === 'cash' ? "bg-emerald-500/10 text-emerald-500" :
                                                        order.paymentMethod === 'card' ? "bg-blue-500/10 text-blue-500" :
                                                            "bg-purple-500/10 text-purple-500"
                                                )}>
                                                    {order.paymentMethod || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground ml-5">
                                                    {format(new Date(order.createdAt), 'hh:mm a')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 font-mono font-bold text-primary">
                                                <IndianRupee className="w-4 h-4" />
                                                <span>{order.total.toFixed(2)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div className="text-muted-foreground">No recent transactions found</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

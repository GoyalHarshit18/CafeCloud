import { usePOS } from '@/context/POSContext';
import { useLanguage } from '@/context/LanguageContext';
import { KPICard } from '@/components/pos/KPICard';
import { Button } from '@/components/ui/button';
import {
  Play,
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Grid3X3,
  ChefHat,
  Clock,
  CreditCard,
  Settings,
  BarChart3,
  ShieldCheck,
  Monitor,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const DashboardScreen = () => {
  const { session, openSession, setCurrentScreen, orders, kdsTickets, floors } = usePOS();
  const { t } = useLanguage();

  const totalTables = floors.reduce((sum, f) => sum + f.tables.length, 0);
  const occupiedTables = floors.reduce(
    (sum, f) => sum + f.tables.filter(t => t.status !== 'free').length,
    0
  );
  const activeOrders = kdsTickets.filter(t => t.status !== 'completed').length;

  const roleFeatures = [
    { icon: Grid3X3, label: t('table'), color: 'bg-primary/10 text-primary' },
    { icon: ShoppingBag, label: t('newOrder'), color: 'bg-status-free/10 text-status-free' },
    { icon: ChefHat, label: t('kitchen'), color: 'bg-warm-amber/10 text-warm-amber' },
    { icon: BarChart3, label: t('reports'), color: 'bg-status-occupied/10 text-status-occupied' },
    { icon: Settings, label: t('settings'), color: 'bg-muted text-muted-foreground' },
  ];

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">POS Configuration Screen</h1>
          <p className="text-muted-foreground">
            Select a terminal to open a new session and start managing your cafe
          </p>
        </div>

        <div className="grid gap-6">
          <div className="pos-card overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Monitor className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Main POS Terminal</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex h-2 w-2 rounded-full bg-slate-400" />
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Disconnected</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-muted-foreground mb-1">Terminal ID</p>
                  <p className="font-mono font-bold text-foreground">POS-001</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-secondary/50 p-4 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Last Open Date</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {format(new Date(), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <IndianRupee className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Last Sale Amount</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">₹24,580.00</p>
                </div>
              </div>

              <Button
                onClick={openSession}
                size="lg"
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all bg-primary hover:bg-primary/95"
              >
                <Play className="w-6 h-6 mr-2 fill-current" />
                Open Session
              </Button>
            </div>
            <div className="bg-muted/30 px-6 py-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Software Version: 2.1.0-stable</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-status-free" />
                <span className="text-xs font-medium text-status-free">System Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard')}</h1>
          <p className="text-muted-foreground">
            Session opened at {format(session.openedAt, 'HH:mm')} by {session.cashier}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-status-free-bg rounded-xl">
          <div className="w-2 h-2 rounded-full bg-status-free animate-pulse" />
          <span className="text-sm font-medium text-status-free">Session Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={t('dailyRevenue')}
          value={`₹${session.totalSales.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12, positive: true }}
        />
        <KPICard
          title={t('totalOrders')}
          value={session.ordersCount}
          icon={ShoppingBag}
          trend={{ value: 8, positive: true }}
        />
        <KPICard
          title={t('activeTables')}
          value={`${occupiedTables}/${totalTables}`}
          icon={Users}
        />
        <KPICard
          title={t('kitchen')}
          value={activeOrders}
          icon={ChefHat}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="pos-card p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 touch-btn"
              onClick={() => setCurrentScreen('floor')}
            >
              <Grid3X3 className="w-6 h-6" />
              <span>{t('table')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 touch-btn"
              onClick={() => setCurrentScreen('kitchen')}
            >
              <ChefHat className="w-6 h-6" />
              <span>{t('kitchen')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 touch-btn"
              onClick={() => setCurrentScreen('reports')}
            >
              <BarChart3 className="w-6 h-6" />
              <span>{t('reports')}</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 touch-btn"
              onClick={() => setCurrentScreen('customer')}
            >
              <TrendingUp className="w-6 h-6" />
              <span>{t('customer')}</span>
            </Button>
          </div>
        </div>

        <div className="pos-card p-6">
          <h2 className="text-lg font-semibold mb-4">{t('orders')}</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t('orderEmpty')}</p>
              <p className="text-sm">Start by selecting a table</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[240px] overflow-y-auto scrollbar-thin">
              {orders.slice(-5).reverse().map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm text-muted-foreground">{t('table')} {order.tableNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{order.total}</p>
                    <span className={cn(
                      'status-badge',
                      order.status === 'paid' && 'status-badge-free',
                      order.status === 'in-kitchen' && 'status-badge-occupied',
                      order.status === 'pending' && 'status-badge-pending',
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

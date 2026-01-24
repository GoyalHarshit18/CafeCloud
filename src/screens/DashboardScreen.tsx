import { usePOS } from '@/context/POSContext';
import { Button } from '@/components/ui/button';
import {
  Play,
  Monitor,
  Calendar,
  IndianRupee,
  ShieldCheck,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const DashboardScreen = () => {
  const { session, openSession, closeSession } = usePOS();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">POS Configuration Screen</h1>
        <p className="text-muted-foreground">
          {session
            ? 'Terminal is active. You can resume your session or close it.'
            : 'Select a terminal to open a new session and start managing your cafe'}
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
                    {session ? (
                      <>
                        <span className="flex h-2 w-2 rounded-full bg-status-free animate-pulse" />
                        <span className="text-sm font-medium text-status-free uppercase tracking-wider">Connected</span>
                      </>
                    ) : (
                      <>
                        <span className="flex h-2 w-2 rounded-full bg-slate-400" />
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Disconnected</span>
                      </>
                    )}
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

            <div className="flex gap-4">
              {session ? (
                <>
                  <Button
                    onClick={() => navigate('/pos/floor')}
                    size="lg"
                    className="flex-1 h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all bg-primary hover:bg-primary/95"
                  >
                    <ArrowRight className="w-6 h-6 mr-2 fill-current" />
                    Resume Session
                  </Button>
                  <Button
                    onClick={closeSession}
                    size="lg"
                    variant="destructive"
                    className="h-14 px-8 text-lg font-bold shadow-lg shadow-destructive/20 active:scale-[0.98] transition-all"
                  >
                    <LogOut className="w-6 h-6 mr-2" />
                    Close
                  </Button>
                </>
              ) : (
                <Button
                  onClick={openSession}
                  size="lg"
                  className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all bg-primary hover:bg-primary/95"
                >
                  <Play className="w-6 h-6 mr-2 fill-current" />
                  Open Session
                </Button>
              )}
            </div>
          </div>
          <div className="bg-muted/30 px-6 py-3 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Software Version: 2.1.0-stable</span>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${session ? 'bg-status-free' : 'bg-slate-400'}`} />
              <span className={`text-xs font-medium ${session ? 'text-status-free' : 'text-muted-foreground'}`}>
                {session ? 'System Ready' : 'System Idle'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionCard } from '@/components/SessionCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for sessions
const mockSessions = [
    {
        id: 'sess_8f921d4',
        branchName: 'Main Branch',
        date: 'Oct 24, 2023',
        sales: 1250.50,
        status: 'open' as const
    },
    {
        id: 'sess_3a7b2c1',
        branchName: 'Main Branch',
        date: 'Oct 23, 2023',
        sales: 3420.00,
        status: 'closed' as const
    },
    {
        id: 'sess_1b4e5f6',
        branchName: 'Main Branch',
        date: 'Oct 22, 2023',
        sales: 2890.75,
        status: 'closed' as const
    }
];

export const SessionScreen = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState(mockSessions);

    const handleResume = (id: string) => {
        toast.success(`Resuming session ${id.substring(0, 8)}...`);
        // In a real app, this would set the active session context
        navigate('/pos/dashboard');
    };

    const handleClose = (id: string) => {
        if (window.confirm('Are you sure you want to close this session?')) {
            toast.info(`Closing session ${id.substring(0, 8)}...`);
            setSessions(prev => prev.map(s =>
                s.id === id ? { ...s, status: 'closed' } : s
            ));
        }
    };

    const handleNewSession = () => {
        toast.success("Starting new session...");
        // Logic to create new session would go here
        const newSession = {
            id: `sess_${Math.random().toString(36).substr(2, 7)}`,
            branchName: 'Main Branch',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            sales: 0,
            status: 'open' as const
        };
        setSessions([newSession, ...sessions]);
    };

    return (
        <div className="min-h-screen bg-secondary/30 p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* page header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sessions</h1>
                        <p className="text-muted-foreground mt-1">Manage your POS terminal sessions</p>
                    </div>
                    <Button onClick={handleNewSession} size="lg" className="shadow-md">
                        <Plus className="w-5 h-5 mr-2" />
                        New Session
                    </Button>
                </div>

                {/* active sessions section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-primary" />
                        Active Sessions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.filter(s => s.status === 'open').map(session => (
                            <SessionCard
                                key={session.id}
                                sessionId={session.id}
                                branchName={session.branchName}
                                date={session.date}
                                sales={session.sales}
                                status={session.status}
                                onResume={handleResume}
                                onClose={handleClose}
                            />
                        ))}
                        {sessions.filter(s => s.status === 'open').length === 0 && (
                            <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed">
                                No active sessions. Start a new one to begin selling.
                            </div>
                        )}
                    </div>
                </div>

                {/* past sessions section */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-lg font-semibold text-muted-foreground flex items-center gap-2">
                        <span className="w-2 h-8 rounded-full bg-border" />
                        Past Sessions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                        {sessions.filter(s => s.status === 'closed').map(session => (
                            <SessionCard
                                key={session.id}
                                sessionId={session.id}
                                branchName={session.branchName}
                                date={session.date}
                                sales={session.sales}
                                status={session.status}
                                onResume={handleResume}
                                onClose={handleClose}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

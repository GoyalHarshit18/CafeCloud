import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, PlayCircle, XCircle, Monitor, Calendar, DollarSign } from 'lucide-react';

interface SessionCardProps {
    sessionId: string;
    branchName: string;
    date: string;
    sales: number;
    status: 'open' | 'closed';
    onResume: (id: string) => void;
    onClose: (id: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
    sessionId,
    branchName,
    date,
    sales,
    status,
    onResume,
    onClose
}) => {
    return (
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4">
            {/* Header with ID and Status */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm text-muted-foreground font-medium">Terminal ID</div>
                        <div className="font-bold text-foreground font-mono">{sessionId.substring(0, 8)}...</div>
                    </div>
                </div>
                <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5",
                    status === 'open'
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                    <span className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'open' ? "bg-green-600 animate-pulse" : "bg-red-600"
                    )} />
                    {status === 'open' ? 'Active' : 'Closed'}
                </div>
            </div>

            {/* Session Details Grid */}
            <div className="grid grid-cols-2 gap-3 py-2">
                <div className="bg-secondary/30 p-3 rounded-lg flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        Date
                    </div>
                    <div className="font-semibold text-sm">{date}</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <DollarSign className="w-3.5 h-3.5" />
                        Session Sales
                    </div>
                    <div className="font-semibold text-sm">10,480</div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-1">
                {status === 'open' ? (
                    <>
                        <Button
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-5 text-base shadow-sm"
                            onClick={() => onResume(sessionId)}
                        >
                            <PlayCircle className="w-5 h-5 mr-2" />
                            Resume Session
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-[52px] w-[52px] rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-sm"
                            title="Close Session"
                            onClick={() => onClose(sessionId)}
                        >
                            <XCircle className="w-6 h-6" />
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="outline"
                        className="w-full border-dashed"
                        disabled
                    >
                        Session Closed
                    </Button>
                )}
            </div>
        </div>
    );
};

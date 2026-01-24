import { useState } from 'react';
import { usePOS } from '@/context/POSContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    CreditCard,
    Smartphone,
    Banknote,
    Building2,
    Truck,
    CircleDot,
    Circle,
    Info,
    ChevronRight,
    Ticket,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type PaymentMethodId = 'paytm' | 'phonepe' | 'card';

interface PaymentMethodRow {
    id: PaymentMethodId;
    name: string;
    icon: any;
    tag?: { text: string; color: string };
    disabled?: boolean;
    subtitle?: string;
}

export const PaymentSelectionScreen = () => {
    const { selectedTable, currentOrder, getOrderTotal, completePayment, setCurrentScreen, orders } = usePOS();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('phonepe');
    const [couponInput, setCouponInput] = useState('');
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Get total from current order or from existing order for this table
    const existingOrder = orders.find(o => o.tableId === selectedTable?.id && o.status !== 'paid');
    const orderTotal = currentOrder.length > 0 ? getOrderTotal() : (existingOrder?.total || 0);
    const tax = Math.round(orderTotal * 0.05);
    const subtotal = orderTotal + tax;
    const finalTotal = subtotal - discountAmount;

    const paymentMethods: PaymentMethodRow[] = [
        {
            id: 'paytm',
            name: 'Paytm / FastPay Later',
            icon: Smartphone,
            tag: { text: 'NEW', color: 'bg-red-500' }
        },
        {
            id: 'phonepe',
            name: 'PhonePe',
            subtitle: 'UPI, Wallet',
            icon: Smartphone,
        },
        {
            id: 'card',
            name: 'Credit / Debit / ATM Card',
            icon: CreditCard
        },
    ];

    const handleApplyCoupon = () => {
        if (couponInput.toUpperCase() === 'SAVE10') {
            const discount = Math.round(subtotal * 0.1);
            setDiscountAmount(discount);
            setIsCouponApplied(true);
            toast({
                title: "Coupon Applied!",
                description: `You saved ₹${discount} on this order.`,
            });
        } else if (couponInput.toUpperCase() === 'COFFEE20') {
            const discount = 20;
            setDiscountAmount(discount);
            setIsCouponApplied(true);
            toast({
                title: "Coupon Applied!",
                description: `Flat ₹20 discount added.`,
            });
        } else {
            toast({
                title: "Invalid Coupon",
                description: "The coupon code you entered is invalid.",
                variant: "destructive"
            });
        }
    };

    const handleRemoveCoupon = () => {
        setDiscountAmount(0);
        setIsCouponApplied(false);
        setCouponInput('');
        toast({
            title: "Coupon Removed",
        });
    };

    const handleContinue = () => {

        // Simulate payment completion for demo purposes
        // In a real app, this would route to specific providers
        const methodMap: Record<string, 'cash' | 'card' | 'upi'> = {
            'card': 'card',
            'phonepe': 'upi',
            'paytm': 'upi',
        };

        const finalMethod = methodMap[selectedMethod] || 'cash';

        toast({
            title: "Processing Payment...",
            description: `Connecting to ${selectedMethod.toUpperCase()}...`,
        });

        setTimeout(() => {
            completePayment(finalMethod);
            toast({
                title: t('paymentSuccess'),
                description: `Successfully paid ₹${finalTotal}`,
            });
            setCurrentScreen('floor');
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F1F3F6] pb-24">
            {/* Header */}
            <header className="bg-primary text-primary-foreground px-4 h-14 flex items-center gap-4 sticky top-0 z-50 shadow-md">
                <button
                    onClick={() => setCurrentScreen('order')}
                    className="p-1 -ml-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-medium">Payments</h1>
            </header>

            <main className="flex-1 w-full max-w-2xl mx-auto p-0 sm:p-4">
                {/* Payment Methods Section */}
                <div className="bg-white shadow-sm sm:rounded-[8px] overflow-hidden border-b border-gray-200 sm:border">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            onClick={() => !method.disabled && setSelectedMethod(method.id)}
                            className={cn(
                                "flex items-center justify-between p-4 border-b last:border-0 border-gray-100 cursor-pointer transition-colors",
                                selectedMethod === method.id ? "bg-blue-50/50" : "bg-white",
                                method.disabled && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-100",
                                    method.id === 'phonepe' && "text-[#5f259f]",
                                    method.id === 'paytm' && "text-[#00baf2]"
                                )}>
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            "text-[15px] font-medium text-gray-800",
                                            selectedMethod === method.id && "font-bold text-gray-900"
                                        )}>
                                            {method.name}
                                        </span>
                                        {method.tag && (
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded-sm text-[10px] font-bold text-white uppercase",
                                                method.tag.color
                                            )}>
                                                {method.tag.text}
                                            </span>
                                        )}
                                    </div>
                                    {method.subtitle && (
                                        <p className={cn(
                                            "text-xs mt-0.5",
                                            method.disabled ? "text-red-500" : "text-gray-500"
                                        )}>
                                            {method.subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                {selectedMethod === method.id ? (
                                    <CircleDot className="w-5 h-5 text-primary fill-primary/10" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-300" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coupon Code Section */}
                <div className="mt-4 bg-white shadow-sm sm:rounded-[8px] overflow-hidden border border-gray-100 sm:border-gray-200">
                    {!isCouponApplied ? (
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-primary" />
                                <span className="text-[15px] font-bold text-gray-800 tracking-tight">Apply Coupon</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter coupon code (e.g. SAVE10)"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value)}
                                    className="flex-1 h-10 px-3 bg-gray-50 border border-gray-200 rounded-md text-[14px] focus:outline-none focus:border-primary transition-all uppercase placeholder:text-gray-400 font-medium"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={!couponInput}
                                    className="px-4 h-10 bg-primary text-white text-[13px] font-bold rounded-md disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-primary/10"
                                >
                                    APPLY
                                </button>
                            </div>
                            <p className="text-[10px] text-muted-foreground italic">Use <span className="text-primary font-bold">SAVE10</span> for 10% discount</p>
                        </div>
                    ) : (
                        <div className="p-4 flex items-center justify-between bg-status-free/5 border border-status-free/20 animate-fade-in">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-status-free/10 flex items-center justify-center">
                                    <Ticket className="w-4 h-4 text-status-free" />
                                </div>
                                <div>
                                    <span className="text-[13px] font-bold text-status-free uppercase tracking-wider">Coupon Applied</span>
                                    <p className="text-[11px] text-gray-500 font-medium">You saved ₹{discountAmount}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveCoupon}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Secure Payment Footer */}
                <div className="flex items-center justify-center gap-2 mt-8 py-4 opacity-40">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-widest italic">100% Secure Payments</span>
                </div>
            </main>

            {/* Bottom Summary Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 z-50 flex items-center justify-between shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-black text-gray-900 leading-none">₹{finalTotal.toLocaleString()}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <button className="text-[11px] text-primary font-bold hover:underline mt-0.5 w-fit">
                        View price details
                    </button>
                </div>
                <Button
                    onClick={handleContinue}
                    className="h-12 px-10 rounded-[8px] bg-[#fb641b] hover:bg-[#fb641b]/90 text-white font-bold text-base shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                >
                    CONTINUE
                </Button>
            </div>
        </div>
    );
};

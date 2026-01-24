import React, { createContext, useContext } from 'react';

const translations = {
    // Common
    loading: 'Loading...',
    hello: 'Hello',

    // Sidebar
    dashboard: 'Dashboard',
    pos: 'Point of Sale',
    kitchen: 'Kitchen Display',
    customer: 'Customer View',
    orders: 'Orders',
    payment: 'Payment',
    reports: 'Reports',
    settings: 'Settings',

    // POS / Order Screen
    searchProducts: 'Search products...',
    allCategories: 'All Categories',
    table: 'Table',
    guest: 'Guest',
    guests: 'Guests',
    orderEmpty: 'Order is empty',
    addToCart: 'Add to Cart',
    item: 'Item',
    qty: 'Qty',
    price: 'Price',
    total: 'Total',
    sendToKitchen: 'Send to Kitchen',
    payNow: 'Pay Now',
    items: 'Items',
    tax: 'Tax',
    subtotal: 'Subtotal',
    discount: 'Discount',

    // Kitchen Screen
    toCook: 'To Cook',
    preparing: 'Preparing',
    completed: 'Completed',
    ready: 'Ready',
    noOrders: 'No active orders',
    markReady: 'Mark Ready',
    markCompleted: 'Mark Completed',
    orderId: 'Order ID',

    // Customer Screen
    yourFoodBeingPrepared: 'Your food is being prepared',
    readyToServe: 'Ready to serve',
    pleaseCollect: 'Please collect your order',
    paid: 'Paid',
    unpaid: 'Unpaid',
    paymentPending: 'Payment Pending',
    thankYou: 'Thank you for dining with us!',

    // Payment Screen
    paymentMethods: 'Payment Methods',
    cash: 'Cash',
    card: 'Card',
    upi: 'UPI / QR',
    confirmPayment: 'Confirm Payment',
    processing: 'Processing...',
    paymentSuccess: 'Payment Successful',
    changeDue: 'Change Due',
    amountTendered: 'Amount Tendered',
    remaining: 'Remaining',
    receipt: 'Receipt',
    printReceipt: 'Print Receipt',
    newOrder: 'New Order',
    cancel: 'Cancel',

    // Dashboard
    openSession: 'Open Session',
    closeRegister: 'Close Register',
    reloadData: 'Reload Data',
    dailyRevenue: 'Daily Revenue',
    totalOrders: 'Total Orders',
    activeTables: 'Active Tables',
    avgOrderValue: 'Avg. Order Value'
};

export type TranslationKey = keyof typeof translations;

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const language = 'en';
    const setLanguage = () => { };

    const t = (key: TranslationKey): string => {
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

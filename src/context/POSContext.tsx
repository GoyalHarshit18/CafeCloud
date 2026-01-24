import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Order, OrderItem, Product, Session, KDSTicket, TableStatus } from '@/types/pos';
import { floors as initialFloors } from '@/data/floors';

interface POSContextType {
  session: Session | null;
  openSession: () => void;
  closeSession: () => void;

  floors: typeof initialFloors;
  selectedTable: Table | null;
  selectTable: (table: Table | null) => void;
  updateTableStatus: (tableId: string, status: TableStatus) => void;

  currentOrder: OrderItem[];
  addToOrder: (product: Product) => void;
  removeFromOrder: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearOrder: () => void;
  getOrderTotal: () => number;

  kdsTickets: KDSTicket[];
  sendToKitchen: () => void;
  updateKDSStatus: (orderId: string, status: KDSTicket['status']) => void;

  orders: Order[];
  completePayment: (method: 'cash' | 'card' | 'upi') => void;

  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [floors, setFloors] = useState(initialFloors);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [kdsTickets, setKdsTickets] = useState<KDSTicket[]>([]);
  const [orderCounter, setOrderCounter] = useState(1001);

  // Derive currentScreen from URL
  // e.g. /pos/dashboard -> dashboard
  const currentScreen = location.pathname.split('/').pop() || 'dashboard';

  const setCurrentScreen = useCallback((screen: string) => {
    navigate(`/pos/${screen}`);
  }, [navigate]);

  const openSession = useCallback(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const cashierName = user?.username || 'Staff User';

    setSession({
      id: `session-${Date.now()}`,
      openedAt: new Date(),
      cashier: cashierName,
      openingBalance: 5000,
      totalSales: 0,
      ordersCount: 0,
    });
    // Navigate to floor screen
    navigate('/pos/floor');
  }, [navigate]);

  const closeSession = useCallback(() => {
    if (session) {
      setSession({
        ...session,
        closedAt: new Date(),
        closingBalance: session.openingBalance + session.totalSales,
      });
      setSession(null);
    }
  }, [session]);

  const selectTable = useCallback((table: Table | null) => {
    setSelectedTable(table);
    if (table) {
      setCurrentOrder([]);
    }
  }, []);

  const updateTableStatus = useCallback((tableId: string, status: TableStatus) => {
    setFloors(prev => prev.map(floor => ({
      ...floor,
      tables: floor.tables.map(table =>
        table.id === tableId ? { ...table, status } : table
      )
    })));
  }, []);

  const addToOrder = useCallback((product: Product) => {
    setCurrentOrder(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromOrder = useCallback((productId: string) => {
    setCurrentOrder(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
      return;
    }
    setCurrentOrder(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromOrder]);

  const clearOrder = useCallback(() => {
    setCurrentOrder([]);
  }, []);

  const getOrderTotal = useCallback(() => {
    return currentOrder.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [currentOrder]);

  const sendToKitchen = useCallback(() => {
    if (!selectedTable || currentOrder.length === 0) return;

    const orderId = `ORD-${orderCounter}`;
    setOrderCounter(prev => prev + 1);

    const newTicket: KDSTicket = {
      orderId,
      tableNumber: selectedTable.number,
      items: [...currentOrder],
      status: 'to-cook',
      createdAt: new Date(),
    };

    setKdsTickets(prev => [...prev, newTicket]);
    updateTableStatus(selectedTable.id, 'occupied');

    const newOrder: Order = {
      id: orderId,
      tableId: selectedTable.id,
      tableNumber: selectedTable.number,
      items: [...currentOrder],
      status: 'in-kitchen',
      createdAt: new Date(),
      updatedAt: new Date(),
      total: getOrderTotal(),
    };

    setOrders(prev => [...prev, newOrder]);
    clearOrder();
  }, [selectedTable, currentOrder, orderCounter, updateTableStatus, getOrderTotal, clearOrder]);

  const updateKDSStatus = useCallback((orderId: string, status: KDSTicket['status']) => {
    setKdsTickets(prev =>
      prev.map(ticket =>
        ticket.orderId === orderId
          ? {
            ...ticket,
            status,
            startedAt: status === 'preparing' ? new Date() : ticket.startedAt,
            completedAt: status === 'completed' ? new Date() : ticket.completedAt,
          }
          : ticket
      )
    );
  }, []);

  const completePayment = useCallback((method: 'cash' | 'card' | 'upi') => {
    if (!selectedTable) return;

    const tableOrder = orders.find(o => o.tableId === selectedTable.id && o.status !== 'paid');
    if (tableOrder) {
      setOrders(prev =>
        prev.map(o =>
          o.id === tableOrder.id
            ? { ...o, status: 'paid', paymentMethod: method, updatedAt: new Date() }
            : o
        )
      );

      setSession(prev => prev ? {
        ...prev,
        totalSales: prev.totalSales + tableOrder.total,
        ordersCount: prev.ordersCount + 1,
      } : null);
    }

    updateTableStatus(selectedTable.id, 'free');
    setSelectedTable(null);
    clearOrder();
  }, [selectedTable, orders, updateTableStatus, clearOrder]);

  return (
    <POSContext.Provider
      value={{
        session,
        openSession,
        closeSession,
        floors,
        selectedTable,
        selectTable,
        updateTableStatus,
        currentOrder,
        addToOrder,
        removeFromOrder,
        updateQuantity,
        clearOrder,
        getOrderTotal,
        kdsTickets,
        sendToKitchen,
        updateKDSStatus,
        orders,
        completePayment,
        currentScreen,
        setCurrentScreen,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within POSProvider');
  }
  return context;
};

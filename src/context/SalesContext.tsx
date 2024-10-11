import React, { createContext, useState, useContext, useEffect } from 'react';

interface SaleItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Sale {
  id: number;
  items: SaleItem[];
  subtotal: number;
  total: number;
  discount: number;
  paymentReceived: number;
  change: number;
  date: Date;
  storeLocation: string;
}

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  getSaleById: (id: number) => Sale | undefined;
  clearSales: () => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    // Simulating fetching sales from an API
    const fetchSales = async () => {
      // In a real application, this would be an API call
      // For now, we'll just set an empty array
      setSales([]);
    };

    fetchSales();
  }, []);

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = {
      ...sale,
      id: Date.now(), // This is a simple way to generate a unique id
      date: new Date(),
    };
    setSales([...sales, newSale]);
  };

  const getSaleById = (id: number) => {
    return sales.find(sale => sale.id === id);
  };

  const clearSales = () => {
    setSales([]);
  };

  return (
    <SalesContext.Provider value={{ sales, addSale, getSaleById, clearSales }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
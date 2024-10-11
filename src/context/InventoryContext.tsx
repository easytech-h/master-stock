import React, { createContext, useState, useContext, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteAllProducts: () => void;
  updateProductQuantity: (id: string, quantitySold: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Initialize with some sample products
    setProducts([
      { id: '1', name: 'Laptop', description: 'High-performance laptop', quantity: 20, price: 999.99 },
      { id: '2', name: 'Smartphone', description: 'Latest model smartphone', quantity: 50, price: 699.99 },
      { id: '3', name: 'Tablet', description: '10-inch tablet', quantity: 30, price: 299.99 },
      { id: '4', name: 'Headphones', description: 'Noise-cancelling headphones', quantity: 100, price: 149.99 },
      { id: '5', name: 'Smart Watch', description: 'Fitness tracking smartwatch', quantity: 40, price: 199.99 },
    ]);
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const deleteAllProducts = () => {
    setProducts([]);
  };

  const updateProductQuantity = (id: string, quantitySold: number) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, quantity: product.quantity - quantitySold } : product
    ));
  };

  return (
    <InventoryContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, deleteAllProducts, updateProductQuantity }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { useSales } from '../context/SalesContext';
import { Package, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { products } = useInventory();
  const { sales } = useSales();

  const totalProducts = products.length;
  const soldProducts = sales ? sales.reduce((acc, sale) => acc + sale.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0) : 0;
  const availableProducts = products.reduce((acc, product) => acc + product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity < 5).length;
  const soldOutProducts = products.filter(product => product.quantity === 0);

  const Widget: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center ${color}`}>
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-sm sm:text-lg font-semibold">{title}</h3>
        <p className="text-xl sm:text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Widget title="Total Products" value={totalProducts} icon={<Package size={24} sm:size={32} />} color="text-blue-600" />
        <Widget title="Sold Products" value={soldProducts} icon={<ShoppingCart size={24} sm:size={32} />} color="text-green-600" />
        <Widget title="Available Products" value={availableProducts} icon={<DollarSign size={24} sm:size={32} />} color="text-yellow-600" />
        <Widget title="Low Stock Products" value={lowStockProducts} icon={<AlertTriangle size={24} sm:size={32} />} color="text-red-600" />
      </div>
      
      {soldOutProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sold Out Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {soldOutProducts.map(product => (
              <div key={product.id} className="bg-red-100 p-4 rounded-lg">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">ID: {product.id}</p>
                <p className="text-red-600 font-bold mt-2">SOLD OUT</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
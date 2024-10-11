import React, { useState } from 'react';
import { useSales } from '../context/SalesContext';
import { useInventory } from '../context/InventoryContext';
import { Calendar } from 'lucide-react';

const SalesHistory: React.FC = () => {
  const { sales } = useSales();
  const { products } = useInventory();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    return saleDate >= start && saleDate <= end;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProducts = filteredSales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Sales History</h1>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-2">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              onClick={() => {}}
            >
              <Calendar className="inline-block mr-2" size={18} />
              Filter Sales
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSales.map((sale) => (
              <tr key={sale.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.id}</td>
                <td className="px-6 py-4">
                  <ul>
                    {sale.items.map((item, index) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <li key={index}>
                          {product?.name} x {item.quantity} ({item.price.toFixed(2)} HTG each)
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.total.toFixed(2)} HTG</td>
                <td className="px-6 py-4 whitespace-nowrap">{sale.discount.toFixed(2)} HTG</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <p className="mb-2">Total Sales: {totalSales.toFixed(2)} HTG</p>
        <p>Total Products Sold: {totalProducts}</p>
      </div>
    </div>
  );
};

export default SalesHistory;
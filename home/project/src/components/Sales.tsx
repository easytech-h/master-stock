import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useSales } from '../context/SalesContext';
import { ShoppingCart, Printer, Download, Search, X, AlertTriangle } from 'lucide-react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const Sales: React.FC = () => {
  const { products, updateProductQuantity } = useInventory();
  const { sales, addSale } = useSales();
  const [selectedProducts, setSelectedProducts] = useState<{ id: string; quantity: number; name: string; price: number }[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentReceived, setPaymentReceived] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicket, setShowTicket] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;
  const change = paymentReceived - total;

  const handleProductSelect = (product: any) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(selectedProducts.map(p =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 0) return;
    setSelectedProducts(selectedProducts.map(p =>
      p.id === id ? { ...p, quantity } : p
    ));
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };

  const handleCompleteSale = () => {
    if (selectedProducts.length === 0) {
      setError('Please select at least one product');
      return;
    }
    if (paymentReceived < total) {
      setError('Payment received is less than the total amount');
      return;
    }

    const saleItems = selectedProducts.map(sp => ({
      productId: sp.id,
      quantity: sp.quantity,
      price: sp.price
    }));

    const newSale = {
      id: `SALE-${Date.now()}`,
      items: saleItems,
      subtotal,
      total,
      discount,
      paymentReceived,
      change,
      date: new Date(),
      cashier: "John Doe", // Replace with actual cashier name
      storeLocation: "Main Street Store" // Replace with actual store location
    };

    addSale(newSale);
    setCurrentSale(newSale);
    setShowTicket(true);

    // Update inventory
    selectedProducts.forEach(product => {
      updateProductQuantity(product.id, product.quantity);
    });

    // Reset the form
    setSelectedProducts([]);
    setDiscount(0);
    setPaymentReceived(0);
    setError(null);
  };

  const generateTicketPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Header
      doc.setFontSize(18);
      doc.text('EASYTECH MASTER STOCK', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Sales Ticket', pageWidth / 2, 25, { align: 'center' });

      // Sale Details
      doc.setFontSize(10);
      const detailsStartY = 35;
      doc.text(`Transaction ID: ${currentSale.id}`, 14, detailsStartY);
      doc.text(`Date: ${currentSale.date.toLocaleString()}`, 14, detailsStartY + 5);
      doc.text(`Cashier: ${currentSale.cashier}`, 14, detailsStartY + 10);
      doc.text(`Store: ${currentSale.storeLocation}`, 14, detailsStartY + 15);

      // Items Table
      const tableStartY = detailsStartY + 25;
      const tableData = currentSale.items.map((item: any) => {
        const product = products.find(p => p.id === item.productId);
        return [product?.name, item.quantity, `$${item.price.toFixed(2)}`, `$${(item.quantity * item.price).toFixed(2)}`];
      });

      doc.autoTable({
        startY: tableStartY,
        head: [['Product', 'Quantity', 'Price', 'Total']],
        body: tableData,
        foot: [
          ['', '', 'Subtotal:', `$${currentSale.subtotal.toFixed(2)}`],
          ['', '', 'Discount:', `$${currentSale.discount.toFixed(2)}`],
          ['', '', 'Total:', `$${currentSale.total.toFixed(2)}`],
          ['', '', 'Payment Received:', `$${currentSale.paymentReceived.toFixed(2)}`],
          ['', '', 'Change:', `$${currentSale.change.toFixed(2)}`],
        ],
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.5 },
        headStyles: { fillColor: [66, 66, 66] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      });

      const finalY = (doc as any).lastAutoTable.finalY || tableStartY;
      doc.text('Return Policy: Items can be returned within 30 days with receipt.', 14, finalY + 10);

      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const handlePrintTicket = () => {
    const doc = generateTicketPDF();
    if (doc) {
      try {
        doc.autoPrint();
        const blob = doc.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        const printWindow = window.open(blobUrl, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            URL.revokeObjectURL(blobUrl);
          };
        } else {
          throw new Error('Unable to open print window');
        }
      } catch (error) {
        console.error('Error printing ticket:', error);
        alert('An error occurred while trying to print. Please try again.');
      }
    } else {
      alert('An error occurred while generating the ticket. Please try again.');
    }
  };

  const handleDownloadTicket = () => {
    const doc = generateTicketPDF();
    if (doc) {
      try {
        doc.save(`sales_ticket_${currentSale.id}.pdf`);
      } catch (error) {
        console.error('Error downloading ticket:', error);
        alert('An error occurred while trying to download. Please try again.');
      }
    } else {
      alert('An error occurred while generating the ticket. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sales System</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Products</h2>
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-2 pl-8 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleProductSelect(product)}
                        className="text-indigo-600 hover:text-indigo-900"
                        disabled={product.quantity === 0}
                      >
                        Add to Sale
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Sale</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <table className="min-w-full mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                        className="w-16 p-1 border rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${(product.price * product.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Discount:</span>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value))}
                className="w-24 p-1 border rounded"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Payment Received:</label>
              <input
                type="number"
                min="0"
                value={paymentReceived}
                onChange={(e) => setPaymentReceived(parseFloat(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Change:</span>
              <span>${change.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCompleteSale}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={selectedProducts.length === 0}
            >
              <ShoppingCart className="inline-block mr-2" size={18} />
              Complete Sale
            </button>
          </div>
        </div>
      </div>
      {showTicket && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 text-center mb-4">Sales Ticket</h3>
              <div className="border p-4 mb-4">
                <h4 className="text-xl font-bold text-center mb-2">EASYTECH MASTER STOCK</h4>
                <p className="text-center mb-4">{currentSale.storeLocation}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p><strong>Transaction ID:</strong> {currentSale.id}</p>
                    <p><strong>Date:</strong> {currentSale.date.toLocaleString()}</p>
                    <p><strong>Cashier:</strong> {currentSale.cashier}</p>
                  </div>
                </div>
                <table className="w-full mb-4">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left">Product</th>
                      <th className="text-right">Quantity</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSale.items.map((item: any, index: number) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <tr key={index} className="border-b">
                          <td>{product?.name}</td>
                          <td className="text-right">{item.quantity}</td>
                          <td className="text-right">${item.price.toFixed(2)}</td>
                          <td className="text-right">${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${currentSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Discount:</span>
                  <span>${currentSale.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mb-2">
                  <span>Total:</span>
                  <span>${currentSale.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Payment Received:</span>
                  <span>${currentSale.paymentReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Change:</span>
                  <span>${currentSale.change.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-sm mb-4">Return Policy: Items can be returned within 30 days with receipt.</p>
              <div className="flex justify-center space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handlePrintTicket}
                >
                  <Printer className="inline-block mr-2" size={18} />
                  Print Ticket
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={handleDownloadTicket}
                >
                  <Download className="inline-block mr-2" size={18} />
                  Download Ticket
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => setShowTicket(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
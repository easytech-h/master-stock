import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Plus, Trash2, Edit, AlertTriangle, Search } from 'lucide-react';

const Inventory: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, deleteAllProducts } = useInventory();
  const [newProduct, setNewProduct] = useState({ name: '', description: '', quantity: 0, price: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  const handleAddProduct = () => {
    addProduct(newProduct);
    setNewProduct({ name: '', description: '', quantity: 0, price: 0 });
  };

  const handleUpdateProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateProduct(id, product);
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleDeleteAllProducts = () => {
    if (window.confirm('Are you sure you want to delete all products? This action cannot be undone.')) {
      deleteAllProducts();
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Inventory Management</h1>
      
      {/* Add New Product Form */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-2 border rounded"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Product Description"
            className="w-full p-2 border rounded"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="w-full p-2 border rounded"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price (HTG)"
            className="w-full p-2 border rounded"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAddProduct}
        >
          <Plus className="inline-block mr-1" size={18} />
          Add Product
        </button>
      </div>

      {/* Search and Delete All */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search products"
            className="pl-10 pr-4 py-2 border rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full sm:w-auto"
          onClick={handleDeleteAllProducts}
        >
          <Trash2 className="inline-block mr-1" size={18} />
          Delete All Products
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (HTG)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className={product.quantity === 0 ? 'bg-red-100' : product.quantity < 5 ? 'bg-orange-100' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, { ...product, name: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProduct === product.id ? (
                    <input
                      type="text"
                      value={product.description}
                      onChange={(e) => updateProduct(product.id, { ...product, description: e.target.value })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProduct === product.id ? (
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, { ...product, quantity: parseInt(e.target.value) })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    product.quantity
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProduct === product.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, { ...product, price: parseFloat(e.target.value) })}
                      className="w-full p-1 border rounded"
                    />
                  ) : (
                    `${product.price.toFixed(2)} HTG`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProduct === product.id ? (
                    <button
                      className="text-green-600 hover:text-green-900 mr-2"
                      onClick={() => handleUpdateProduct(product.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => setEditingProduct(product.id)}
                    >
                      <Edit size={18} />
                    </button>
                  )}
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
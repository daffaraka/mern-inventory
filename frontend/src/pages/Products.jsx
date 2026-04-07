import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Filter,
} from "lucide-react";
import { toast } from "react-hot-toast";

import productService from "../services/productService";
import ProductModal from "../components/products/ProductModal";
import Button from "../components/common/Button";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState("");

  // State untuk menyimpan id produk yang dicentang
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // In a real app, we would pass search params here
      const data = await productService.getAll();
      setProducts(data.products);
      setUser(data.user); // Assuming backend returns array or { products: [] }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.delete(id);
        toast.success("Product deleted");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Toggle centang satu produk
  const handleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle centang semua produk yang tampil (hasil filter)
  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p._id));
    }
  };

  // Hitung total stock & price dari produk yang dicentang
  const selectedProducts = products.filter(p => selectedIds.includes(p._id));
  const totalSelectedStock = selectedProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const totalSelectedPrice = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  // Simple client-side search for now if backend doesn't support query params yet
  // Adjust based on actual API capabilities.
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">Manage your inventory items</p>
        </div>
        <div className="flex items-center gap-3">
         
          <Button
            onClick={() => setModalOpen(true)}
            className={`flex items-center gap-2 `}
            disabled={user?.role !== "admin"}
          >
            <Plus size={20} />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors w-full sm:w-auto justify-center">
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {/* Summary bar: muncul hanya jika ada produk yang dicentang */}
      {selectedIds.length > 0 && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl px-6 py-3 flex flex-wrap gap-6 items-center text-sm">
          <span className="font-semibold text-brand-700">{selectedIds.length} product(s) selected</span>
          {/* Total stock dari semua produk yang dicentang */}
          <span className="text-gray-700">Total Stock: <span className="font-bold">{totalSelectedStock} units</span></span>
          {/* Total price dari semua produk yang dicentang */}
          <span className="text-gray-700">Total Price: <span className="font-bold">${totalSelectedPrice.toFixed(2)}</span></span>
          <button onClick={() => setSelectedIds([])} className="ml-auto text-xs text-gray-400 hover:text-red-500">Clear selection</button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                {/* Kolom checkbox untuk select all */}
                <th className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Ref/SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-600"></div>
                      Loading products...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Checkbox per baris produk */}
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product._id)}
                        onChange={() => handleSelectOne(product._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`font-medium ${product.quantity <= 10 ? "text-red-600" : "text-green-600"}`}
                      >
                        {product.quantity}
                      </div>
                      <div className="text-xs text-gray-400">units</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    
                      {product.category === 'Logistik Material' ? 'Rp.' : '$'}{product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <button
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                         ${product.status === "pending" ? "bg-amber-100 text-amber-700" : ""}
                         ${product.status === "validated" ? "bg-blue-300 text-blue-700" : ""}
                         ${product.status === "approved" ? "bg-green-300 text-green-700" : ""}
                         ${product.status === "rejected" ? "bg-red-600 text-white" : ""}

                         `}
                      >
                        {product.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination could go here */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
          <span>Showing {filteredProducts.length} results</span>
          {/* Simple placeholder for pagination controls */}
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
              disabled
            >
              Prev
            </button>
            <button
              className="px-3 py-1 border rounded bg-white disabled:opacity-50"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        productToEdit={editingProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
};

export default Products;

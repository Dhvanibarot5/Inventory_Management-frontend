import React, { useState, useEffect } from "react";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    return savedSuppliers ? JSON.parse(savedSuppliers) : [];
  });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    items: "",
  });

  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      setSuppliers(suppliers.map((sup) => (sup.id === editingSupplier.id ? { ...formData, id: sup.id } : sup)));
      setEditingSupplier(null);
    } else {
      setSuppliers([...suppliers, { ...formData, id: Date.now() }]);
    }
    setFormData({ name: "", contact: "", email: "", address: "", items: "" });
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(suppliers.filter((sup) => sup.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Items Supplied</label>
              <textarea
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingSupplier ? "Update Supplier" : "Add Supplier"}
            </button>
            {editingSupplier && (
              <button
                type="button"
                onClick={() => {
                  setEditingSupplier(null);
                  setFormData({ name: "", contact: "", email: "", address: "", items: "" });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{supplier.name}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(supplier)} className="text-blue-500 hover:text-blue-700">
                  Edit
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <p>
                <span className="text-gray-600">Contact:</span> {supplier.contact}
              </p>
              <p>
                <span className="text-gray-600">Email:</span> {supplier.email}
              </p>
              <p>
                <span className="text-gray-600">Address:</span> {supplier.address}
              </p>
              <p>
                <span className="text-gray-600">Items Supplied:</span> {supplier.items}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierManagement;

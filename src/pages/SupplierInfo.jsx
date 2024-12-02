import React, { useState, useEffect } from "react";

function SupplierInfo() {
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    return savedSuppliers ? JSON.parse(savedSuppliers) : [];
  });
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    items: "",
    status: "active",
    paymentTerms: "",
    rating: 5,
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const stats = {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter((s) => s.status === "active").length,
    inactiveSuppliers: suppliers.filter((s) => s.status === "inactive").length,
    pendingSuppliers: suppliers.filter((s) => s.status === "pending").length,
  };

  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.contact.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    const newSupplier = {
      ...formData,
      id: editingSupplier ? editingSupplier.id : Date.now(),
      updatedAt: new Date().toISOString(),
    };

    if (editingSupplier) {
      setSuppliers(suppliers.map((sup) => (sup.id === editingSupplier.id ? newSupplier : sup)));
      setEditingSupplier(null);
    } else {
      setSuppliers([...suppliers, newSupplier]);
    }

    setFormData({
      name: "",
      contact: "",
      email: "",
      address: "",
      items: "",
      status: "active",
      paymentTerms: "",
      rating: 5,
    });
    setShowForm(false);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(suppliers.filter((sup) => sup.id !== id));
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredSuppliers = suppliers
    .filter(
      (supplier) => supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const order = sortOrder === "asc" ? 1 : -1;

      if (typeof aValue === "string") {
        return aValue.localeCompare(bValue) * order;
      }
      return (aValue - bValue) * order;
    });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
        <button
          onClick={() => {
            setEditingSupplier(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showForm ? "Close Form" : "Add New Supplier"}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Form Section */}
      {showForm && (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Net 30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
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
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSupplier(null);
                  setFormData({
                    name: "",
                    contact: "",
                    email: "",
                    address: "",
                    items: "",
                    status: "active",
                    paymentTerms: "",
                    rating: 5,
                  });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Total Suppliers</h3>
          <p className="text-2xl font-bold">{stats.totalSuppliers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Active Suppliers</h3>
          <p className="text-2xl font-bold text-green-500">{stats.activeSuppliers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Inactive Suppliers</h3>
          <p className="text-2xl font-bold text-red-500">{stats.inactiveSuppliers}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Pending Suppliers</h3>
          <p className="text-2xl font-bold text-yellow-500">{stats.pendingSuppliers}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button onClick={() => handleSort("name")} className={`px-3 py-1 rounded ${sortBy === "name" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
          Sort by Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          onClick={() => handleSort("rating")}
          className={`px-3 py-1 rounded ${sortBy === "rating" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Sort by Rating {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button
          onClick={() => handleSort("status")}
          className={`px-3 py-1 rounded ${sortBy === "status" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Sort by Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{supplier.name}</h3>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.status === "active"
                      ? "bg-green-100 text-green-800"
                      : supplier.status === "inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                </span>
              </div>
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
                <span className="text-gray-600">Payment Terms:</span> {supplier.paymentTerms}
              </p>
              <p>
                <span className="text-gray-600">Rating:</span> {"⭐".repeat(supplier.rating)}
              </p>
              <p>
                <span className="text-gray-600">Items Supplied:</span> {supplier.items}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg">
          <p className="text-gray-500">No suppliers found</p>
        </div>
      )}
    </div>
  );
}

export default SupplierInfo;

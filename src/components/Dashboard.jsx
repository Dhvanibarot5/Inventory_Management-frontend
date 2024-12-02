import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import InventoryItemForm from "./InventoryItemForm";

const Dashboard = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("inventoryItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [filteredItems, setFilteredItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(items));
    filterItems();
  }, [items, searchTerm, categoryFilter, supplierFilter]);

  // Get unique categories and suppliers for filters
  const categories = [...new Set(items.map((item) => item.category))];
  const suppliers = [...new Set(items.map((item) => item.supplier))];

  const filterItems = () => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (supplierFilter) {
      filtered = filtered.filter((item) => item.supplier === supplierFilter);
    }

    setFilteredItems(filtered);
  };

  const handleSubmit = (formData) => {
    if (editingItem) {
      setItems(items.map((item) => (item.id === editingItem.id ? { ...formData, id: item.id } : item)));
      setEditingItem(null);
    } else {
      setItems([...items, { ...formData, id: Date.now() }]);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 5) return { color: "red", text: "Critical" };
    if (quantity <= 10) return { color: "orange", text: "Low" };
    return { color: "green", text: "Good" };
  };

  const getStockIndicatorClass = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-white text-sm font-medium";
    switch (status) {
      case "red":
        return `${baseClasses} bg-red-500`;
      case "orange":
        return `${baseClasses} bg-orange-500`;
      default:
        return `${baseClasses} bg-green-500`;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Dashboard</h1>

        <FilterBar
          onSearch={setSearchTerm}
          onFilterCategory={setCategoryFilter}
          onFilterSupplier={setSupplierFilter}
          categories={categories}
          suppliers={suppliers}
        />

        <InventoryItemForm onSubmit={handleSubmit} itemToEdit={editingItem} onCancel={() => setEditingItem(null)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item.quantity);
          return (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <div className="flex gap-2">
                  <button onClick={() => setEditingItem(item)} className="text-blue-500 hover:text-blue-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{item.category}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Supplier</span>
                  <span className="font-medium">{item.supplier}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      stockStatus.color === "red" ? "bg-red-500" : stockStatus.color === "orange" ? "bg-orange-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min((item.quantity / 20) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

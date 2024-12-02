import React, { useState, useEffect } from "react";
import FilterBar from "../components/FilterBar";
import ItemCard from "../components/ItemCard";
import InventoryItemForm from "../components/InventoryItemForm";

function InventoryDashboard() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("inventoryItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [filteredItems, setFilteredItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  const categories = [...new Set(items.map((item) => item.category))];
  const suppliers = [...new Set(items.map((item) => item.supplier))];

  useEffect(() => {
    localStorage.setItem("inventoryItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, categoryFilter, supplierFilter]);

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
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showForm ? "Close Form" : "Add New Item"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <InventoryItemForm
            onSubmit={handleSubmit}
            itemToEdit={editingItem}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      <FilterBar
        onSearch={setSearchTerm}
        onFilterCategory={setCategoryFilter}
        onFilterSupplier={setSupplierFilter}
        categories={categories}
        suppliers={suppliers}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Total Items</h3>
          <p className="text-2xl font-bold">{items.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Low Stock Items</h3>
          <p className="text-2xl font-bold text-orange-500">{items.filter((item) => item.quantity <= 10 && item.quantity > 5).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Critical Stock</h3>
          <p className="text-2xl font-bold text-red-500">{items.filter((item) => item.quantity <= 5).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Categories</h3>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <ItemCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />)
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-lg">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryDashboard;

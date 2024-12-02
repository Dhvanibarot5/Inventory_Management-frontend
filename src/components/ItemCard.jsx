import React from "react";

const ItemCard = ({ item, onEdit, onDelete }) => {
  const getStockStatus = (quantity) => {
    if (quantity <= 5) return { color: "red", text: "Critical" };
    if (quantity <= 10) return { color: "orange", text: "Low" };
    return { color: "green", text: "Good" };
  };

  const stockStatus = getStockStatus(item.quantity);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              stockStatus.color === "red"
                ? "bg-red-100 text-red-800"
                : stockStatus.color === "orange"
                ? "bg-orange-100 text-orange-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {stockStatus.text}
          </span>
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700">
              Edit
            </button>
            <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">
              Delete
            </button>
          </div>
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
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              stockStatus.color === "red" ? "bg-red-500" : stockStatus.color === "orange" ? "bg-orange-500" : "bg-green-500"
            }`}
            style={{ width: `${Math.min((item.quantity / 20) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

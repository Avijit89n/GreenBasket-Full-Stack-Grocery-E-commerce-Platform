import React from "react";
import { Truck, BadgeCheck, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const orders = [
  {
    id: "ORD-1001",
    date: "2025-07-21",
    status: "Delivered",
    total: 699.99,
    items: [
      {
        name: "Organic Almonds 500g",
        qty: 1,
        image: "https://source.unsplash.com/80x80/?almond,nuts",
      },
      {
        name: "Brown Bread",
        qty: 2,
        image: "https://source.unsplash.com/80x80/?bread",
      },
    ],
  },
  {
    id: "ORD-1002",
    date: "2025-07-23",
    status: "Pending",
    total: 349.0,
    items: [
      {
        name: "Cold Pressed Oil 1L",
        qty: 1,
        image: "https://source.unsplash.com/80x80/?oil,bottle",
      },
    ],
  },
  {
    id: "ORD-1003",
    date: "2025-07-18",
    status: "Cancelled",
    total: 120.0,
    items: [
      {
        name: "Paneer 200g",
        qty: 2,
        image: "https://source.unsplash.com/80x80/?paneer,cheese",
      },
    ],
  },
];

const statusStyles = {
  Delivered: {
    text: "text-green-600",
    bg: "bg-green-100",
    icon: <BadgeCheck className="w-4 h-4 mr-1" />,
  },
  Pending: {
    text: "text-yellow-800",
    bg: "bg-yellow-100",
    icon: <Clock className="w-4 h-4 mr-1" />,
  },
  Cancelled: {
    text: "text-red-600",
    bg: "bg-red-100",
    icon: <XCircle className="w-4 h-4 mr-1" />,
  },
};

const About = () => {
  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">My Orders</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Order #{order.id}</h4>
                  <p className="text-sm text-gray-500">Placed on {order.date}</p>
                </div>
                <div
                  className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}
                >
                  {statusStyles[order.status].icon}
                  {order.status}
                </div>
              </div>

              <div className="space-y-4 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg border"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <p className="font-semibold text-gray-800">Total: ₹{order.total.toFixed(2)}</p>
                {order.status === "Delivered" && (
                  <Button variant="default" size="sm">
                    <Truck className="w-4 h-4 mr-2" />
                    Reorder
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;

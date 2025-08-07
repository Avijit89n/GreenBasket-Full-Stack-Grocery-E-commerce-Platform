import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IndianRupee, CircleUser, ShoppingBag, ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    title: "Total Orders",
    icon: <ShoppingBag className="text-teal-600" size={20} />,
    value: 1240,
    change: 6,
    iconColor: "bg-teal-100",
  },
  {
    title: "Total Revenue",
    icon: <IndianRupee className="text-indigo-600" size={20} />,
    value: 352000,
    change: 12,
    iconColor: "bg-indigo-100",
  },
  {
    title: "Total Customers",
    icon: <CircleUser className="text-purple-600" size={20} />,
    value: 875,
    change: -4,
    iconColor: "bg-purple-100",
  },
];

function Dashboard() {
  return (
    <div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item, i) => (
          <Card key={i} className="rounded-2xl bg-white hover:shadow-xl transition-shadow shadow-md border border-gray-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500 mb-2">{item.title}</CardTitle>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {item.title === "Total Revenue" ? `₹${item.value.toLocaleString()}` : item.value.toLocaleString()}
                  </h3>
                  <Badge className={`${item.change > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {item.change > 0 ? <><ArrowUp />{"+"}</> : <><ArrowDown />{""}</>}{item.change}%
                  </Badge>
                </div>
                <div className={`p-3 rounded-full text-white ${item.iconColor}`}>{item.icon}</div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

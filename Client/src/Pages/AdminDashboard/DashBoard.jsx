import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  IndianRupee,
  ShoppingCart,
  Eye,
  Star,
  Zap,
  Target,
  Globe,
  Clock
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  PieChart,
  Area,
  Bar,
  Pie,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
  LineChart
} from "recharts";
import getHandler from "@/Services/Get.service";
import toast from "react-hot-toast";
import Loader2 from "@/components/Common/Loader2";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const initialMetrics = [
  {
    title: "Total Revenue",
    icon: <IndianRupee className="w-6 h-6" />,
    value: 0,
    prevValue: 0,
    prefix: "₹",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
  },
  {
    title: "Total Orders",
    icon: <ShoppingCart className="w-6 h-6" />,
    value: 0,
    prevValue: 0,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-gradient-to-r from-emerald-50 to-emerald-100",
  },
  {
    title: "New Customers",
    icon: <Users className="w-6 h-6" />,
    value: 0,
    prevValue: 0,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
  },
  {
    title: "Conversion Rate",
    icon: <Target className="w-6 h-6" />,
    value: 0,
    prevValue: 0,
    suffix: "%",
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-gradient-to-r from-orange-50 to-orange-100",
  },
];

const weeklyUsers = [
  { day: "Mon", users: 2400, orders: 180, bounce: 32 },
  { day: "Tue", users: 1398, orders: 120, bounce: 28 },
  { day: "Wed", users: 3200, orders: 240, bounce: 25 },
  { day: "Thu", users: 3908, orders: 295, bounce: 22 },
  { day: "Fri", users: 4800, orders: 380, bounce: 18 },
  { day: "Sat", users: 3800, orders: 285, bounce: 30 },
  { day: "Sun", users: 4300, orders: 320, bounce: 26 },
];

const categoryColors = [
  "#4E79A7", // blue
  "#F28E2B", // orange
  "#E15759", // red
  "#76B7B2", // teal
  "#59A14F", // green
  "#EDC949", // yellow
  "#AF7AA1", // purple
  "#FF9DA7", // pink
  "#9C755F", // brown
  "#BAB0AC", // gray
  "#1F77B4", // deep blue
  "#FF7F0E", // deep orange
  "#2CA02C", // deep green
  "#D62728", // deep red
  "#9467BD", // deep purple
  "#8C564B", // warm brown
  "#E377C2", // magenta
  "#7F7F7F", // medium gray
  "#BCBD22", // olive
  "#17BECF", // cyan
];




const hourlyTraffic = [
  { hour: '00', traffic: 145, sales: 12 },
  { hour: '01', traffic: 89, sales: 8 },
  { hour: '02', traffic: 67, sales: 5 },
  { hour: '03', traffic: 45, sales: 3 },
  { hour: '04', traffic: 52, sales: 4 },
  { hour: '05', traffic: 78, sales: 6 },
  { hour: '06', traffic: 125, sales: 15 },
  { hour: '07', traffic: 189, sales: 28 },
  { hour: '08', traffic: 245, sales: 35 },
  { hour: '09', traffic: 320, sales: 48 },
  { hour: '10', traffic: 385, sales: 62 },
  { hour: '11', traffic: 420, sales: 75 },
  { hour: '12', traffic: 445, sales: 82 },
  { hour: '13', traffic: 425, sales: 78 },
  { hour: '14', traffic: 395, sales: 65 },
  { hour: '15', traffic: 375, sales: 58 },
  { hour: '16', traffic: 355, sales: 52 },
  { hour: '17', traffic: 340, sales: 48 },
  { hour: '18', traffic: 320, sales: 45 },
  { hour: '19', traffic: 285, sales: 38 },
  { hour: '20', traffic: 245, sales: 32 },
  { hour: '21', traffic: 215, sales: 28 },
  { hour: '22', traffic: 185, sales: 22 },
  { hour: '23', traffic: 165, sales: 18 },
];

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}


const formatStatus = (status) => {
  switch (status) {
    case "Order Placed":
      return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">{status}</Badge>
    case "Order Received":
      return <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">{status}</Badge>
    case "Shipped":
      return <Badge className="bg-purple-100 text-purple-700 border border-purple-200">{status}</Badge>
    case "In Transit":
      return <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200">{status}</Badge>
    case "Out for Delivery":
      return <Badge className="bg-orange-100 text-orange-500 border border-orange-200">{status}</Badge>
    case "Delivered":
      return <Badge className="bg-green-100 text-green-700 border border-green-200">{status}</Badge>
    case "Cancelled":
      return <Badge className="bg-red-100 text-red-700 border border-red-200">{status}</Badge>
    default:
      return <Badge variant="outline" className="capitalize">{status}</Badge>
  }
};

export default function Dashboard() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [revenueData, setRevenueData] = useState([{
    orders: 0,
    revenue: 0,
    year: 0,
    month: ''
  }]);
  const [categoryData, setCategoryData] = useState([{
    value: 0,
    category: "",
  }])
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadMetrics = async () => {
    await getHandler('http://localhost:8000/api/data/data-sheet-revenue')
      .then(res => {
        setMetrics(prev => [
          {
            ...prev[0],
            value: res.data?.currentMonthRevenue || 0,
            prevValue: res.data?.lastMonthRevenue || 0,
          },
          {
            ...prev[1],
            value: res.data?.currentMonthOrder || 0,
            prevValue: res.data?.lastTotalOrder || 0,
          },
          {
            ...prev[2],
            value: res.data?.currentMonthUsers || 0,
            prevValue: res.data?.lastMonthOrder || 0,
          },
          {
            ...prev[3],
            value: res.data?.currentMonthCoversionRate || 0,
            prevValue: res.data?.lastMonthCoversionRate || 0,
          }
        ])
      })
      .catch(err => {
        toast.error("Failed to fetch metrics")
      })
  }

  const loadRevenueData = async () => {
    await getHandler('http://localhost:8000/api/data/data-sheet-revenue-profit-graph')
      .then(res => {
        setRevenueData(res.data)
      })
      .catch(err => {
        toast.error("Failed to fetch revenue data")
      })

  }

  const categorySales = async () => {
    await getHandler('http://localhost:8000/api/data/category-sales')
      .then(res => {
        setCategoryData(res.data)
      })
      .catch(err => {
        toast.error("Failed to fetch category data")
      })

  }

  const last24HourOrder = async () => {
    setLoading(true)
    await getHandler('http://localhost:8000/api/data/last-hour-order')
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        console.error(err)
        toast.error("Failed to fetch last 24 hour orders")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadMetrics()
    loadRevenueData()
    last24HourOrder()
    categorySales()
  }, [])

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(value);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.dataKey.includes('revenue') || entry.dataKey.includes('profit') || entry.dataKey.includes('cost') ? formatCurrency(entry.value) : formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const mobileMargins = { top: 20, right: 5, left: 5, bottom: 25 };
  const desktopMargins = { top: 20, right: 30, left: 20, bottom: 5 };

  return (
    <div className="min-h-screen p-2 font-sans">

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className='text-xl font-bold text-gray-700'>Analytics Dashboard</h1>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <div key={i}
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {metric.icon}
              </div>
              {metric.prevValue !== undefined && (
                <div className="bg-gray-100 text-xs text-gray-600 mb-2 px-2 py-1 rounded">
                  Last month:{" "}
                  {metric.suffix
                    ? `${metric.prevValue.toLocaleString()}${metric.suffix}`
                    : metric.prefix ? `${metric.prefix}${metric.prevValue.toLocaleString()}` : metric.prevValue.toLocaleString()}
                </div>
              )}
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {metric.suffix
                ? `${metric.value.toLocaleString()}${metric.suffix}`
                : metric.prefix ? `${metric.prefix}${metric.value.toLocaleString()}` : metric.value.toLocaleString()}
            </h3>

            <p className="text-sm font-medium text-gray-700 mb-1">{metric.title}</p>
            <p className="text-xs text-gray-500">
              (From {`1 ${new Date().toLocaleString("default", { month: "short" })}`} till now)
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        <div className="xl:col-span-2 bg-white/90 backdrop-blur-sm p-6 rounded-md shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Revenue & Profit Trends</h2>
              </div>
            </div>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={revenueData}
                margin={isMobile ? mobileMargins : desktopMargins}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12,
                    fontWeight: 500
                  }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={isMobile ? 10 : 20}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                />
                <YAxis
                  tick={{
                    fill: "#64748b",
                    fontSize: 12
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 10 : 50}
                  angle={isMobile ? -90 : 0}
                  textAnchor={isMobile ? "middle" : "end"}
                />
                <Tooltip content={<CustomTooltip />} />
                {!isMobile && <Legend />}
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366F1"
                  strokeWidth={isMobile ? 2 : 3}
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#F59E0B"
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{
                    r: isMobile ? 3 : 5,
                    fill: "#F59E0B",
                    stroke: "#fff",
                    strokeWidth: isMobile ? 1 : 2
                  }}
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-md shadow-lg border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Category Sales</h2>
            </div>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={isMobile ? { top: 5, right: 5, left: 5, bottom: 5 } : { top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? "60%" : "70%"}
                  innerRadius={isMobile ? "30%" : "40%"}
                  paddingAngle={5}
                  dataKey="sales"
                  nameKey="category"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}`, 'sales']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px'
                  }}
                />
                <Legend
                  layout="horizontal"
                  align="center"

                  wrapperStyle={{
                    fontSize: '10px',
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: "column"
                  }}
                  iconSize={isMobile ? 8 : 12}
                  formatter={(_, entry) => {
                    const percentage = ((entry.payload.sales / categoryData.reduce((sum, item) => sum + item.sales, 0)) * 100).toFixed(1); // 1 decimal
                    return `${capitalize(entry.payload.category)} (${percentage}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-md shadow-lg border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Weekly Traffic & Orders</h2>
            </div>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={weeklyUsers}
                margin={isMobile ? { top: 20, right: 5, left: 5, bottom: 20 } : { top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={isMobile ? 1 : 0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  minTickGap={isMobile ? 10 : 20}
                />
                <YAxis
                  tick={{
                    fill: "#64748b",
                    fontSize: 12
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 10 : 50}
                  angle={isMobile ? -90 : 0}
                  textAnchor={isMobile ? "middle" : "end"}
                />
                <Tooltip content={<CustomTooltip />} />
                {!isMobile && <Legend />}
                <Bar
                  dataKey="users"
                  fill="#6366F1"
                  radius={[4, 4, 0, 0]}
                  name="Visitors"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  strokeWidth={isMobile ? 2 : 3}
                  dot={{
                    r: isMobile ? 3 : 4,
                    fill: "#10B981",
                    stroke: "#fff",
                    strokeWidth: isMobile ? 1 : 2
                  }}
                  name="Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-md shadow-lg border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">24-Hour Traffic Pattern</h2>
            </div>
          </div>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={hourlyTraffic}
                margin={isMobile ? { top: 20, right: 5, left: 5, bottom: 20 } : { top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="hour"
                  tick={{
                    fill: "#64748b",
                    fontSize: 12
                  }}
                  axisLine={false}
                  tickLine={false}
                  interval={isMobile ? 2 : 1}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 50 : 30}
                  minTickGap={isMobile ? 10 : 20}
                />
                <YAxis
                  tick={{
                    fill: "#64748b",
                    fontSize: 12
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 10 : 50}
                  angle={isMobile ? -90 : 0}
                  textAnchor={isMobile ? "middle" : "end"}
                />
                <Tooltip content={<CustomTooltip />} />
                {!isMobile && <Legend />}
                <Area
                  type="monotone"
                  dataKey="traffic"
                  stroke="#F59E0B"
                  strokeWidth={isMobile ? 2 : 2}
                  fill="url(#trafficGradient)"
                  name="Traffic"
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#EF4444"
                  strokeWidth={isMobile ? 2 : 2}
                  dot={{
                    r: isMobile ? 2 : 3,
                    fill: "#EF4444"
                  }}
                  name="Sales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className='p-6 bg-white rounded-md shadow-lg'>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Orders in Last 24-hour</h2>
            </div>
          </div>
        </div>
        <Table className="min-w-full text-base">
          <TableHeader >
            <TableRow>
              <TableHead className="text-gray-600">Order ID</TableHead>
              <TableHead className="text-gray-600">Date</TableHead>
              <TableHead className="text-gray-600">Customer</TableHead>
              <TableHead className="text-gray-600">Total</TableHead>
              <TableHead className="text-gray-600">Payment</TableHead>
              <TableHead className="text-gray-600">Status</TableHead>
              <TableHead className="text-gray-600 w-[100px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length > 0 ? (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="text-blue-500">#{item._id}</TableCell>
                  <TableCell className="text-gray-600">{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-gray-700">{item?.userData?.fullName || "No Customer"}</TableCell>
                  <TableCell className="text-gray-700 font-semibold">₹{item.orderValue}</TableCell>
                  <TableCell className="text-gray-700"><Badge className={`${item?.paymentMethod !== "COD" ? "bg-green-100 text-green-500" : "bg-red-50 text-red-500"}`}>{item.paymentMethod}</Badge></TableCell>
                  <TableCell>{formatStatus(item.status)}</TableCell>
                  <TableCell className={"w-[100px] flex justify-center items-center text-gray-500"}>
                    <div className='flex items-center gap-2 m-2'>
                      <button onClick={() => navigate(`/admin/order-details/${item?._id}`)} className='flex justify-center items-center gap-2 text-sm p-2 rounded-md border border-gray-300'><Eye height={18} width={18} />View</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No orders found in last 24 hour
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {loading && <div className='w-full flex justify-center items-center p-4'><Loader2 height={8} width={8} /></div>}
      </div>

    </div>
  );
}
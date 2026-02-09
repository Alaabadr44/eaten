import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, TrendingUp, CheckCircle, Clock, AlertTriangle, XCircle, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface Booking {
  id: string;
  eventType: string;
  status: string;
  eventDate: string;
  eventCapacity: string;
}

const COLORS = ['#726658', '#afa394', '#d1c6b8', '#e5e5e5', '#544b42'];
const STATUS_COLORS = {
  CONFIRMED: '#22c55e', // green-500
  PENDING: '#eab308',   // yellow-500
  CANCELLED: '#ef4444', // red-500
  CONTACTED: '#3b82f6', // blue-500
};

const ManageReports = () => {
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "/api";
        // Fetch all bookings (limit 1000 for report accuracy)
        const res = await fetch(`${API_URL}/bookings?limit=1000`);
        const data = await res.json();
        setBookings(data.data.items || []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const stats = useMemo(() => {
    if (bookings.length === 0) return null;

    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
    const pending = bookings.filter(b => b.status === 'PENDING').length;
    const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;
    const contacted = bookings.filter(b => b.status === 'CONTACTED').length;

    const completionRate = Math.round((confirmed / total) * 100);

    // Group by Status for Pie Chart
    const statusData = [
      { name: 'Confirmed', value: confirmed, color: STATUS_COLORS.CONFIRMED },
      { name: 'Pending', value: pending, color: STATUS_COLORS.PENDING },
      { name: 'Cancelled', value: cancelled, color: STATUS_COLORS.CANCELLED },
      { name: 'Contacted', value: contacted, color: STATUS_COLORS.CONTACTED },
    ].filter(item => item.value > 0);

    // Group by Event Type for Pie Chart
    const eventTypeDataMap = bookings.reduce((acc, curr) => {
      acc[curr.eventType] = (acc[curr.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const eventTypeData = Object.entries(eventTypeDataMap).map(([name, value], index) => ({
      name: name.replace(/_/g, " ").toLowerCase(),
      value,
      color: COLORS[index % COLORS.length]
    }));

     // Group by Capacity for Stats
    const capacityDataMap = bookings.reduce((acc, curr) => {
       acc[curr.eventCapacity] = (acc[curr.eventCapacity] || 0) + 1;
       return acc;
    }, {} as Record<string, number>);

    const capacityData = Object.entries(capacityDataMap).map(([name, value]) => ({
        name: name.replace(/_/g, " ").toLowerCase().replace("than", ""),
        value,
        percentage: Math.round((value / total) * 100)
    })).sort((a,b) => b.value - a.value);


    return {
      total,
      confirmed,
      pending,
      cancelled,
      completionRate,
      statusData,
      eventTypeData,
      capacityData
    };
  }, [bookings]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-eaten-charcoal" />
      </div>
    );
  }

  if (!stats) return <div className="text-center py-10">{t('reports.noData')}</div>;

  return (
    <div className="space-y-8 p-6 print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-heading font-bold text-eaten-charcoal">{t('reports.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('reports.generatedOn')} {format(new Date(), "MMMM do, yyyy")}
          </p>
        </div>
        <Button onClick={handlePrint} className="bg-eaten-dark hover:bg-eaten-charcoal text-white gap-2">
          <Download className="w-4 h-4" /> {t('reports.exportPdf')}
        </Button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 text-center">
         <h1 className="text-2xl font-bold mb-2">{t('reports.printTitle')}</h1>
         <p className="text-sm text-gray-500">{t('reports.generatedOn')} {format(new Date(), "PPP p")}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-l-4 border-l-eaten-dark shadow-sm">
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.totalBookings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-eaten-charcoal">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-green-500 shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">{t('reports.completionRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{t('reports.confirmedVsRequests')}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-l-4 border-l-yellow-500 shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">{t('reports.pendingActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('reports.requireAttention')}</p>
          </CardContent>
        </Card>
         <Card className="bg-white border-l-4 border-l-red-500 shadow-sm">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-gray-500">{t('reports.cancelled')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((stats.cancelled / stats.total) * 100)}% {t('reports.cancellationRate')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-8">
        
        {/* Status Distribution */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-eaten-charcoal" />
              {t('reports.bookingStatusDist')}
            </CardTitle>
            <CardDescription>{t('reports.breakdownStatus')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] print:h-[250px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => [`${value} bookings`, 'Count']}
                   wrapperStyle={{ outline: 'none' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Type Distribution */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-eaten-charcoal" />
               {t('reports.eventTypeAnalysis')}
            </CardTitle>
            <CardDescription>{t('reports.mostRequestedTypes')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] print:h-[250px]" dir="ltr">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.eventTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {stats.eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                 <Tooltip />
                 <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

       {/* Detailed Breakdown Table */}
      <Card className="print:shadow-none">
        <CardHeader>
            <CardTitle>{t('reports.capacityPreferences')}</CardTitle>
             <CardDescription>{t('reports.popularSizes')}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {stats.capacityData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-eaten-beige flex items-center justify-center font-bold text-eaten-charcoal">
                                {i + 1}
                            </div>
                            <span className="capitalize font-medium text-eaten-charcoal">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" dir="ltr">
                                <div className="h-full bg-eaten-dark" style={{ width: `${item.percentage}%` }} />
                             </div>
                             <span className="font-bold w-12 text-right">{item.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default ManageReports;

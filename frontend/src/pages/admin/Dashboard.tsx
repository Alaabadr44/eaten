import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Loader2, TrendingUp, Users, MapPin, CalendarDays } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from "react-i18next";

interface Booking {
  id: string;
  eventDate: string;
  eventType: string;
  eventCapacity: number;
  status: string;
  zone?: { name: string };
}

const CAPACITY_MAP: Record<number, string> = {
  1: "Less than 5 people",
  2: "5-20 people",
  3: "More than 20 people",
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "/api";
        const res = await fetch(`${API_URL}/bookings?limit=100`);
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

  // Statistics Calculations
  const stats = useMemo(() => {
    if (bookings.length === 0) return null;

    const getMostFrequent = (arr: (string | number)[]) => {
      if (arr.length === 0) return "N/A";
      const hashmap = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string | number, number>);
      return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b);
    };

    const mostRequestedService = getMostFrequent(bookings.map(b => b.eventType));
    const mostPopularCapacity = getMostFrequent(bookings.map(b => b.eventCapacity));
    const mostPopularZone = getMostFrequent(bookings.map(b => b.zone?.name || "Unknown"));

    // Monthly Bookings
    const monthlyDataMap = bookings.reduce((acc, booking) => {
      const month = format(parseISO(booking.eventDate), "MMM yyyy");
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyChartData = Object.entries(monthlyDataMap).map(([name, count]) => ({
      name,
      bookings: count
    })).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    return {
      mostRequestedService,
      mostPopularCapacity,
      mostPopularZone,
      monthlyChartData
    };
  }, [bookings]);

  // Get bookings for selected date
  const selectedDateBookings = bookings.filter((booking) => 
    date && new Date(booking.eventDate).toDateString() === date.toDateString()
  );

  // Get dates that have bookings for highlighting
  const bookedDates = bookings.map((b) => new Date(b.eventDate));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-eaten-charcoal">{t('dashboard.title')}</h1>
      
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-500">{t('dashboard.totalBookings')}</h3>
          <p className="text-4xl font-bold text-eaten-dark mt-2">
            {loading ? <Loader2 className="animate-spin" /> : bookings.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-500">{t('dashboard.pendingRequests')}</h3>
          <p className="text-4xl font-bold text-yellow-600 mt-2">
            {loading ? <Loader2 className="animate-spin" /> : bookings.filter(b => b.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-500">{t('dashboard.confirmedEvents')}</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {loading ? <Loader2 className="animate-spin" /> : bookings.filter(b => b.status === 'CONFIRMED').length}
          </p>
        </div>
      </div>

      {/* Insights Section */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-eaten-beige/20 border-eaten-beige">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-eaten-charcoal flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> {t('dashboard.mostPopularService')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eaten-dark capitalize">{stats.mostRequestedService.replace(/_/g, " ").toLowerCase()}</div>
            </CardContent>
          </Card>
          <Card className="bg-eaten-beige/20 border-eaten-beige">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-eaten-charcoal flex items-center gap-2">
                 <Users className="h-4 w-4" /> {t('dashboard.capacityChoice')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eaten-dark capitalize">{CAPACITY_MAP[stats.mostPopularCapacity as unknown as number] || stats.mostPopularCapacity}</div>
            </CardContent>
          </Card>
          <Card className="bg-eaten-beige/20 border-eaten-beige">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-eaten-charcoal flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {t('dashboard.topZone')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eaten-dark">{stats.mostPopularZone}</div>
            </CardContent>
          </Card>
           <Card className="bg-eaten-beige/20 border-eaten-beige">
             <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-eaten-charcoal flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> {t('dashboard.busiestMonth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-eaten-dark">
                {stats.monthlyChartData.length > 0 
                  ? stats.monthlyChartData.reduce((a, b) => a.bookings > b.bookings ? a : b).name 
                  : "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.monthlyTrend')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full" dir="ltr">
              {loading ? (
                <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: 'var(--eaten-white)', borderRadius: '8px', border: '1px solid var(--border)' }}
                    />
                    <Bar dataKey="bookings" fill="var(--eaten-dark)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.eventCalendar')}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center" dir="ltr">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  booked: bookedDates,
                }}
                modifiersClassNames={{
                  booked: "bg-eaten-beige/60 font-bold text-eaten-charcoal underline decoration-dotted decoration-eaten-dark/50"
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t('dashboard.eventsFor')} {date ? format(date, "MMM do") : t('dashboard.selectedDate')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedDateBookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4 text-sm">{t('dashboard.noEvents')}</p>
                ) : (
                  selectedDateBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-sm">{booking.eventType}</p>
                        <p className="text-xs text-gray-500">{booking.zone?.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
  

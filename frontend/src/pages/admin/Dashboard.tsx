import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface Booking {
  id: string;
  eventDate: string;
  eventType: string;
  status: string;
  zone?: { name: string };
}

const Dashboard = () => {
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

  // Get bookings for selected date
  const selectedDateBookings = bookings.filter((booking) => 
    date && new Date(booking.eventDate).toDateString() === date.toDateString()
  );

  // Get dates that have bookings for highlighting
  const bookedDates = bookings.map((b) => new Date(b.eventDate));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-eaten-charcoal">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-500">Total Bookings</h3>
          <p className="text-4xl font-bold text-eaten-dark mt-2">
            {loading ? <Loader2 className="animate-spin" /> : bookings.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-500">Pending Requests</h3>
          <p className="text-4xl font-bold text-yellow-600 mt-2">
            {loading ? <Loader2 className="animate-spin" /> : bookings.filter(b => b.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h3 className="text-lg font-medium text-gray-500">Confirmed Events</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {loading ? <Loader2 className="animate-spin" /> : bookings.filter(b => b.status === 'CONFIRMED').length}
          </p>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
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
              Events for {date ? format(date, "MMMM do, yyyy") : "Selected Date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No events scheduled for this day.</p>
              ) : (
                selectedDateBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{booking.eventType}</p>
                      <p className="text-sm text-gray-500">{booking.zone?.name || "No Zone"}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
  );
};

export default Dashboard;
  

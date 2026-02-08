import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { X } from "lucide-react";

interface Booking {
  id: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  status: string;
  zone: { name: string } | null;
  locationUrl?: string;
  description?: string;
  createdAt: string;
}

const BookingsManager = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/bookings?limit=100`); // Fetch more for now or implement pagination UI
      const responseData = await res.json();
      const bookingsData = responseData.data.items || [];
      // Sort: PENDING first, then by date descending
      const sorted = bookingsData.sort((a: Booking, b: Booking) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
      });
      setBookings(sorted);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to fetch bookings" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast({ title: "Status Updated" });
        fetchBookings();
      } else {
        toast({ variant: "destructive", title: "Update failed" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-500 hover:bg-green-600";
      case "PENDING": return "bg-yellow-500 hover:bg-yellow-600";
      case "CANCELLED": return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Status Filter
      if (statusFilter !== "ALL" && booking.status !== statusFilter) {
        return false;
      }

      // Date Filter
      const bookingDate = new Date(booking.eventDate).setHours(0, 0, 0, 0);
      if (startDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        if (bookingDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate).setHours(0, 0, 0, 0);
        if (bookingDate > end) return false;
      }

      return true;
    });
  }, [bookings, statusFilter, startDate, endDate]);

  const clearFilters = () => {
    setStatusFilter("ALL");
    setStartDate("");
    setEndDate("");
  };

  const pendingBookings = filteredBookings.filter(b => b.status === "PENDING");
  const otherBookings = filteredBookings.filter(b => b.status !== "PENDING");

  const BookingTable = ({ data }: { data: Booking[] }) => (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24 text-gray-500">
                No bookings found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="font-medium">
                    {format(new Date(booking.eventDate), "MMM dd, yyyy")}
                  </div>
                  <div className="text-sm text-gray-500">{booking.eventTime}</div>
                </TableCell>
                <TableCell>{booking.eventType}</TableCell>
                <TableCell>{booking.zone?.name || "N/A"}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {booking.description || "No description"}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(booking.status)}`}>
                      {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    defaultValue={booking.status}
                    onValueChange={(val) => updateStatus(booking.id, val)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="CONTACTED">CONTACTED</SelectItem>
                      <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-heading font-bold text-eaten-charcoal">
          Bookings
        </h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px] bg-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="w-full sm:w-auto bg-white"
            placeholder="Start Date"
          />
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="w-full sm:w-auto bg-white"
             placeholder="End Date"
          />
          
          {(statusFilter !== "ALL" || startDate || endDate) && (
            <Button variant="ghost" size="icon" onClick={clearFilters} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {loading ? (
         <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {/* Pending Bookings Section */}
          {(statusFilter === "ALL" || statusFilter === "PENDING") && pendingBookings.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-heading font-semibold text-yellow-600 flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                 Pending Requests ({pendingBookings.length})
              </h2>
              <div className="border-2 border-yellow-200 rounded-lg overflow-hidden shadow-sm">
                 <BookingTable data={pendingBookings} />
              </div>
            </div>
          )}

          {/* Other Bookings Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-heading font-semibold text-eaten-charcoal">
              Booking History ({otherBookings.length})
            </h2>
            <BookingTable data={otherBookings} />
          </div>
        </>
      )}
    </div>
  );
};

export default BookingsManager;

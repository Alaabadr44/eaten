import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ScrollText, ChevronLeft, ChevronRight } from "lucide-react";
import { systemLogService } from "../../services/systemLogService";
import { format } from "date-fns";

interface SystemLog {
  id: string;
  adminId: string;
  action: string;
  targetEntity?: string;
  targetId?: string;
  details: string;
  createdAt: string;
}

const SystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const { toast } = useToast();

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await systemLogService.findAll(page, limit);
      setLogs(data.data);
      setTotal(data.total);
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to fetch logs" });
    } finally {
      setLoading(false);
    }
  }, [page, toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-eaten-charcoal flex items-center gap-2">
          <ScrollText className="w-8 h-8" /> System Logs
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="w-1/3">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
                 <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  No logs found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                    {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.adminId || "System"}</TableCell>
                  <TableCell className="font-medium text-eaten-dark">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                        {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">
                      {log.targetEntity && (
                          <div className="flex flex-col">
                              <span className="font-semibold">{log.targetEntity}</span>
                              <span className="text-gray-400 font-mono">{log.targetId}</span>
                          </div>
                      )}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-gray-600 truncate max-w-md" title={log.details}>
                      {log.details.substring(0, 100)}{log.details.length > 100 ? '...' : ''}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50">
            <div className="text-xs text-gray-500">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs font-medium">Page {page} of {totalPages || 1}</span>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || loading}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;

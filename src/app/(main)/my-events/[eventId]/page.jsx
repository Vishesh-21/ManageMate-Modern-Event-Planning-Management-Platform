"use client";

import { useConvexQuery } from "@/hooks/useConvexQuery";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { useConvexMutation } from "@/hooks/useConvexMutation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getCategoryIconById, getCategoryLabelById } from "@/lib/data";
import { Calendar } from "lucide-react";
import { MapPin } from "lucide-react";
import { Eye } from "lucide-react";
import { Trash2 } from "lucide-react";
import { QrCode } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { AttendeeCard } from "../_components/attendee-card";
import QRScannerModal from "../_components/qr-scanner-model";
import { format } from "date-fns/format";
import DashboardStats from "../_components/dashboard-stats";
import { handleExportCSV } from "@/lib/helper";

export default function EventDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Fetch event dashboard data
  const { data: dashboardData, loading: isLoading } = useConvexQuery(
    api.dashboard.getEventDashboard,
    { eventId }
  );

  // Fetch registrations
  const { data: registrations, loading: loadingRegistrations } = useConvexQuery(
    api.registration.getEventRegistrations,
    { eventId }
  );

  // Delete event mutation
  const { mutate: deleteEvent, loading: isDeleting } = useConvexMutation(
    api.events.deleteEventById,
    { eventId }
  );

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations."
    );

    if (!confirmed) return;

    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted successfully");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  if (isLoading || loadingRegistrations || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!dashboardData) {
    notFound();
  }

  const { event, stats } = dashboardData;

  // Filter registrations based on active tab and search
  const filteredRegistrations = registrations?.filter((reg) => {
    const matchesSearch =
      reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.qrCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch && reg.status === "confirmed";
    if (activeTab === "checked-in")
      return matchesSearch && reg.checkedIn && reg.status === "confirmed";
    if (activeTab === "pending")
      return matchesSearch && !reg.checkedIn && reg.status === "confirmed";

    return matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/my-events")}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Events
          </Button>
        </div>

        {event.coverImage && (
          <div className="relative h-[350px] rounded-2xl overflow-hidden mb-6">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Event Header */}
        <div className="flex flex-col gap-5 sm:flex-row items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">
                {getCategoryIconById(event.category)}{" "}
                {getCategoryLabelById(event.category)}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(event.startDate, "PPP")}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {event.locationType === "online"
                    ? "Online"
                    : `${event.city}, ${event.state || event.country}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/events/${event.slug}`)}
              className="gap-2 flex-1"
            >
              <Eye className="w-4 h-4" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-600 gap-2 flex-1"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Quick Actions - Show QR Scanner if event is today */}
        {stats.isEventToday && !stats.isEventPast && (
          <Button
            size="lg"
            // variant="outline"
            className="mb-8 w-full gap-2 h-10 bg-linear-to-r from-orange-500 via-pink-500 to-red-500 text-white hover:scale-[1.02]"
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="w-6 h-6" />
            Scan QR Code to Check-In
          </Button>
        )}

        <DashboardStats stats={stats} event={event} />

        {/* Attendee Management */}
        <h2 className="text-2xl font-bold mb-4">Attendee Management</h2>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All ({stats.totalRegistrations})
            </TabsTrigger>
            <TabsTrigger value="checked-in">
              Checked In ({stats.checkedInCount})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({stats.pendingCount})
            </TabsTrigger>
          </TabsList>

          {/* Search and Actions */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or QR code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => handleExportCSV(registrations, dashboardData)}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Attendee List */}
          <TabsContent value={activeTab} className="space-y-3 mt-0">
            {filteredRegistrations && filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((registration) => (
                <AttendeeCard
                  key={registration._id}
                  registration={registration}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No attendees found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}

import { Users, CheckCircle, TrendingUp, Clock } from "lucide-react";
import StatCard from "./stats-card";

export default function DashboardStats({ stats, event }) {
  const timeLeft = stats.isEventPast
    ? "Ended"
    : stats.hoursUntilEvent > 24
    ? `${Math.floor(stats.hoursUntilEvent / 24)}d`
    : `${stats.hoursUntilEvent}h`;

  const cards = [
    {
      icon: <Users />,
      bg: "bg-purple-100",
      textColor: "text-purple-600",
      value: `${stats.totalRegistrations}/${stats.capacity}`,
      label: "Capacity",
    },
    {
      icon: <CheckCircle />,
      bg: "bg-green-100",
      textColor: "text-green-600",
      value: stats.checkedInCount,
      label: "Checked In",
    },
    {
      icon: <TrendingUp />,
      bg: event.ticketType === "paid" ? "bg-blue-100" : "bg-orange-100",
      textColor:
        event.ticketType === "paid" ? "text-blue-600" : "text-orange-600",
      value:
        event.ticketType === "paid"
          ? `₹${stats.totalRevenue}`
          : `${stats.checkInRate}%`,
      label: event.ticketType === "paid" ? "Revenue" : "Check-in Rate",
    },
    {
      icon: <Clock />,
      bg: "bg-amber-100",
      textColor: "text-amber-600",
      value: timeLeft,
      label: stats.isEventPast ? "Event Over" : "Time Left",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

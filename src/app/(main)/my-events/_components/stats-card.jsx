// components/StatCard.jsx
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function StatCard({ icon, bg, textColor, value, label }) {
  return (
    <Card className="py-0">
      <CardContent className="p-6 flex items-center gap-3">
        <div className={`p-3 ${bg} rounded-lg`}>
          {React.cloneElement(icon, { className: `w-6 h-6 ${textColor}` })}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

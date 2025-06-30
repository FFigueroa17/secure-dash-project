'use client';

import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ActivityTrendChart } from './_components/stats/activity-trend-chart';
import { AlertsToast } from './_components/stats/alerts-toast';
import { AvgDetectionKpi } from './_components/stats/avg-detection-kpi';
import { BanUnbanChart } from './_components/stats/ban-unban-chart';
import { TopIPsTable } from './_components/stats/top-ips-table';
import { RealtimeStats } from './_lib/types';

// Simulated data structure from the user
const initialSimulatedData: RealtimeStats = {
  t: new Date().toISOString(),
  banRate: 4,
  unbanRate: 1,
  topIPs: [
    { ip: '203.0.113.5', bans: 12 },
    { ip: '198.51.100.10', bans: 8 },
    { ip: '203.0.113.15', bans: 5 },
    { ip: '198.51.100.20', bans: 3 },
    { ip: '203.0.113.25', bans: 2 },
  ],
  avgDetectToBan: 2.6,
  trend: [
    { t: Math.floor(Date.now() / 1000) - 60, events: 8 },
    { t: Math.floor(Date.now() / 1000), events: 11 },
  ],
  alerts: [{ ip: '203.0.113.5', bansLastHour: 7 }],
};

export default function RealtimeLogsPage() {
  const [stats, setStats] = useState<RealtimeStats>(initialSimulatedData);
  const [banUnbanHistory, setBanUnbanHistory] = useState<
    Array<{ time: string; banRate: number; unbanRate: number }>
  >([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStats((prevStats) => {
        const newTime = new Date();
        const newTrendPoint = {
          t: Math.floor(newTime.getTime() / 1000),
          events: Math.floor(Math.random() * 15) + 5, // Random events between 5 and 20
        };
        const newAlerts: typeof initialSimulatedData.alerts = [];
        if (Math.random() < 0.2) {
          // 20% chance of new alert
          newAlerts.push({
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            bansLastHour: Math.floor(Math.random() * 10) + 1,
          });
        }

        return {
          ...prevStats,
          t: newTime.toISOString(),
          banRate: Math.floor(Math.random() * 10),
          unbanRate: Math.floor(Math.random() * 5),
          avgDetectToBan: parseFloat((Math.random() * 5).toFixed(1)),
          trend: [...prevStats.trend.slice(-9), newTrendPoint], // Keep last 10 points
          topIPs: prevStats.topIPs
            .map((ip) => ({
              ...ip,
              bans: ip.bans + Math.floor(Math.random() * 3),
            }))
            .sort((a, b) => b.bans - a.bans)
            .slice(0, 5),
          alerts: newAlerts,
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setBanUnbanHistory((prevHistory) => {
      const newEntry = {
        time: new Date(stats.t).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        banRate: stats.banRate,
        unbanRate: stats.unbanRate,
      };
      return [...prevHistory.slice(-9), newEntry]; // Keep last 10 entries
    });
  }, [stats.t, stats.banRate, stats.unbanRate]);

  const lastUpdateTime = new Date(stats.t).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 py-4 lg:py-6">
      <AlertsToast alerts={stats.alerts} />

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Real-time Security Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor security events and threats in real-time
          </p>
        </div>

        <div className="w-fit rounded-2xl bg-muted/20 border border-border/30 flex flex-row items-center justify-center gap-4 p-3">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            Última actualización: {lastUpdateTime}
          </div>
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
        <div className="md:col-span-2">
          <BanUnbanChart data={banUnbanHistory} />
        </div>
        <AvgDetectionKpi value={stats.avgDetectToBan} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
        <TopIPsTable data={stats.topIPs} />
        <ActivityTrendChart data={stats.trend} />
      </div>
    </div>
  );
}

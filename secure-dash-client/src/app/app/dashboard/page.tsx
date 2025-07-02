'use client';

import { Activity, BarChart3, Shield, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useDashboardWebSocket } from '@/hooks/use-dashboard-websocket';
import {
  useActivityTrendData,
  useAlertsData,
  useAvgDetectionData,
  useBanUnbanData,
  useConnectionStatus,
  useTopIPsData,
} from '@/lib/store/dashboard-store';

import { ConnectionStatusIndicator } from './_components/connection-status';
import { ActivityTrendChart } from './_components/stats/activity-trend-chart';
import { AlertsToast } from './_components/stats/alerts-toast';
import { BanUnbanChart } from './_components/stats/ban-unban-chart';
import { EmptyStateIndicator } from './_components/stats/empty-state-indicator';
import { TopIPsTable } from './_components/stats/top-ips-table';

export default function RealtimeLogsPage() {
  // Initialize WebSocket connection
  const { reconnect } = useDashboardWebSocket({
    url:
      process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/fail2ban-logs',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  // Get data from Zustand store
  const connectionStatus = useConnectionStatus();
  const banUnbanData = useBanUnbanData();
  const topIPsData = useTopIPsData();
  const activityTrendData = useActivityTrendData();
  const avgDetectionData = useAvgDetectionData();
  const alertsData = useAlertsData();

  // Keep track of previous avg detection time for trend analysis
  const [previousAvgDetection, setPreviousAvgDetection] = useState<
    number | undefined
  >();

  // Update previous value when new data arrives (only when significant change)
  if (Math.abs((previousAvgDetection || 0) - avgDetectionData.value) > 1) {
    setPreviousAvgDetection(avgDetectionData.value);
  }

  // Determine loading and data states for each chart
  const isLoadingBanChart =
    connectionStatus.isConnecting && banUnbanData.data.length === 0;
  const isLoadingTopIPs =
    connectionStatus.isConnecting && topIPsData.data.length === 0;
  const isLoadingActivity =
    connectionStatus.isConnecting && activityTrendData.data.length === 0;

  const hasNoBanData =
    connectionStatus.isConnected && banUnbanData.data.length === 0;
  const hasNoTopIPsData =
    connectionStatus.isConnected && topIPsData.data.length === 0;
  const hasNoActivityData =
    connectionStatus.isConnected && activityTrendData.data.length === 0;

  // Animation variants for smooth transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent py-4 lg:py-6">
      <AlertsToast alerts={alertsData.alerts} />

      <motion.div
        className="flex-1 min-h-0 flex flex-col space-y-4 lg:space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page header with connection status */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2"
          variants={itemVariants}
        >
          {/* Page title and description */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard de Seguridad
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitoreo de seguridad en tiempo real con Fail2Ban
            </p>
          </div>

          <div className="flex-shrink-0">
            {/* Connection status indicator */}
            <ConnectionStatusIndicator
              status={
                connectionStatus.isConnected
                  ? 'connected'
                  : connectionStatus.isConnecting
                    ? 'connecting'
                    : 'error'
              }
              error={connectionStatus.error}
              lastUpdate={connectionStatus.lastUpdate}
              onReconnect={reconnect}
            />
          </div>
        </motion.div>

        {/* Connection error state */}
        <AnimatePresence>
          {connectionStatus.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-destructive">
                        Error de conexión
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {connectionStatus.error ||
                          'Verifica tu conexión e intenta nuevamente'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content grid - Better spacing and responsive layout */}
        <motion.div
          className="space-y-4 flex-1 min-h-0"
          variants={itemVariants}
        >
          {/* Primary metrics row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 h-[300px] lg:h-[430px]">
            <motion.div
              className="lg:col-span-2 h-full"
              variants={itemVariants}
              key={`ban-chart-${banUnbanData.data.length}-${connectionStatus.isConnecting}`}
            >
              <AnimatePresence mode="wait">
                {isLoadingBanChart ? (
                  <EmptyStateIndicator
                    icon={BarChart3}
                    title="Cargando datos de bloqueos"
                    description="Conectando con el sistema de monitoreo para obtener estadísticas de fail2ban en tiempo real"
                    isLoading={true}
                    className="h-full"
                  />
                ) : hasNoBanData ? (
                  <EmptyStateIndicator
                    icon={BarChart3}
                    title="Sin actividad de bloqueos"
                    description="No se han detectado intentos de bloqueo recientes. El sistema está monitoreando continuamente."
                    isLoading={false}
                    className="h-full"
                  />
                ) : (
                  <BanUnbanChart
                    data={banUnbanData.data}
                    avgDetectionTime={avgDetectionData.value}
                    previousDetectionTime={previousAvgDetection}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={itemVariants}
              key={`top-ips-${topIPsData.data.length}-${connectionStatus.isConnecting}`}
              className="h-full"
            >
              <AnimatePresence mode="wait">
                {isLoadingTopIPs ? (
                  <EmptyStateIndicator
                    icon={Shield}
                    title="Cargando IPs bloqueadas"
                    description="Obteniendo información sobre las direcciones IP más activas y bloqueadas"
                    isLoading={true}
                    className="h-full"
                  />
                ) : hasNoTopIPsData ? (
                  <EmptyStateIndicator
                    icon={Shield}
                    title="Sin IPs bloqueadas"
                    description="No hay direcciones IP bloqueadas actualmente. El sistema está protegido y funcionando correctamente."
                    isLoading={false}
                    className="h-full"
                  />
                ) : (
                  <TopIPsTable data={topIPsData.data} />
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Secondary metrics row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[300px] lg:h-[430px]">
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3 h-full"
              key={`activity-${activityTrendData.data.length}-${connectionStatus.isConnecting}`}
            >
              <AnimatePresence mode="wait">
                {isLoadingActivity ? (
                  <EmptyStateIndicator
                    icon={Activity}
                    title="Cargando actividad de eventos"
                    description="Recopilando datos de tendencias de actividad y eventos del sistema de seguridad"
                    isLoading={true}
                    className="h-full"
                  />
                ) : hasNoActivityData ? (
                  <EmptyStateIndicator
                    icon={Activity}
                    title="Sin actividad registrada"
                    description="No se ha detectado actividad reciente. El sistema está funcionando correctamente y esperando eventos."
                    isLoading={false}
                    className="h-full"
                  />
                ) : (
                  <ActivityTrendChart data={activityTrendData.data} />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

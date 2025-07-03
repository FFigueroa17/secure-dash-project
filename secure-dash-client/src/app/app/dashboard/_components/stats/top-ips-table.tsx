'use client';

import { Copy, ExternalLink, Shield } from 'lucide-react';
import { motion } from 'motion/react';

import { TopIP } from '@/app/app/dashboard/_lib/types';
import { ActionButton } from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, copyToClipboard, getRiskColor, openIPDetails } from '@/lib/utils';

interface TopIPsTableProps {
  data: TopIP[];
}

export function TopIPsTable({ data }: TopIPsTableProps) {
  const sortedData = [...data].sort((a, b) => b.bans - a.bans).slice(0, 5);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="shadow-sm h-[430px] overflow-hidden">
        <CardHeader className="space-y-0">
          <div className="flex items-center gap-2">
            <motion.div
              className="p-1.5 rounded-md bg-primary/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Shield className="h-4 w-4 text-primary" />
            </motion.div>
            <CardTitle className="text-base font-medium">
              Top IPs bloqueadas
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {sortedData.length === 0 ? (
            <motion.div
              className="text-center py-12 text-sm text-muted-foreground"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Shield className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>No hay IPs bloqueadas</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {sortedData.map((item, index) => (
                <motion.div
                  key={item.ip}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 hover:shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3 + index * 0.1,
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-sm bg-muted flex items-center justify-center text-xs font-medium transition-colors hover:bg-muted-foreground/10">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-mono text-sm font-medium select-all">
                        {item.ip}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs px-3 py-1.5 font-medium',
                        getRiskColor(item.bans),
                      )}
                    >
                      {item.bans} intentos
                    </Badge>
                    <div className="flex items-center gap-1">
                      <ActionButton
                        icon={Copy}
                        onAction={() => copyToClipboard(item.ip)}
                        tooltipMessage="Copiar IP"
                        iconSize={12}
                      />
                      <ActionButton
                        icon={ExternalLink}
                        onAction={() => openIPDetails(item.ip)}
                        tooltipMessage="Ver Geolocalización"
                        iconSize={12}
                        showSuccessAnimation={false}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

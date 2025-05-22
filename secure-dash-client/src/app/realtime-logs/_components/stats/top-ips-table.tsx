'use client';

import { Shield, ShieldAlert } from 'lucide-react';

import { TopIP } from '@/app/realtime-logs/_lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TopIPsTableProps {
  data: TopIP[];
}

export function TopIPsTable({ data }: TopIPsTableProps) {
  // Sort data by bans in descending order
  const sortedData = [...data].sort((a, b) => b.bans - a.bans).slice(0, 5);

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Top 5 Blocked IPs
            </CardTitle>
            <CardDescription>IP addresses with the most bans</CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/20 py-1"
          >
            <ShieldAlert className="mr-1.5 h-3.5 w-3.5" />
            High Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Bans</TableHead>
              <TableHead className="text-right">Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((ipData) => {
              // Determine risk level based on bans
              const riskLevel =
                ipData.bans > 10 ? 'High' : ipData.bans > 5 ? 'Medium' : 'Low';

              // Risk level colors based on design system
              const getRiskColor = (level: string) => {
                switch (level) {
                  case 'High':
                    return 'var(--destructive)';
                  case 'Medium':
                    return 'var(--chart-4)';
                  case 'Low':
                    return 'var(--primary)';
                  default:
                    return 'var(--primary)';
                }
              };

              const riskColor = getRiskColor(riskLevel);

              return (
                <TableRow
                  key={ipData.ip}
                  className="group transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-mono group-hover:text-primary transition-colors">
                    {ipData.ip}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center justify-center min-w-8 py-0.5 px-2 rounded-full bg-muted font-medium text-sm transition-transform hover:scale-105">
                      {ipData.bans}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs inline-block"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${riskColor} 15%, transparent)`,
                        color: riskColor,
                        border: `1px solid ${riskColor}40`,
                      }}
                    >
                      {riskLevel}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

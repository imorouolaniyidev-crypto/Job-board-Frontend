'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatisticsCardProps {
  label: string;
  value: number;
  trend?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'orange';
}

const colorClasses = {
  blue: {
    bg: 'bg-[rgb(18,51,119)]/10',
    icon: 'text-[rgb(18,51,119)]',
    text: 'text-[rgb(18,51,119)]',
  },
  orange: {
    bg: 'bg-[rgb(249,153,28)]/15',
    icon: 'text-[rgb(249,153,28)]',
    text: 'text-[rgb(249,153,28)]',
  },
};

export default function StatisticsCard({
  label,
  value,
  trend,
  icon,
  color = 'blue',
}: StatisticsCardProps) {
  const colors = colorClasses[color];
  const isTrendPositive = trend !== undefined && trend >= 0;

  return (
    <Card className="border-[rgb(18,51,119)]/15 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-2 text-sm text-[rgb(18,51,119)]/75">{label}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold text-[rgb(18,51,119)]">
              {value.toLocaleString('fr-FR')}
            </h3>
            {trend !== undefined && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  isTrendPositive
                    ? 'text-[rgb(249,153,28)]'
                    : 'text-[rgb(18,51,119)]'
                }`}
              >
                {isTrendPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
        <div className={`rounded-lg p-3 ${colors.bg}`}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>
    </Card>
  );
}

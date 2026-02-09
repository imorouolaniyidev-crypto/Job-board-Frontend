'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StatisticsCardProps {
  label: string;
  value: number;
  trend?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'cyan';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-700 dark:text-green-300',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-700 dark:text-red-300',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-700 dark:text-purple-300',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    icon: 'text-orange-600 dark:text-orange-400',
    text: 'text-orange-700 dark:text-orange-300',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/30',
    icon: 'text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-700 dark:text-cyan-300',
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
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {value.toLocaleString('fr-FR')}
            </h3>
            {trend !== undefined && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  isTrendPositive
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
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

'use client';

interface StatCardProps {
  label: string;
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const colorClasses = {
  blue: 'text-blue-700 bg-blue-50',
  green: 'text-green-700 bg-green-50',
  yellow: 'text-yellow-700 bg-yellow-50',
  red: 'text-red-700 bg-red-50',
  gray: 'text-gray-700 bg-gray-50',
};

export default function StatCard({
  label,
  value,
  color = 'blue',
}: StatCardProps) {
  const colorClass = colorClasses[color];

  return (
    <div className={`rounded-lg border p-4 ${colorClass}`}>
      <div className="text-center">
        <p className="text-4xl font-bold">{value}</p>
        <p className="text-sm font-medium mt-2">{label}</p>
      </div>
    </div>
  );
}

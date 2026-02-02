"use client"

interface StatCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode;
    colorClass?: string;
    subtitle?: string;
}

export default function StatCard({ title, value, icon, colorClass = "bg-blue-500", subtitle }: StatCardProps) {
    return (
        <div className="border-2 rounded-lg p-6 flex flex-col gap-2 bg-slate-800 hover:shadow-lg transition-all">
            {icon && (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                    {icon}
                </div>
            )}
            <p className="text-4xl font-bold">{value}</p>
            <p className="text-lg text-slate-300">{title}</p>
            {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
    );
}

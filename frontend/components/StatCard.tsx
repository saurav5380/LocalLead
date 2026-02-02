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
        <div className="border-2 border-border rounded-lg p-6 flex flex-col gap-2 bg-surface hover:shadow-lg transition-all">
            {icon && (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                    {icon}
                </div>
            )}
            <p className="text-4xl font-bold text-foreground">{value}</p>
            <p className="text-lg text-text-secondary">{title}</p>
            {subtitle && <p className="text-sm text-text-tertiary">{subtitle}</p>}
        </div>
    );
}

"use client"

interface Lead {
    id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface FilterButtonsProps {
    leads: Lead[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export default function FilterButtons({ leads, activeFilter, onFilterChange }: FilterButtonsProps) {
    const filters = ["all", "new", "contacted", "qualified", "won", "lost"];

    const getCount = (filter: string): number => {
        if (filter === "all") return leads.length;
        return leads.filter(lead => lead.status === filter).length;
    };

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map(filter => {
                const count = getCount(filter);
                const isActive = activeFilter === filter;
                return (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            isActive
                                ? "bg-blue-500 text-white"
                                : "border-2 border-slate-600 text-slate-300 hover:border-blue-400"
                        }`}
                    >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)} ({count})
                    </button>
                );
            })}
        </div>
    );
}

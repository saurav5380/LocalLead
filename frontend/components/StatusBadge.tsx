"use client"

interface StatusBadgeProps {
    status: "new" | "contacted" | "qualified" | "won" | "lost";
    size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
    const colorMap = {
        new: "bg-blue-500 text-white",
        contacted: "bg-yellow-500 text-black",
        qualified: "bg-purple-500 text-white",
        won: "bg-green-500 text-white",
        lost: "bg-red-500 text-white"
    };

    const sizeMap = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base"
    };

    return (
        <span
            className={`rounded-full font-medium uppercase ${colorMap[status]} ${sizeMap[size]}`}
        >
            {status}
        </span>
    );
}

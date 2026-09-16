export default function ApplicationLogo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                viewBox="0 0 40 40"
                className="h-full w-auto shrink-0"
                aria-hidden="true"
            >
                <rect width="40" height="40" rx="11" fill="#1c7f7a" />
                <path
                    d="M10 28c4-2 6-6 6-10s2-8 6-10"
                    stroke="#eefcfb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
                <circle cx="10" cy="28" r="2.4" fill="#eefcfb" />
                <circle cx="28" cy="8" r="2.4" fill="#eefcfb" />
            </svg>
            <span className="text-xl font-bold leading-none text-brand-700 dark:text-brand-300">
                دربنا
            </span>
        </div>
    );
}

'use client';

interface HeaderProps {
    user?: {
        name: string;
        avatar?: string;
        citizenId?: string;
    };
}

export default function Header({ user }: HeaderProps) {
    return (
        <header className="header">
            {/* Left - Page Title */}
            <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Citizen Portal
                </h2>
            </div>

            {/* Right - User Menu */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="w-10 h-10 rounded-lg bg-[var(--navy-700)] flex items-center justify-center hover:bg-[var(--navy-600)] transition-colors">
                    <span>🔔</span>
                </button>

                {/* User Profile */}
                {user ? (
                    <div className="flex items-center gap-3 bg-[var(--navy-700)] rounded-lg px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-[var(--gold-500)] flex items-center justify-center text-[var(--navy-900)] font-bold text-sm">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-[var(--foreground)]">
                                {user.name}
                            </p>
                            {user.citizenId && (
                                <p className="text-xs text-[var(--muted)]">{user.citizenId}</p>
                            )}
                        </div>
                        <span className="text-[var(--muted)]">▼</span>
                    </div>
                ) : (
                    <a href="/api/auth/login" className="btn-primary text-sm">
                        Sign In
                    </a>
                )}
            </div>
        </header>
    );
}

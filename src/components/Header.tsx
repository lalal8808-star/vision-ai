'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Shield, Camera, Clock, BookOpen, Menu, X, LogIn, LogOut } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();

    const navItems = [
        { href: '/', label: '홈', icon: Shield },
        { href: '/analyze', label: '분석', icon: Camera },
        { href: '/history', label: '이력', icon: Clock },
        { href: '/guide', label: '안전 가이드', icon: BookOpen },
    ];

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    <div className="logo-icon">🛡️</div>
                    <span>SafetyAI</span>
                </Link>

                <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Icon size={16} />
                                {item.label}
                            </Link>
                        );
                    })}

                    <div className="auth-section">
                        {session ? (
                            <div className="user-profile">
                                {session.user?.image && (
                                    <img src={session.user.image} alt="Profile" className="user-avatar" />
                                )}
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {session.user?.name}
                                </span>
                                <button onClick={() => signOut()} className="logout-btn" title="로그아웃">
                                    <LogOut size={14} /> 로그아웃
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => signIn('google')} className="auth-btn">
                                <LogIn size={16} /> 구글 로그인
                            </button>
                        )}
                    </div>
                </nav>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="메뉴 열기"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </header>
    );
}

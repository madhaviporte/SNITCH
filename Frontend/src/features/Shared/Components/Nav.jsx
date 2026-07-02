import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const { handleLogout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const onLogout = async () => {
        await handleLogout()
        setMobileMenuOpen(false)
        navigate('/login')
    }

    const closeMobileMenu = () => setMobileMenuOpen(false)

    return (
        <nav className="border-b" style={{ borderColor: '#e4e2df' }}>
            {/* ── Top bar ── */}
            <div className="px-4 sm:px-8 lg:px-16 xl:px-24 pt-6 pb-4 lg:pt-10 lg:pb-6 flex items-center justify-between">
                <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                >
                    Snitch.
                </Link>

                {/* ── Desktop links (hidden on mobile) ── */}
                <div className="hidden lg:flex gap-6 items-center text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: '#7A6E63' }}>
                    {user ? (
                        <>
                            <span style={{ color: '#1b1c1a' }}>{user.fullname}</span>
                            <button
                                id="logout-btn"
                                onClick={onLogout}
                                className="transition-colors hover:text-[#C9A96E] cursor-pointer"
                                style={{ border: 'none', background: 'none', color: '#7A6E63', font: 'inherit', padding: 0 }}
                            >
                                Logout
                            </button>
                            {user.role === 'seller' && (
                                <Link to="/seller/dashboard" className="transition-colors hover:text-[#C9A96E]">Seller Dashboard</Link>
                            )}
                            <Link
                                to="/cart"
                                className="relative flex items-center hover:opacity-70 transition-opacity"
                                style={{ color: '#1b1c1a' }}
                                aria-label="Shopping cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {cartItems?.length > 0 && (
                                    <span
                                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                        style={{
                                            backgroundColor: '#C9A96E',
                                            width: '16px',
                                            height: '16px',
                                            fontSize: '9px',
                                            fontFamily: "'Inter', sans-serif",
                                            fontWeight: 600,
                                            letterSpacing: 0,
                                        }}
                                    >
                                        {cartItems.length > 9 ? '9+' : cartItems.length}
                                    </span>
                                )}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="transition-colors hover:text-[#C9A96E]">Sign In</Link>
                            <Link to="/register" className="transition-colors hover:text-[#C9A96E]">Sign Up</Link>
                        </>
                    )}
                </div>

                {/* ── Mobile right cluster: cart badge + hamburger ── */}
                <div className="flex lg:hidden items-center gap-4">
                    {user && (
                        <Link
                            to="/cart"
                            onClick={closeMobileMenu}
                            className="relative flex items-center"
                            style={{ color: '#1b1c1a' }}
                            aria-label="Shopping cart"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {cartItems?.length > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-white"
                                    style={{
                                        backgroundColor: '#C9A96E',
                                        width: '16px',
                                        height: '16px',
                                        fontSize: '9px',
                                        fontFamily: "'Inter', sans-serif",
                                        fontWeight: 600,
                                        letterSpacing: 0,
                                    }}
                                >
                                    {cartItems.length > 9 ? '9+' : cartItems.length}
                                </span>
                            )}
                        </Link>
                    )}
                    <button
                        id="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={mobileMenuOpen}
                        className="flex flex-col justify-center items-center w-8 h-8 gap-[5px] transition-opacity hover:opacity-60"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                        {mobileMenuOpen ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b1c1a" strokeWidth="1.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b1c1a" strokeWidth="1.5" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Mobile menu panel ── */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden px-4 sm:px-8 pb-6 flex flex-col gap-5 text-[11px] uppercase tracking-[0.22em] font-medium border-t"
                    style={{ borderColor: '#e4e2df', color: '#7A6E63', backgroundColor: '#fbf9f6' }}
                >
                    {user ? (
                        <>
                            <span className="pt-5" style={{ color: '#1b1c1a' }}>{user.fullname}</span>
                            {user.role === 'seller' && (
                                <Link
                                    to="/seller/dashboard"
                                    onClick={closeMobileMenu}
                                    className="transition-colors hover:text-[#C9A96E]"
                                >
                                    Seller Dashboard
                                </Link>
                            )}
                            <button
                                id="logout-btn-mobile"
                                onClick={onLogout}
                                className="text-left transition-colors hover:text-[#C9A96E] cursor-pointer"
                                style={{ border: 'none', background: 'none', color: '#7A6E63', font: 'inherit', padding: 0 }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                                className="pt-5 transition-colors hover:text-[#C9A96E]"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                onClick={closeMobileMenu}
                                className="transition-colors hover:text-[#C9A96E]"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Nav
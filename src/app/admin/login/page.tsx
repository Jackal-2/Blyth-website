"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m14 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldMark() {
  return (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 8v.01" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="admin-login">
      <div className="admin-login-panel">
        <div className="admin-login-glow" aria-hidden="true" />

        <Link href="/" className="admin-login-brand">
          <Image src="/images/logo-full-trim.png" alt="Blyth" width={666} height={240} className="admin-login-brand-img" />
        </Link>

        <div className="admin-login-panel-content">
          <span className="admin-login-shield" aria-hidden="true">
            <ShieldMark />
          </span>
          <h1 className="admin-login-panel-heading">
            Manage Blyth,
            <br />
            Securely
          </h1>
          <p className="admin-login-panel-sub">
            Sign in to access bookings, Helpers, and platform tools from one console.
          </p>
        </div>
      </div>

      <div className="admin-login-form-side">
        <div className="admin-login-topbar">
          <Link href="/" className="admin-login-return">
            <ChevronLeftIcon />
            Return Home
          </Link>
        </div>

        <div className="admin-login-form-wrap">
          <h2 className="admin-login-heading">Admin Console</h2>
          <p className="admin-login-sub">Sign in to continue</p>

          <form className="admin-login-form" onSubmit={(e) => e.preventDefault()}>
            <label className="admin-login-field">
              <span className="admin-login-field-icon">
                <MailIcon />
              </span>
              <input type="email" name="email" placeholder="you@blyth.com" autoComplete="email" required />
            </label>

            <label className="admin-login-field">
              <span className="admin-login-field-icon">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-login-show"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </label>

            <button type="submit" className="btn btn-accent admin-login-submit">
              Login
              <ArrowRightIcon />
            </button>
          </form>
        </div>

        <div className="admin-login-footer">
          <span>Copyright 2025</span>
          <span className="admin-login-help">
            <InfoIcon />
            Need help?
          </span>
        </div>
      </div>
    </div>
  );
}

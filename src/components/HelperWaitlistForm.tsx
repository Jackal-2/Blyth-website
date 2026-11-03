"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { EMAIL_MAX, NAME_MAX, cleanEmail, cleanName, emailError, nameError } from "@/lib/waitlistInput";

type Status = "idle" | "sending" | "done";

export default function HelperWaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setError(null);
    const cleanedName = cleanName(name);
    const cleanedEmail = cleanEmail(email);
    const problem = nameError(cleanedName) ?? emailError(cleanedEmail);
    if (problem) return setError(problem);

    setStatus("sending");
    try {
      const res = await fetch("/api/helper-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanedName, email: cleanedEmail, company }),
      });
      if (res.ok) {
        setStatus("done");
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <div className="wl-card wl-done" role="status">
        <div className="wl-tick" aria-hidden="true">
          ✓
        </div>
        <h2 className="wl-title">You&rsquo;re on the list!</h2>
        <p className="wl-sub">We&rsquo;ll email you as soon as Blyth launches. Keep an eye on your inbox.</p>
      </div>
    );
  }

  return (
    <form className="wl-card" onSubmit={onSubmit} noValidate>
      <h2 className="wl-title">Become a Helper</h2>
      <p className="wl-sub">Be one of the first Helpers on Blyth. We&rsquo;ll email you when we launch.</p>

      <div className="wl-row">
        <div className="wl-field">
          <label className="wl-label" htmlFor="wl-name">
            Name
          </label>
          <input
            id="wl-name"
            className="wl-input"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            maxLength={NAME_MAX}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="wl-field">
          <label className="wl-label" htmlFor="wl-email">
            Email
          </label>
          <input
            id="wl-email"
            className="wl-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={EMAIL_MAX}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="wl-btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>

      <div className="wl-hp" aria-hidden="true">
        <label htmlFor="wl-company">Company</label>
        <input
          id="wl-company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {error && (
        <p className="wl-error" role="alert">
          {error}
        </p>
      )}

      <p className="wl-fine">
        We&rsquo;ll only use your email to tell you about Blyth&rsquo;s launch. <Link href="/privacy">Privacy</Link>
      </p>
    </form>
  );
}

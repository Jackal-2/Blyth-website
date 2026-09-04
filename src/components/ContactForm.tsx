"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/contact";

const INITIAL_STATE: ContactFormState = { status: "idle" };

// The support page's only interactive piece — everything else on
// Blyth-website is static. Submits via a Server Action (lib/contact.ts)
// straight to the backend's public POST /contact, which previously had
// nothing on the website actually calling it (see that file's comment).
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, INITIAL_STATE);

  if (state.status === "success") {
    return <p className="contact-form-success">{state.message}</p>;
  }

  return (
    <form className="contact-form" action={formAction}>
      <div className="contact-form-row">
        <label className="contact-form-field">
          <span>Name</span>
          <input type="text" name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label className="contact-form-field">
          <span>Email</span>
          <input type="email" name="email" required maxLength={254} autoComplete="email" />
        </label>
      </div>
      <label className="contact-form-field">
        <span>Message</span>
        <textarea name="message" required maxLength={5000} rows={5} />
      </label>
      {state.status === "error" && <p className="contact-form-error">{state.message}</p>}
      <button type="submit" className="btn btn-accent" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

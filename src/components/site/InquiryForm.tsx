"use client";
/**
 * Customized-tour inquiry wizard (4 steps). Saves to Firestore (`inquiries`) when configured.
 * Saving and WhatsApp are separate: after saving we *offer* to open WhatsApp — we never claim
 * a message was sent.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, Controller, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Minus, Plus, Send } from "lucide-react";
import { inquiryInput, type InquiryInput } from "@/lib/schema";
import { cx } from "@/lib/format";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

export interface InquiryFormProps {
  destinations: { id: string; name: string }[];
  packages: { id: string; title: string }[];
  whatsappNumber: string;
  greeting: string;
  initial?: Partial<InquiryInput>;
  configured: boolean;
}

const STEPS = ["Where", "When & who", "Your style", "Contact"] as const;
const STEP_FIELDS: FieldPath<InquiryInput>[][] = [
  ["destinations", "packageId"],
  ["departureCity", "startDate", "durationDays", "adults", "children"],
  ["budget", "transport", "message"],
  ["name", "phone", "email", "preferredContact", "consent"],
];
const CITIES = ["Karachi", "Hyderabad", "Islamabad / Rawalpindi", "Lahore", "Other city in Pakistan", "From abroad"];
const BUDGETS = ["Under Rs 30,000 per person", "Rs 30,000 – 50,000 per person", "Rs 50,000 – 80,000 per person", "Above Rs 80,000 per person", "Not sure yet"];
const TRANSPORT = ["Join a group tour", "Private car / coaster for my group", "By air where possible", "Not sure — please advise"];

export function InquiryForm({ destinations, packages, whatsappNumber, greeting, initial, configured }: InquiryFormProps) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<InquiryInput>({
    resolver: zodResolver(inquiryInput),
    mode: "onTouched",
    defaultValues: {
      type: initial?.packageId ? "package" : "custom",
      name: "", phone: "", email: "", preferredContact: "whatsapp",
      destinations: initial?.destinations ?? [], packageId: initial?.packageId ?? "",
      departureCity: initial?.departureCity ?? "", startDate: "", flexibleDates: false, durationDays: 0,
      adults: initial?.adults ?? 2, children: initial?.children ?? 0,
      budget: "", transport: initial?.transport ?? "", message: "",
      consent: false as unknown as true,
    },
  });
  const { register, handleSubmit, control, trigger, watch, formState: { errors } } = form;
  const values = watch();

  useEffect(() => { headingRef.current?.focus({ preventScroll: false }); }, [step, status]);

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const pkgTitle = useMemo(() => packages.find((p) => p.id === values.packageId)?.title, [packages, values.packageId]);
  const destNames = values.destinations?.map((id) => destinations.find((d) => d.id === id)?.name ?? id) ?? [];

  const waMessage = buildWhatsAppMessage({
    greeting,
    tour: pkgTitle || (destNames.length ? `Custom trip — ${destNames.join(", ")}` : "Custom trip"),
    departureCity: values.departureCity || undefined,
    transport: values.transport || undefined,
    adults: values.adults,
    children: values.children,
    month: [values.startDate, values.flexibleDates ? "(flexible)" : "", values.durationDays ? `${values.durationDays} days` : ""].filter(Boolean).join(" ") || undefined,
    reference: reference || undefined,
    extra: values.message ? `Notes: ${values.message.slice(0, 400)}` : undefined,
  });

  const onSubmit = async (data: InquiryInput) => {
    setError("");
    if (honeypot) { setStatus("saved"); setReference("PG-THANKS"); return; } // silently drop bots
    if (Date.now() - startedAt.current < 4000) { setError("That was quick! Please review your details and submit again."); return; }
    setStatus("saving");
    try {
      const { submitInquiry, checkCooldown } = await import("@/lib/public/submit");
      const wait = checkCooldown();
      if (wait) { setStatus("error"); setError(`You just sent an inquiry. Please wait ${wait} seconds before sending another.`); return; }
      const res = await submitInquiry({ ...data, type: data.packageId ? "package" : data.type });
      setReference(res.reference);
      setStatus("saved");
    } catch (e) {
      console.error(e);
      setStatus("error");
      const msg = (e as Error).message || "";
      setError(
        msg.includes("not connected")
          ? "Our online form isn't connected yet, so your inquiry could not be saved. Please send it to us on WhatsApp instead — your details are pre-filled."
          : "Sorry — we couldn't save your inquiry just now. Please check your connection and try again, or send it on WhatsApp instead.",
      );
    }
  };

  if (status === "saved") {
    return (
      <div className="card p-6 text-center sm:p-10" role="status">
        <CheckCircle2 className="mx-auto size-14 text-pine" aria-hidden />
        <h2 ref={headingRef} tabIndex={-1} className="mt-4 text-3xl font-semibold text-navy outline-none">Inquiry received</h2>
        <p className="mx-auto mt-3 max-w-lg text-stone">
          Thank you, {values.name.split(" ")[0] || "traveller"}. Your inquiry has been saved{reference && reference !== "PG-THANKS" ? <> with reference <strong className="text-navy">{reference}</strong></> : ""}. Our team will contact you by {values.preferredContact === "email" ? "email" : values.preferredContact === "call" ? "phone" : "WhatsApp"}.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-sm text-stone">Want a faster reply? You can also message us on WhatsApp now. This opens WhatsApp with your details — nothing is sent until you press send.</p>
        <a href={whatsappLink(whatsappNumber, waMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6"><WhatsAppIcon className="size-5" /> Open WhatsApp</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card overflow-hidden" aria-describedby="form-status">
      {/* progress */}
      <ol className="grid grid-cols-4 border-b border-navy/10 bg-sand/40 text-center text-xs font-semibold sm:text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className={cx("relative px-2 py-4", i === step ? "text-navy" : i < step ? "text-pine" : "text-stone")} aria-current={i === step ? "step" : undefined}>
            <span className={cx("mx-auto mb-1.5 flex size-7 items-center justify-center rounded-full text-xs", i === step ? "bg-navy text-white" : i < step ? "bg-pine text-white" : "bg-white text-stone ring-1 ring-navy/15")}>{i + 1}</span>
            <span className="hidden sm:inline">{label}</span>
            {i === step && <span className="absolute inset-x-4 bottom-0 h-0.5 rounded bg-amber" />}
          </li>
        ))}
      </ol>

      <div className="p-6 sm:p-10">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold text-navy outline-none">
          <span className="sr-only">Step {step + 1} of {STEPS.length}: </span>{STEPS[step]}
        </h2>

        {/* Honeypot — hidden from people, tempting for bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="company_website" /></label>
        </div>

        {step === 0 && (
          <div className="mt-6 space-y-8">
            <fieldset>
              <legend className="field-label">Where would you like to go? <span className="font-normal text-stone">(choose any)</span></legend>
              <Controller
                control={control}
                name="destinations"
                render={({ field }) => (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[...destinations, { id: "other", name: "Somewhere else" }].map((d) => {
                      const on = field.value.includes(d.id);
                      return (
                        <label key={d.id} className={cx("cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors", on ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:border-navy/40")}>
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => field.onChange(on ? field.value.filter((x) => x !== d.id) : [...field.value, d.id].slice(0, 12))} />
                          {d.name}
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </fieldset>
            <label className="block">
              <span className="field-label">Start from one of our packages? <span className="font-normal text-stone">(optional)</span></span>
              <select className="field-input" {...register("packageId")}>
                <option value="">No — plan something custom</option>
                {packages.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="field-label">Departing from</span>
              <select className="field-input" {...register("departureCity")}>
                <option value="">Select a city</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
                {values.departureCity && !CITIES.includes(values.departureCity) && <option>{values.departureCity}</option>}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Preferred start date</span>
              <input type="date" className="field-input" min={new Date().toISOString().slice(0, 10)} {...register("startDate")} />
            </label>
            <label className="block">
              <span className="field-label">Trip length (days)</span>
              <input type="number" inputMode="numeric" min={0} max={60} className="field-input" {...register("durationDays", { valueAsNumber: true })} aria-invalid={!!errors.durationDays} />
              <span className="field-hint">Leave 0 if you&apos;re not sure.</span>
            </label>
            <label className="flex items-center gap-3 sm:col-span-2">
              <input type="checkbox" className="size-5 accent-[#232a3a]" {...register("flexibleDates")} />
              <span className="text-sm text-navy">My dates are flexible</span>
            </label>
            <Controller control={control} name="adults" render={({ field }) => <Stepper label="Adults" value={field.value} min={1} max={200} onChange={field.onChange} error={errors.adults?.message} />} />
            <Controller control={control} name="children" render={({ field }) => <Stepper label="Children (under 8)" value={field.value} min={0} max={100} onChange={field.onChange} />} />
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 grid gap-6">
            <label className="block">
              <span className="field-label">Budget <span className="font-normal text-stone">(optional)</span></span>
              <select className="field-input" {...register("budget")}>
                <option value="">Prefer not to say</option>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="field-label">How would you like to travel?</span>
              <select className="field-input" {...register("transport")}>
                <option value="">Select an option</option>
                {TRANSPORT.map((b) => <option key={b}>{b}</option>)}
                {values.transport && !TRANSPORT.includes(values.transport) && <option>{values.transport}</option>}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Anything else we should know?</span>
              <textarea rows={5} maxLength={2000} className="field-input" placeholder="Honeymoon, elderly parents, hotel preferences, places you must see…" {...register("message")} aria-invalid={!!errors.message} />
              <span className="field-hint">{values.message?.length ?? 0}/2000</span>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Your name" error={errors.name?.message}>
              <input className="field-input" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />
            </Field>
            <Field label="Phone / WhatsApp number" error={errors.phone?.message} hint="Include the country code if outside Pakistan.">
              <input className="field-input" type="tel" inputMode="tel" autoComplete="tel" placeholder="03xx xxxxxxx" {...register("phone")} aria-invalid={!!errors.phone} />
            </Field>
            <Field label="Email (optional)" error={errors.email?.message}>
              <input className="field-input" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
            </Field>
            <label className="block">
              <span className="field-label">Best way to reach you</span>
              <select className="field-input" {...register("preferredContact")}>
                <option value="whatsapp">WhatsApp</option>
                <option value="call">Phone call</option>
                <option value="email">Email</option>
              </select>
            </label>
            <label className="flex items-start gap-3 sm:col-span-2">
              <input type="checkbox" className="mt-0.5 size-5 accent-[#232a3a]" {...register("consent")} aria-invalid={!!errors.consent} />
              <span className="text-sm text-navy">I agree that Pack & Go Tourism may store these details and contact me about this trip. See our <a href="/privacy" className="underline">privacy policy</a>.</span>
            </label>
            {errors.consent && <p className="field-error sm:col-span-2">{errors.consent.message}</p>}
            {!configured && (
              <p className="rounded-xl bg-amber/15 p-4 text-sm text-navy sm:col-span-2">Note: the online form is not connected to our database yet. If saving fails, you can send the same details on WhatsApp.</p>
            )}
          </div>
        )}

        <div id="form-status" aria-live="assertive" className="mt-6">
          {error && (
            <div className="rounded-xl border border-[#b42318]/30 bg-[#fef3f2] p-4 text-sm text-[#7a271a]">
              <p>{error}</p>
              <a href={whatsappLink(whatsappNumber, waMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm mt-3"><WhatsAppIcon className="size-4" /> Send on WhatsApp instead</a>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} className={cx("btn btn-outline", step === 0 && "invisible")}>
            <ChevronLeft className="size-4" aria-hidden /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn btn-dark">Continue <ChevronRight className="size-4" aria-hidden /></button>
          ) : (
            <button type="submit" disabled={status === "saving"} className="btn btn-primary disabled:opacity-70">
              {status === "saving" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Saving…</> : <><Send className="size-4" aria-hidden /> Send inquiry</>}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error block" role="alert">{error}</span> : hint ? <span className="field-hint block">{hint}</span> : null}
    </label>
  );
}

function Stepper({ label, value, min, max, onChange, error }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void; error?: string }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-outline btn-sm !px-3" onClick={() => onChange(Math.max(min, (value || 0) - 1))} aria-label={`Fewer ${label.toLowerCase()}`}><Minus className="size-4" aria-hidden /></button>
        <input type="number" inputMode="numeric" className="field-input w-24 text-center" value={Number.isFinite(value) ? value : ""} min={min} max={max} aria-label={label} onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value || "0", 10))))} />
        <button type="button" className="btn btn-outline btn-sm !px-3" onClick={() => onChange(Math.min(max, (value || 0) + 1))} aria-label={`More ${label.toLowerCase()}`}><Plus className="size-4" aria-hidden /></button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

"use client";
/** Public review submission. Reviews are saved as "pending" and only appear after admin approval. */
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { cx } from "@/lib/format";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  location: z.string().trim().max(80).default(""),
  tripName: z.string().trim().max(160).default(""),
  travelMonth: z.string().trim().max(40).default(""),
  rating: z.number().int().min(1).max(5).nullable().default(null),
  text: z.string().trim().min(20, "Please write at least 20 characters").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Please allow us to publish your review" }) }),
});
type Values = z.infer<typeof schema>;

export function ReviewForm({ trips, configured }: { trips: string[]; configured: boolean }) {
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const [hp, setHp] = useState("");
  const started = useRef(Date.now());
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", location: "", tripName: "", travelMonth: "", rating: null, text: "", consent: false as unknown as true },
  });
  const rating = watch("rating");

  const onSubmit = async (v: Values) => {
    setErr("");
    if (hp) { setState("done"); return; }
    if (Date.now() - started.current < 5000) { setErr("Please take a moment to review your text, then submit again."); return; }
    setState("saving");
    try {
      const { submitReview, checkCooldown } = await import("@/lib/public/submit");
      const wait = checkCooldown();
      if (wait) { setState("error"); setErr(`Please wait ${wait} seconds before submitting again.`); return; }
      await submitReview(v);
      setState("done");
    } catch (e) {
      console.error(e);
      setState("error");
      setErr((e as Error).message.includes("not connected") ? "Online reviews are not connected yet. Please share your review with us on WhatsApp." : "Sorry — your review couldn't be saved. Please try again later.");
    }
  };

  if (state === "done") {
    return (
      <div className="card p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto size-12 text-pine" aria-hidden />
        <h3 className="mt-3 text-2xl font-semibold text-navy">Thank you!</h3>
        <p className="mt-2 text-stone">Your review has been received and will appear once our team has checked it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <div aria-hidden="true" className="absolute -left-[9999px]"><input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website_url" /></div>
      <label className="block">
        <span className="field-label">Your name</span>
        <input className="field-input" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />
        {errors.name && <span className="field-error block">{errors.name.message}</span>}
      </label>
      <label className="block">
        <span className="field-label">City <span className="font-normal text-stone">(optional)</span></span>
        <input className="field-input" {...register("location")} />
      </label>
      <label className="block">
        <span className="field-label">Which trip?</span>
        <select className="field-input" {...register("tripName")}>
          <option value="">Select</option>
          {trips.map((t) => <option key={t}>{t}</option>)}
          <option>Customized trip</option>
        </select>
      </label>
      <label className="block">
        <span className="field-label">When did you travel?</span>
        <input className="field-input" placeholder="e.g. June 2026" {...register("travelMonth")} />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="field-label">Rating <span className="font-normal text-stone">(optional)</span></legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setValue("rating", rating === n ? null : n)} aria-pressed={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} className="rounded-md p-1">
              <Star className={cx("size-7", rating != null && n <= rating ? "fill-amber text-amber" : "text-navy/25")} aria-hidden />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block sm:col-span-2">
        <span className="field-label">Your review</span>
        <textarea rows={5} maxLength={2000} className="field-input" {...register("text")} aria-invalid={!!errors.text} />
        {errors.text && <span className="field-error block">{errors.text.message}</span>}
      </label>
      <label className="flex items-start gap-3 sm:col-span-2">
        <input type="checkbox" className="mt-0.5 size-5 accent-[#232a3a]" {...register("consent")} />
        <span className="text-sm text-navy">I travelled with Pack & Go and agree that this review, my first name and city may be published on this website.</span>
      </label>
      {errors.consent && <p className="field-error sm:col-span-2">{errors.consent.message}</p>}
      {!configured && <p className="rounded-xl bg-amber/15 p-3 text-sm text-navy sm:col-span-2">Online review submission isn&apos;t connected yet.</p>}
      <div aria-live="assertive" className="sm:col-span-2">{err && <p className="rounded-xl bg-[#fef3f2] p-3 text-sm text-[#7a271a]">{err}</p>}</div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary" disabled={state === "saving"}>
          {state === "saving" ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Sending…</> : "Submit review"}
        </button>
      </div>
    </form>
  );
}

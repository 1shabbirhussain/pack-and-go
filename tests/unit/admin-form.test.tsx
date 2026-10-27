// @vitest-environment jsdom
/**
 * Exercises the generic admin form engine with real starter content: every registry form must
 * load the seed document, render all tabs, and submit it back through zod validation unchanged.
 */
import { describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { COLLECTIONS, SINGLETONS } from "@/lib/admin/registry";
import { FieldsWithTabs, FormMeta } from "@/components/admin/FormBuilder";
import { ToastProvider } from "@/components/admin/ui";
import { SEED } from "@/content/seed";
import type { ZodTypeAny } from "zod";

vi.mock("@/lib/admin/data", () => ({ listDocs: async () => [], uploadFile: async () => ({}) }));

function Harness({ schema, fields, initial, onValid }: { schema: ZodTypeAny; fields: never; initial: Record<string, unknown>; onValid: (d: unknown) => void }) {
  const methods = useForm({ resolver: zodResolver(schema), defaultValues: initial });
  return (
    <ToastProvider>
      <FormMeta.Provider value={{ isNew: false }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onValid, (e) => onValid({ __errors: Object.keys(e) }))}>
            <FieldsWithTabs fields={fields} />
            <button type="submit">save</button>
          </form>
        </FormProvider>
      </FormMeta.Provider>
    </ToastProvider>
  );
}

async function roundTrip(schema: ZodTypeAny, fields: unknown, doc: Record<string, unknown>) {
  const initial = schema.parse(doc) as Record<string, unknown>;
  let result: unknown = null;
  render(<Harness schema={schema} fields={fields as never} initial={initial} onValid={(d) => (result = d)} />);
  for (const tab of screen.queryAllByRole("tab")) fireEvent.click(tab);
  await act(async () => { fireEvent.click(screen.getByText("save")); });
  cleanup();
  return { initial, result };
}

describe("admin forms round-trip the starter content", () => {
  for (const [key, cfg] of Object.entries(COLLECTIONS)) {
    const docs = (SEED as unknown as Record<string, Record<string, unknown>[]>)[key];
    if (!docs?.length) continue;
    it(`${key}: ${docs[0].id}`, async () => {
      const { initial, result } = await roundTrip(cfg.schema, cfg.fields, docs[0]);
      expect(result).not.toHaveProperty("__errors");
      expect(result).toEqual(initial);
    });
  }
  for (const [key, cfg] of Object.entries(SINGLETONS)) {
    it(`settings/${key}`, async () => {
      const { initial, result } = await roundTrip(cfg.schema, cfg.fields, SEED.settings[key as keyof typeof SEED.settings] as unknown as Record<string, unknown>);
      expect(result).not.toHaveProperty("__errors");
      expect(result).toEqual(initial);
    });
  }
  it("rejects an invalid WhatsApp number", async () => {
    const cfg = SINGLETONS.contact;
    const initial = { ...(cfg.schema.parse(SEED.settings.contact) as Record<string, unknown>), whatsappNumber: "0310 786" };
    let result: unknown = null;
    render(<Harness schema={cfg.schema} fields={cfg.fields as never} initial={initial} onValid={(d) => (result = d)} />);
    await act(async () => { fireEvent.click(screen.getByText("save")); });
    expect(result).toEqual({ __errors: ["whatsappNumber"] });
    cleanup();
  });
});

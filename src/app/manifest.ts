import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pack & Go Tourism",
    short_name: "Pack & Go",
    description: "Group tours and customized trips across Pakistan.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8ee",
    theme_color: "#232a3a",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}

import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import pagefindResources from "./src/integrations/pagefind-resources";

const site = "https://dvt-awesome-skills.internal/";
const siteDescription =
  "DVT's internal collection of AI skills and coding instructions — author once, generate for Copilot, Cursor, Windsurf, Claude Code, and Kiro";
const socialImageUrl = new URL("/images/social-image.png", site).toString();

// https://astro.build/config
export default defineConfig({
  site,
  base: "/",
  output: "static",
  integrations: [
    starlight({
      title: "DVT Awesome Skills",
      favicon: "/images/favicon.svg",
      description: siteDescription,
      social: [],
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: socialImageUrl,
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "og:image:alt",
            content: siteDescription,
          },
        },
        {
          tag: "meta",
          attrs: {
            name: "twitter:image",
            content: socialImageUrl,
          },
        },
      ],
      customCss: ["./src/styles/starlight-overrides.css", "./src/styles/global.css"],
      editLink: {
        baseUrl: "https://github.com/dvt/dvt-awesome-skills/edit/main/website/",
      },
      sidebar: [
        {
          label: "Browse Resources",
          items: [
            { label: "Home", link: "/" },
            { label: "Skills", link: "/skills/" },
            { label: "Instructions", link: "/instructions/" },
          ],
        },
      ],
      disable404Route: true,
      // pagefind: true is required so Starlight renders the search UI.
      // Our pagefindResources() integration overwrites the index after build.
      pagefind: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      components: {
        Head: "./src/components/Head.astro",
        Footer: "./src/components/Footer.astro",
        Search: "./src/components/Search.astro",
      },
    }),
    sitemap(),
    pagefindResources(),
  ],
  build: {
    assets: "assets",
  },
  trailingSlash: "always",
  vite: {
    build: {
      // Production sourcemaps trigger a known warning in the expressive-code Vite plugin.
      sourcemap: false,
      // Starlight ships large syntax-highlighting chunks that are expected for this site.
      chunkSizeWarningLimit: 900,
    },
    css: {
      devSourcemap: true,
    },
  },
});

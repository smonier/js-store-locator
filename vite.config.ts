import { defineConfig } from "vite";
import { spawnSync } from "node:child_process";
import jahiaFederationPlugin from "@jahia/vite-federation-plugin";

export default defineConfig({
  build: {
    outDir: "javascript/apps",
  },

  plugins: [
    jahiaFederationPlugin({
      exposes: {
        "./init": "./src/init.tsx",
      },
      remotes: {
        "@jahia/jcontent": "window:appShell.remotes.jcontent",
      },
    }),
    {
      name: "watch-mode",
      closeBundle(error) {
        if (!this.meta.watchMode || error) return;
        spawnSync("yarn pack --out dist/package.tgz", {
          stdio: "inherit",
          shell: true,
        });
        spawnSync(
          `curl -X POST -u root:root http://localhost:8080/modules/api/provisioning \
          -F 'script=[{"installOrUpgradeBundle":"package.tgz","ignoreChecks":true}]' -F 'file=@./dist/package.tgz'`,
          { stdio: "inherit", shell: true },
        );
      },
    },
  ],
  ssr: {
    external: ["@jahia/javascript-modules-library", "@jahia/ui-extender", "prop-types"],
    noExternal: ["react", "react-i18next", "i18next", "leaflet", "react-leaflet"],
  },
});

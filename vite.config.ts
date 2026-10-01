import { defineConfig } from "vite";
import { spawnSync } from "node:child_process";
import jahia from "@jahia/vite-plugin";
import jahiaFederationPlugin from "@jahia/vite-federation-plugin";

// Two builds share this file:
// - the default mode builds the template-set views and the client island into dist/
//   (React from the JavaScript modules engine);
// - `--mode ui` builds the jContent UI extension (the OpeningHoursSelector) into javascript/apps
//   (React 18 shared with jContent through Module Federation).
export default defineConfig(({ mode }) => {
  if (mode === "ui") {
    return {
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
          // The type-declaration worker keeps the process alive after the build.
          dts: false,
        }),
      ],
    };
  }

  return {
    plugins: [
      jahia({
        // Called every time a build succeeds in watch mode
        watchCallback() {
          spawnSync("yarn", ["watch:callback"], { stdio: "inherit", shell: true });
        },
      }),
    ],
  };
});

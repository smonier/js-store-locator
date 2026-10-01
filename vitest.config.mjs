// Unit tests for the pure helpers (opening hours, search, phone and web links). Separate from
// vite.config.ts so the Jahia build plugins are not involved.
export default {
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
};

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: false, // HTML generated separately using marge
    json: true, // JSON output required for merging
  },

  e2e: {
    // ✅ Test pattern
    baseUrl: process.env.BASE_URL,
    specPattern: "cypress/e2e/tests/**/*.cy.js",

    // ✅ Artifacts
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: "cypress/reports/videos",
    screenshotsFolder: "cypress/reports/screenshots",

    // ✅ Stability improvements
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    chromeWebSecurity: false,

    // ✅ Skip “verify server running” check
    verifyTimeout: 0,

    // ✅ Node event setup (kept simple)
    setupNodeEvents(on, config) {
      // No additional plugin setup needed
      return config;
    },
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },
});

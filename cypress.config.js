const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: false, // HTML will be generated manually
    json: true,
  },
  e2e: {
    baseUrl: "https://retail-staging.48.ie/log-in",
    video: true,
    screenshotOnRunFailure: true,
    specPattern: "cypress/e2e/tests/**/*.cy.js",
    videosFolder: "cypress/reports/videos",
    screenshotsFolder: "cypress/reports/screenshots",
    setupNodeEvents(on, config) {
      // No plugins loaded — fully clean setup
      return config;
    },
  },
});

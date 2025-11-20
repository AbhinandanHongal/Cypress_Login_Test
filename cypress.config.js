const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: false,    // HTML generated separately using marge
    json: true      // JSON output required for merging
  },

  e2e: {
    baseUrl: "https://retail-staging.48.ie/login",  // update as needed
    specPattern: "cypress/e2e/tests/**/*.cy.js",

    video: true,
    screenshotOnRunFailure: true,

    videosFolder: "cypress/reports/videos",
    screenshotsFolder: "cypress/reports/screenshots",

    setupNodeEvents(on, config) {
      // 🔥 DO NOT add cypress-mochawesome-reporter here
      // It is not needed unless you want auto-merge (which you don't)
      return config;
    }
  }
});

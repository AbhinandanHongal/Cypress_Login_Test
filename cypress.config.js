const { defineConfig } = require("cypress");
const path = require("path");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true, // ✅ ensures HTML files are created
    json: true,
  },
  e2e: {
   // baseUrl: "https://retail-staging.48.ie/log-in",   // change to your app URL
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      return config;
    },
    specPattern: "cypress/e2e/tests/**/*.cy.js",
    videosFolder: "cypress/reports/videos",        // ✅ video folder
    screenshotsFolder: "cypress/reports/screenshots", // ✅ screenshot folder
  },
});

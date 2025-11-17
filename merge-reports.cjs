const mergeModule = require("mochawesome-merge");
const fs = require("fs");
const path = require("path");

console.log("🟢 Running merge-reports.cjs...");

const merge = mergeModule.merge;

if (typeof merge !== "function") {
  console.error("❌ merge is NOT a function. Actual export:", mergeModule);
  process.exit(1);
}

const reportsDir = path.join(__dirname, "cypress", "reports");
let pattern = path.join(reportsDir, "mochawesome*.json").replace(/\\/g, "/");

console.log("📂 Reports directory:", reportsDir);
console.log("📘 Using file pattern:", pattern);

(async () => {
  try {
    console.log("🔄 Merging JSON reports...");

    const result = await merge({
      files: [pattern],   // ✔ MUST be inside "files" array
    });

    const outputFile = path.join(reportsDir, "output.json");
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    console.log("✅ Merged report saved at:", outputFile);
  } catch (err) {
    console.error("❌ Merge failed:", err);
  }
})();

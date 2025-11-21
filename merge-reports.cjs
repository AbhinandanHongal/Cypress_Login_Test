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
let pattern = path.join(reportsDir, "*.json").replace(/\\/g, "/");

console.log("📂 Reports directory:", reportsDir);
console.log("📘 Using file pattern:", pattern);

(async () => {
  try {
    // Filter out empty or invalid JSON files before merging
    const files = fs
      .readdirSync(reportsDir)
      .filter(
        (f) => f.endsWith(".json") && fs.statSync(path.join(reportsDir, f)).size > 10
      )
      .map((f) => path.join(reportsDir, f));

    if (files.length === 0) {
      console.warn("⚠️ No valid mochawesome JSON files found to merge. Skipping merge step.");
      process.exit(0);
    }

    console.log(`🔄 Merging ${files.length} valid mochawesome JSON files...`);
    const result = await merge({ files });

    const outputFile = path.join(reportsDir, "output.json");
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    console.log("✅ Merged report saved at:", outputFile);
  } catch (err) {
    console.error("❌ Merge failed:", err);
    process.exit(1);
  }
})();

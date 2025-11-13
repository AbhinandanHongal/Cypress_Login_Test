// 🧩 Universal Mochawesome Merge (works for all versions)
const fs = require("fs");
const path = require("path");

let mergeFn;

// 🔍 Try to load the merge function safely
try {
  const imported = require("mochawesome-merge");
  mergeFn = imported.merge || imported.default || imported;
} catch (err) {
  console.error("❌ Failed to load mochawesome-merge:", err);
  process.exit(1);
}

(async () => {
  try {
    console.log("🟢 Starting universal mochawesome merge...");

    const reportsDir = path.resolve("cypress", "reports");
    const pattern = path.join(reportsDir, "mochawesome*.json").replace(/\\/g, "/");

    console.log("📂 Reports directory:", reportsDir);
    console.log("🔍 Using glob pattern:", pattern);

    const mergedReport = await mergeFn({ files: [pattern] });

    if (!mergedReport || Object.keys(mergedReport).length === 0) {
      throw new Error("No data merged! Check JSON validity or file paths.");
    }

    const outputFile = path.join(reportsDir, "output.json");
    fs.writeFileSync(outputFile, JSON.stringify(mergedReport, null, 2));
    console.log(`✅ Successfully created merged report: ${outputFile}`);
  } catch (error) {
    console.error("❌ Merge failed:", error);
  }
})();

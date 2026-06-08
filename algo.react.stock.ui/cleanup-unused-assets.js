import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const assetDirs = [
  "src/assets/fonts",
  "src/assets/images",
  "src/assets/lang",
  "src/assets/scss",
];
const codeDirs = ["src", "public"];

function getAllFiles(dir, extFilter = null) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, extFilter));
    } else {
      if (!extFilter || extFilter.includes(path.extname(file))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

function fileIsReferenced(file, codeFiles) {
  const basename = path.basename(file);
  for (const codeFile of codeFiles) {
    const content = fs.readFileSync(codeFile, "utf8");
    if (content.includes(basename)) return true;
  }
  return false;
}

function main() {
  // Remove all duplicate and unwanted files identified during refactor
  const filesToDelete = [
    // Duplicate sidebar images
    "public/images/sidebar/img1.jpg",
    "public/images/sidebar/img2.jpg",
    "public/images/sidebar/img3.jpg",
    "public/images/sidebar/img4.jpg",

    // Deprecated/unused Common components
    "src/components/Common/Breadcrumb.jsx",
    "src/components/Common/Breadcrumb2.jsx",
    "src/components/Common/ChartsDynamicColor.jsx",
    "src/components/Common/DeleteModal.jsx",
    "src/components/Common/Pagination.jsx",
    "src/components/Common/Spinner.jsx",
    "src/components/Common/TableContainer.jsx",
    "src/components/Common/withRouter.jsx",
    "src/components/Common/filters.jsx",
    "src/components/Common/GlobalSearchFilter.jsx",
    "src/components/Common/searchFile.jsx",

    // Deprecated/unused Charts components
    "src/components/Charts/BarChart.tsx",
    "src/components/Charts/DonutChart.tsx",
    "src/components/Charts/PieChart.tsx",
    "src/components/Charts/ChartsDynamicColor.jsx",
  ];

  let deleted = [];
  filesToDelete.forEach((f) => {
    const filePath = path.join(__dirname, f);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        deleted.push(filePath);
        console.log("Deleted:", filePath);
      } catch (err) {
        console.error("Failed to delete:", filePath, err);
      }
    }
  });

  if (deleted.length === 0) {
    console.log("No duplicate or unwanted files found to delete.");
  }
}

main();

import fs from "fs";
import path from "path";

// Helper to move files, creating directories as needed
function moveFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log(`Moved: ${src} -> ${dest}`);
  } else {
    console.log(`File not found (skipped): ${src}`);
  }
}

// Helper to move all files from a folder to a new folder
function moveFolderContents(srcFolder, destFolder) {
  if (!fs.existsSync(srcFolder)) return;
  if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
  for (const file of fs.readdirSync(srcFolder)) {
    const srcPath = path.join(srcFolder, file);
    const destPath = path.join(destFolder, file);
    if (fs.lstatSync(srcPath).isDirectory()) {
      moveFolderContents(srcPath, destPath);
    } else {
      moveFile(srcPath, destPath);
    }
  }
}

// Helper to delete files
function deleteFile(file) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`Deleted: ${file}`);
  } else {
    console.log(`File not found (skipped): ${file}`);
  }
}

// 1. Move legacy folders to new structure
moveFolderContents("src/pages/Authentication", "src/features/authentication");
moveFolderContents("src/pages/Dashboard", "src/features/dashboard");
moveFolderContents("src/pages/Stocks", "src/features/stocks");
moveFolderContents("src/pages/Search", "src/features/search");

moveFolderContents("src/components/Charts", "src/shared/components/Charts");
moveFolderContents("src/components/Common", "src/shared/components/Common");
moveFolderContents(
  "src/components/CommonForBoth",
  "src/shared/components/CommonForBoth"
);
moveFolderContents("src/components/Stocks", "src/features/stocks/components");
moveFolderContents(
  "src/components/VerticalLayout",
  "src/shared/components/VerticalLayout"
);

moveFolderContents("src/hooks", "src/shared/hooks");
moveFolderContents("src/utils", "src/shared/utils");
moveFolderContents("src/context", "src/shared/context");
moveFolderContents("src/interfaces", "src/shared/types");
moveFolderContents("src/constants", "src/shared/utils/constants");
moveFolderContents("src/helpers", "src/shared/utils/helpers");
moveFolderContents("src/locales", "src/app/assets/locales");
moveFolderContents("src/assets", "src/app/assets");

moveFile("src/App.tsx", "src/app/App.tsx");
moveFile("src/main.tsx", "src/app/index.tsx");
moveFile("src/routes/index.tsx", "src/app/routes.tsx");
moveFile("src/config.jsx", "src/config/api.ts");
moveFile("src/store/index.js", "src/app/store.ts");
moveFile("src/setupTests.jsx", "src/tests/setupTests.ts");

// 2. Delete unused files
const unusedFiles = [
  "src/app/assets/images/companies/index.js",
  "src/app/assets/images/companies/line.svg",
  "src/app/assets/images/companies/mailchimp.svg",
  "src/app/assets/images/companies/reddit.svg",
  "src/app/assets/images/companies/sass.svg",
  "src/app/assets/images/companies/spotify.svg",
  "src/app/assets/images/companies/upwork.svg",
  "src/app/assets/images/companies/wechat.svg",
  "src/app/assets/images/companies/wordpress.svg",
  "src/app/assets/images/favicon.ico",
  "src/app/assets/images/index.js",
  "src/app/assets/images/jobs.png",
  "src/app/assets/images/laptop-img.png",
  "src/app/assets/images/maintenance.svg",
  "src/app/assets/images/verification-img.png",
  "src/app/assets/images/error-img.png",
  "src/app/assets/images/coming-soon.svg",
];

unusedFiles.forEach(deleteFile);

console.log(
  "Full migration complete. Please update your import paths and test your app."
);

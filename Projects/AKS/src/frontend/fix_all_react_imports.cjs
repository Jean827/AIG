const fs = require('fs');
const path = require('path');

// 需要检查的目录
const PAGES_DIR = path.resolve('./src/pages');

// 读取目录下所有JSX文件
function getAllJsxFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = [...files, ...getAllJsxFiles(fullPath)];
    } else if (entry.isFile() && entry.name.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 修复文件
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已经导入React
  if (!content.includes('import React') && !content.includes('from \'react\'')) {
    // 在文件开头添加导入语句
    content = 'import React, { useState, useEffect } from \'react\';\n' + content;
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  
  return false;
}

// 主函数
function main() {
  const jsxFiles = getAllJsxFiles(PAGES_DIR);
  console.log(`Found ${jsxFiles.length} JSX files to check.`);
  
  let fixedCount = 0;
  for (const file of jsxFiles) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`Fixed ${fixedCount} files with missing React imports.`);
}

main();
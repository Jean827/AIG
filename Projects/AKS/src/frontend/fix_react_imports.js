import fs from 'fs';
import path from 'path';

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

// 检查文件是否需要添加React导入
function needsReactImport(content) {
  // 检查是否已经导入React
  if (content.includes('import React') || content.includes('import React,')) {
    return false;
  }
  
  // 检查是否使用了React相关的语法或hooks
  const usesReactFeatures = 
    content.includes('useState') ||
    content.includes('useEffect') ||
    content.includes('useContext') ||
    content.includes('useReducer') ||
    content.includes('useRef') ||
    content.includes('useMemo') ||
    content.includes('useCallback') ||
    content.includes('useLayoutEffect') ||
    /<[A-Z]/.test(content) || // 检查JSX标签
    content.includes('React.') ||
    content.includes('Component');
  
  return usesReactFeatures;
}

// 检查文件中使用了哪些hooks
function getUsedHooks(content) {
  const hooks = [];
  
  if (content.includes('useState')) hooks.push('useState');
  if (content.includes('useEffect')) hooks.push('useEffect');
  if (content.includes('useContext')) hooks.push('useContext');
  if (content.includes('useReducer')) hooks.push('useReducer');
  if (content.includes('useRef')) hooks.push('useRef');
  if (content.includes('useMemo')) hooks.push('useMemo');
  if (content.includes('useCallback')) hooks.push('useCallback');
  if (content.includes('useLayoutEffect')) hooks.push('useLayoutEffect');
  
  return hooks;
}

// 修复文件
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (needsReactImport(content)) {
    const hooks = getUsedHooks(content);
    let importStatement = 'import React';
    
    if (hooks.length > 0) {
      importStatement += `, { ${hooks.join(', ')} }`;
    }
    
    importStatement += " from 'react';\n";
    
    // 在文件开头添加导入语句
    content = importStatement + content;
    
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
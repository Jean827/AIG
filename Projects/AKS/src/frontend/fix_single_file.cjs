const fs = require('fs');
const path = require('path');

// 手动指定要修复的文件路径
const FILE_PATH = './src/pages/basic/TownshipManagement.jsx';

function main() {
  try {
    // 读取文件内容
    let content = fs.readFileSync(FILE_PATH, 'utf8');
    console.log('Original file content preview:', content.substring(0, 200));
    
    // 检查是否已经导入React
    if (!content.includes('import React') && !content.includes('from \'react\'')) {
      // 在文件开头添加导入语句
      content = 'import React, { useState, useEffect } from \'react\';\n' + content;
      
      // 写入文件
      fs.writeFileSync(FILE_PATH, content, 'utf8');
      console.log(`Successfully fixed: ${FILE_PATH}`);
    } else {
      console.log(`File already has React import: ${FILE_PATH}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
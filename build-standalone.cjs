#!/usr/bin/env node
/**
 * 把 index.html + data/words.js 打包成可离线双击的单文件 dist/standalone.html
 * 用法：node scripts/build-standalone.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const page = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const words = fs.readFileSync(path.join(ROOT, 'data', 'words.js'), 'utf8');
const tag = '<script src="data/words.js"></script>';
if (!page.includes(tag)) {
  console.error('index.html 中未找到词库引用标签，构建失败');
  process.exit(1);
}
const out = page.replace(tag, '<script>\n' + words + '\n</script>');
const dist = path.join(ROOT, 'dist');
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'standalone.html'), out, 'utf8');
console.log('已生成 dist/standalone.html（离线单文件，可直接双击打开）');

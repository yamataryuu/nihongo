#!/usr/bin/env node
/**
 * 词库完整性校验：字段 / 级别 / 词性 / 读音 / 重复项 / 页面引用
 * 用法：node scripts/validate.cjs
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const words = require(path.join(ROOT, 'data', 'words.js'));

const VALID_LEVELS = new Set(['N5', 'N4', 'N3', 'N2', 'N1']);
const VALID_POS = new Set([
  '名词', 'サ变名词', '外来语（名词）',
  '动词（五段）', '动词（一段）', '动词（カ行变格）', 'サ变动词（〜する）',
  'い形容词', 'な形容词', '副词', '接续词・连词', '连体词', '代词',
  '感叹词', '接头辞', '接尾辞'
]);
const KANJI = /[一-龥]/;
const LATIN = /[A-Za-z]/;

const errors = [];
const seenJp = new Map();
const seenZh = new Map();

if (!Array.isArray(words)) errors.push('data/words.js 未导出数组');

words.forEach((w, i) => {
  const at = `第 ${i + 1} 条（${w && w.jp ? w.jp : '未知词形'}）`;
  for (const k of ['level', 'jp', 'kana', 'pos', 'zh']) {
    if (!w || typeof w[k] !== 'string' || !w[k].trim()) errors.push(`${at}：字段 ${k} 缺失或为空`);
  }
  if (!w) return;
  if (!VALID_LEVELS.has(w.level)) errors.push(`${at}：级别 ${w.level} 非法`);
  if (!VALID_POS.has(w.pos)) errors.push(`${at}：词性 ${w.pos} 非法`);
  if (KANJI.test(w.kana)) errors.push(`${at}：读音必须是假名，不能含汉字（${w.kana}）`);
  if (LATIN.test(w.kana)) errors.push(`${at}：读音不能含拉丁字母（${w.kana}）`);
  if (LATIN.test(w.jp)) errors.push(`${at}：词形不能含拉丁字母（${w.jp}）`);
  if (LATIN.test(w.zh)) errors.push(`${at}：译文不能含拉丁字母（${w.zh}）`);
  if (seenJp.has(w.jp)) errors.push(`${at}：词形与第 ${seenJp.get(w.jp)} 条重复`);
  if (seenZh.has(w.zh)) errors.push(`${at}：译文与第 ${seenZh.get(w.zh)} 条重复（中文题干会歧义）`);
  seenJp.set(w.jp, i + 1);
  seenZh.set(w.zh, i + 1);
});

const page = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
if (!page.includes('<script src="data/words.js"></script>')) {
  errors.push('index.html 未引用 data/words.js');
}

const levels = {};
const poses = {};
words.forEach(w => {
  levels[w.level] = (levels[w.level] || 0) + 1;
  poses[w.pos] = (poses[w.pos] || 0) + 1;
});

console.log(`总词数：${words.length}`);
console.log('分级：', levels);
console.log('词性：', Object.keys(poses).length, '类；副词 + 接续词 =',
  (poses['副词'] || 0) + (poses['接续词・连词'] || 0));

if (errors.length) {
  console.error('\n校验失败，共 ' + errors.length + ' 处：');
  errors.slice(0, 30).forEach(e => console.error('  - ' + e));
  if (errors.length > 30) console.error(`  ... 另有 ${errors.length - 30} 处`);
  process.exit(1);
}
console.log('校验通过 ✓');

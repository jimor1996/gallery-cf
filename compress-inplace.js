#!/usr/bin/env node
const fg = require('fast-glob');
const fs = require('fs/promises');
const path = require('path');

// imagemin 和 imagemin-webp 都要取 .default
const imagemin = require('imagemin').default;
const imageminWebp = require('imagemin-webp').default;

(async () => {
  try {
    // 1. 递归匹配所有 png/jpg/jpeg，absolute: true 返回绝对路径
    const files = await fg(['**/*.{png,jpg,jpeg}'], {
      onlyFiles: true,
      absolute: true
    });

    for (const file of files) {
      // 2. 调用 imagemin 处理单文件
      const [result] = await imagemin([file], {
        plugins: [imageminWebp({ quality: 75 })]
      });
      // 3. 构建输出路径：同目录，后缀改成 .webp
      const outPath = file.replace(/\.(png|jpe?g)$/i, '.webp');
      // 4. 写入文件
      await fs.writeFile(outPath, result.data);
      console.log(`✅ 压缩完成: ${path.relative(process.cwd(), outPath)}`);
    }

    console.log('🎉 全部图片已压缩为 .webp');
  } catch (err) {
    console.error('❌ 出错：', err);
  }
})();

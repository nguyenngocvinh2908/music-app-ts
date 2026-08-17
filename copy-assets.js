const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
  try {
    // Copy thư mục views vào dist/views
    await fs.copy(
      path.join(__dirname, 'views'),
      path.join(__dirname, 'dist', 'views')
    );

    // Copy thư mục public vào dist/public
    await fs.copy(
      path.join(__dirname, 'public'),
      path.join(__dirname, 'dist', 'public')
    );

    console.log('Coppy thành công views và public vào dist!');
  } catch (err) {
    console.error('Lỗi khi copy assets:', err);
    process.exit(1);
  }
}

copyAssets();
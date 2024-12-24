const express = require('express');
const path = require('path');
const app = express();

// 设置静态文件目录，例如 HTML、CSS、JavaScript 文件
app.use(express.static(path.join(__dirname, 'public')));

// 返回 HTML 页面
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 监听端口
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// 设置静态文件夹
app.use(express.static(path.join(__dirname, '../public')));

// 使用 JSON 数据中间件
app.use(express.json());

// 数据存储文件
const DB_FILE = path.join(__dirname, 'db.json');

// 初始化每日数值
let targetNumber = Math.floor(10000 + Math.random() * 90000);
let useNumber = Math.floor(1 + Math.random() * 8);
// 每天凌晨重置排行榜
setInterval(() => {
    targetNumber = Math.floor(10000 + Math.random() * 90000);
    useNumber = Math.floor(1 + Math.random() * 8);
    fs.writeFileSync(DB_FILE, JSON.stringify({ leaderboard: [] }, null, 2));
}, 24 * 60 * 60 * 1000);

// 获取每日目标数
app.get('/api/target', (req, res) => {
    res.json({ targetNumber,useNumber });
});

// 提交成绩
app.post('/api/submit', (req, res) => {
    const { username, xCount, smallScore } = req.body;
    if (!username || xCount == null || smallScore == null) {
        return res.status(400).json({ error: '参数不完整' });
    }

    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    db.leaderboard.push({ username, xCount, smallScore });
    db.leaderboard.sort((a, b) => a.xCount - b.xCount || a.smallScore - b.smallScore);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

    res.json({ message: '成绩已提交', leaderboard: db.leaderboard });
});

// 获取排行榜
app.get('/api/leaderboard', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    res.json(db.leaderboard);
});

// 启动服务
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

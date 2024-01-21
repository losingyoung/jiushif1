import mysql from 'mysql2/promise';

// 创建一个数据库连接
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'mysql',
  password: '123456',
  database: 'jiushi',
});

// 简单查询
try {
  const [results, fields] = await connection.query(
    'SHOW tables;'
  );

  console.log(results); // 结果集
  console.log(fields); // 额外的元数据（如果有的话）
} catch (err) {
  console.log(err);
}
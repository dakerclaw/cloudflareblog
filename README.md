# cloudflare-light-blog

基于 Cloudflare Workers + D1 + R2 构建的轻量级博客系统。

## 功能特性

- ✅ 文章管理（后台发布/编辑/删除）
- ✅ 文章分类
- ✅ 文章封面图片（支持 R2 对象存储）
- ✅ 前台文章列表和详情页
- ✅ 浏览次数统计
- ✅ 自动数据库初始化（D1）
- ✅ 管理员密码保护

## 技术栈

- **运行时**: Cloudflare Workers
- **数据库**: Cloudflare D1
- **对象存储**: Cloudflare R2（可选）
- **前端**: 原生 HTML + Vue 3

## 部署步骤

### 1. 克隆项目

```bash
git clone https://github.com/your-username/cloudflare-light-blog.git
cd cloudflare-light-blog
npm install
```

### 2. 创建 D1 数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **D1**
3. 点击 **Create database**
4. 输入名称 `blog-db`，点击 Create

### 3. 创建 R2 存储桶（可选）

1. 进入 **Workers & Pages** → **R2**
2. 点击 **Create bucket**
3. 输入名称 `blog-images`，点击 Create

### 4. 部署到 Cloudflare

```bash
npm run deploy
```

### 5. 绑定 D1 和 R2

部署完成后，在 Worker 设置中绑定：

**D1 数据库绑定：**
1. 进入 Worker → **Settings** → **Variables**
2. 找到 **D1 Database Bindings**
3. 点击 **Add binding**
4. 填写：
   - **Variable name**: `DB`
   - **D1 database**: 选择 `blog-db`
5. 点击 Save

**R2 存储绑定（可选）：**
1. 进入 Worker → **Settings** → **Variables**
2. 找到 **R2 Bucket Bindings**
3. 点击 **Add binding**
4. 填写：
   - **Variable name**: `R2`
   - **Bucket name**: 选择 `blog-images`
5. 点击 Save

**设置管理员密码：**
1. 在 **Environment Variables** 中添加：
   - **Variable name**: `ADMIN_PASSWORD`
   - **Value**: 你的密码
   - 勾选 **Encrypt** 加密
2. 点击 Save

### 6. 重新部署

修改环境变量后需要重新部署：

```bash
npm run deploy
```

## 目录结构

```
cloudflare-light-blog/
├── src/
│   └── worker.js      # 主程序（包含前端和后端）
├── wrangler.toml      # Cloudflare 配置
├── package.json       # 项目配置
├── .dev.vars.example  # 本地开发环境变量示例
├── .gitignore         # Git 忽略规则
└── README.md          # 说明文档
```

## API 接口

### 公开接口

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/posts | GET | 获取已发布文章列表 |
| /api/post?slug=xxx | GET | 获取文章详情 |
| /api/categories | GET | 获取分类列表 |
| /api/settings | GET | 获取网站设置 |

### 管理接口（需要认证）

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/admin/posts | GET | 获取所有文章 |
| /api/admin/post | POST | 创建文章 |
| /api/admin/post?id=xxx | PUT | 更新文章 |
| /api/admin/post?id=xxx | DELETE | 删除文章 |
| /api/upload | POST | 上传图片 |

## 访问

- 前台: `https://你的域名/`
- 后台: `https://你的域名/admin/`

## 本地开发

```bash
# 复制环境变量文件
cp .dev.vars.example .dev.vars

# 编辑 .dev.vars 填入密码

# 启动开发服务器
npm run dev
```

## 注意事项

- 首次部署时会自动创建数据库表（D1）
- 图片上传需要配置 R2 存储（可选，不配置则使用 base64 编码）
- 必须设置 ADMIN_PASSWORD 保护后台安全

## License

MIT
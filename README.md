# cloudflare-light-blog

基于 Cloudflare Workers + D1 + R2 构建的轻量级博客系统。

## 功能特性

- ✅ 文章管理（后台发布/编辑/删除）
- ✅ 文章分类
- ✅ 文章封面图片（支持 R2 对象存储）
- ✅ 前台文章列表和详情页
- ✅ **分页支持**（文章列表自动分页）
- ✅ 浏览次数统计
- ✅ 自动数据库初始化（D1）
- ✅ 管理员密码保护（HMAC + 24小时过期）
- ✅ **SEO 优化**（meta 标签、Open Graph、sitemap.xml）
- ✅ **页面缓存**（Workers Cache API）
- ✅ **模块化代码结构**
- ✅ 主题切换（动物森林 / 海洋微风）

## 技术栈

- **运行时**: Cloudflare Workers (ES Modules)
- **数据库**: Cloudflare D1
- **对象存储**: Cloudflare R2（可选）
- **前端**: 原生 HTML + Vue 3
- **部署**: GitHub → Cloudflare Workers 自动部署

## 项目结构

```
src/
├── worker.js              # 主入口（路由分发）
├── api.js                 # API 处理（分页、错误处理）
├── lib/
│   ├── utils.js           # 工具函数
│   ├── db.js              # 数据库初始化
│   ├── auth.js            # HMAC 认证
│   ├── cache.js           # Workers Cache API
│   └── image.js           # 图片处理
└── views/
    ├── frontend.js        # 前台首页
    ├── post.js            # 文章详情页
    ├── password.js        # 密码验证页
    └── admin.js           # 后台管理页
wrangler.toml              # Cloudflare 配置
```

## 部署步骤（GitHub 自动部署）

### 1. 创建 D1 数据库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **D1**
3. 点击 **Create database**，名称输入 `blog-db`
4. 复制 **Database ID**

### 2. 创建 R2 存储桶（可选）

1. 进入 **Workers & Pages** → **R2**
2. 点击 **Create bucket**，名称输入 `blog-images`

### 3. 修改 wrangler.toml

编辑 `wrangler.toml`，填入你的 D1 Database ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "blog-db"
database_id = "你的-D1-Database-ID"
```

### 4. 推送到 GitHub

```bash
git init
git add .
git commit -m "Init blog"
git remote add origin https://github.com/你的用户名/cloudflare-light-blog.git
git push -u origin main
```

### 5. 连接 Cloudflare Workers

1. Cloudflare Dashboard → **Workers & Pages** → **Create Application**
2. 选择 **Workers** → **Connect to Git**
3. 选择你的 GitHub 仓库
4. Cloudflare 会自动读取 `wrangler.toml` 配置并部署

### 6. 设置管理员密码

部署完成后，在 Worker 的 **Settings → Variables and Secrets** 中添加：

| 变量名 | 类型 | 说明 |
|--------|------|------|
| ADMIN_PASSWORD | Secret | 管理员密码 |

> ⚠️ 请使用 **Secret** 类型而非普通变量，确保密码加密存储。

### 7. 后续更新

每次推送到 GitHub `main` 分支，Cloudflare 会自动重新部署：

```bash
git add .
git commit -m "Update"
git push
```

## 访问

- 前台: `https://你的域名/`
- 后台: `https://你的域名/admin/`
- 站点地图: `https://你的域名/sitemap.xml`

## API 接口

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/posts?page=1&limit=10` | 文章列表（分页） |
| GET | `/api/post/?slug=xxx` | 文章详情 |
| GET | `/api/categories` | 分类列表 |
| GET | `/api/settings` | 网站设置 |
| GET | `/api/stats` | 统计信息 |
| GET | `/sitemap.xml` | 站点地图 |

### 管理接口（需要 Bearer Token）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/login` | 登录获取 Token |
| POST | `/api/admin/post` | 创建文章 |
| PUT | `/api/admin/post?id=x` | 更新文章 |
| DELETE | `/api/admin/post?id=x` | 删除文章 |

## License

MIT

# GitHub 上传指南

## 方法一：使用 GitHub 网页（推荐）

### 步骤 1: 创建新仓库
1. 登录 GitHub: https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写仓库名称: `gt3-racing-manager`
4. 选择 Public（公开）或 Private（私有）
5. 点击 "Create repository"

### 步骤 2: 推送代码
在本地终端执行以下命令（替换 YOUR_USERNAME 为你的 GitHub 用户名）:

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/gt3-racing-manager.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

## 方法二：使用 GitHub CLI

如果已安装 GitHub CLI:

```bash
# 验证登录状态
gh auth status

# 创建仓库（自动推送到 GitHub）
gh repo create gt3-racing-manager --public --source=. --push
```

## 方法三：使用 SSH（高级）

### 生成 SSH 密钥
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
```

### 在 GitHub 添加 SSH Key
1. 进入 GitHub Settings → SSH and GPG keys
2. 点击 "New SSH key"
3. 粘贴公钥内容
4. 保存

### 推送代码
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/gt3-racing-manager.git
git push -u origin main
```

## 验证上传

成功推送后，访问:
```
https://github.com/YOUR_USERNAME/gt3-racing-manager
```

你应该能看到所有项目文件。

## 后续更新

修改代码后，执行:
```bash
git add .
git commit -m "描述你的更改"
git push
```

## 克隆到其他设备

在其他设备上:
```bash
git clone https://github.com/YOUR_USERNAME/gt3-racing-manager.git
cd gt3-racing-manager
npm install
npm run dev
```

## 在线预览（可选）

使用 GitHub Pages 托管:

1. 进入仓库 Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, / (root)
4. Save

等待几分钟后，你的游戏将上线:
```
https://YOUR_USERNAME.github.io/gt3-racing-manager
```

或者使用 Vercel/Netlify 进行托管。

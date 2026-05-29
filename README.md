# 🏎️ GT3赛车经营模拟游戏

一款硬核的GT3赛车经营模拟游戏，采用数据驱动、策略至上的设计理念。

## ✨ 核心功能

### 🏁 比赛周时间轴系统
- 横向时间条展示比赛周进度
- 运输准备 → 车检 → 练习赛 → 排位赛 → 正赛
- 关键决策点暂停机制
- 快进控制（至下一决策点/事件/阶段）

### 🗺️ 2D赛道可视化
- Canvas渲染的赛道地图
- 实时赛车位置追踪
- 热力图显示（轮胎温度/性能/燃油）
- 弯角标记和扇区边界

### ⚙️ 模拟引擎
- 轮胎磨损与衰竭曲线
- 燃油消耗与重量影响
- 超车与事故检测
- 安全车逻辑
- Web Worker异步模拟

### 📊 经营系统
- 车手管理与Pro-Am制度
- 厂商关系与客户赛车模式
- 动态BoP平衡系统
- 资金与声望管理

### 📱 手机端适配
- 响应式设计
- 触控友好的UI
- 多视图切换

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173/

### 构建生产版本
```bash
npm run build
```

## 🛠️ 技术栈

- **前端框架**: React 18
- **语言**: TypeScript
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **构建工具**: Vite
- **Canvas渲染**: 原生Canvas API

## 📁 项目结构

```
src/
├── components/       # UI组件
│   ├── TimelineBar.tsx       # 时间轴组件
│   ├── StagePanel.tsx       # 阶段决策面板
│   ├── RaceVisualizerOptimized.tsx  # 优化版赛道可视化
│   └── ...
├── pages/            # 页面组件
│   ├── LiveRaceV2.tsx       # 新版比赛页面
│   ├── Calendar.tsx          # 日历/赛历
│   └── ...
├── engine/           # 核心模拟引擎
│   └── simulation.ts        # 比赛模拟逻辑
├── types/            # TypeScript类型定义
│   ├── game.ts              # 游戏核心类型
│   └── track.ts             # 赛道相关类型
├── utils/            # 工具函数
│   ├── timeline.ts          # 时间轴工具
│   ├── trackGenerator.ts    # 赛道生成器
│   └── ...
├── stores/           # Zustand状态管理
│   └── gameStore.ts
├── workers/          # Web Workers
│   └── simulation.worker.ts
└── data/             # 静态数据
    ├── cars.ts
    ├── drivers.ts
    └── seasons.ts
```

## 🎮 游戏玩法

1. **创建车队**: 选择厂商、建立车手阵容
2. **赛季管理**: 参加练习赛收集数据、制定策略
3. **排位赛**: 争取更好的发车位置
4. **正赛**: 实时监控、下达指令、应对突发状况
5. **赛后分析**: 查看比赛回放、调整运营策略

## 🔧 开发指南

### 添加新赛道
在 `src/utils/trackGenerator.ts` 中添加新的赛道生成函数。

### 自定义赛事
修改 `src/data/seasons.ts` 中的赛季数据。

### 扩展模拟逻辑
在 `src/engine/simulation.ts` 中扩展比赛模拟算法。

## 📄 License

MIT License

## 🙏 Credits

- 灵感来源: GT3赛事、F1 Manager、足球经理
- 使用技术: React, TypeScript, Vite, Tailwind CSS

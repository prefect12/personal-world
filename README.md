# Kade — A little world

一个可以探索的个人主页，提供三个实时 3D 世界。

- **Ocean**：驾驶帆船，穿过海面，靠近岛屿阅读个人介绍。
- **Orbit**：驾驶飞船探索行星。
- **Studio**：拖动旋转雕塑，点击进入对应内容。

## 使用

桌面使用 WASD 或方向键移动；靠近目的地后点击提示或按 Enter。手机点击 Start exploring 后显示方向按钮。所有介绍也可从顶部导航直接进入。Esc 关闭内容，Reset 返回起点。

左下角切换风格。Pause motion 暂停环境动画；系统设置为减少动态效果时默认暂停。

## 内容状态

当前是可玩的个人主页原型。名字暂用 Kade，公开链接指向 `https://github.com/prefect12`。简介、文章和其他作品已明确标成示例或待添加，没有虚构个人履历。

修改 `content.js` 可替换四个内容页面；修改 `index.html` 可替换首屏文字。

## 本地预览

```sh
python3 -m http.server 8937 --bind 127.0.0.1
```

打开 `http://127.0.0.1:8937/`。ES modules 需要通过 HTTP 访问，请不要双击 HTML 使用 `file://` 打开。

无需构建。HTML、CSS、JavaScript 和 `vendor/` 可直接托管到 GitHub Pages。Three.js 0.180.0 已保存在 `vendor/`，浏览器不依赖外部 CDN。其 MIT 许可证在 `vendor/THREE-LICENSE.txt`。

```sh
npm run check
```

## 验证范围

在 Codex 内置浏览器验证了桌面 1536×1024、默认 1280×720、手机模拟视口 390×844；完成三种场景切换、小船键盘和触控输入、靠岸打开笔记、Esc 返回、飞船移动、雕塑拖转及暂停动画。控制台未发现错误。

场景是实时渲染的低多边形模型，概念图的写实水面、星云与建筑细节没有逐像素复刻。尚未做真实手机硬件性能与多浏览器兼容性测试。

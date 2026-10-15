/* ============================================================
   main.js —— 启点图书 首页脚本（第 4 次课）
   三层分离：HTML 是骨架、CSS 是皮肤、JS 是让页面「会做事」的大脑
   所有交互都按同一个三步法写：找元素 → 绑事件 → 改状态
   ============================================================ */

console.log("你好，JS！启点图书的脚本已加载");   // 按 F12 → Console 能看到

/* ---------- 案例 A：暗色模式 ----------
   思路：JS 不逐个改颜色（太累），只在 body 上切一个类名；
   颜色变化全部交给 CSS 里的 body.dark 变量覆盖——各干各的。 */

// 1. 找元素：用 CSS 选择器锁定按钮
const modeBtn = document.querySelector("#modeBtn");

// 2. 绑事件：谁（modeBtn）+ 什么动作（click）+ 干什么（函数）
modeBtn.addEventListener("click", function () {
  // 3. 改状态：toggle = 有 dark 类就移除，没有就添加（开关灯）
  document.body.classList.toggle("dark");

  // 顺手同步按钮文字，并告知无障碍设备当前状态
  const isDark = document.body.classList.contains("dark");
  modeBtn.textContent = isDark ? "☀️ 亮色" : "🌙 暗色";
  modeBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
});

/* ---------- 动手②：回到顶部按钮 ----------
   CSS 用 position: fixed 把它钉在右下角；
   JS 只做一件事：点击后滚回页面最上方。 */

const topBtn = document.querySelector("#topBtn");

topBtn.addEventListener("click", function () {
  window.scrollTo(0, 0);   // 横向 0、纵向 0，一次到位
});

/* ---------- 案例 B：购物车计数器 ----------
   记住这个模式：状态 → 页面。
   数字显示在页面上，但真相存在变量 count 里；
   每次点击：先改 count，再让页面追上 count。 */

let count = 0;                                   // 状态：加了几本
const cart = document.querySelector("#cart");    // 页面上的显示位

// querySelectorAll 拿到的是「一组」按钮，要挨个绑事件
document.querySelectorAll(".addBtn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    count = count + 1;                           // 先改状态
    cart.textContent = "购物车 (" + count + ")"; // 再让页面追上
  });
});

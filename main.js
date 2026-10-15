/* ============================================================
   main.js —— 启点图书 首页脚本（第 4–5 次课）
   三层分离：HTML 是骨架、CSS 是皮肤、JS 是让页面「会做事」的大脑
   所有交互都按同一个三步法写：找元素 → 绑事件 → 改状态
   第 5 次课升级：页面内容由 books 数据渲染——数据是唯一真相，
   HTML 只是数据的投影。
   ============================================================ */

console.log("你好，JS！启点图书的脚本已加载");   // 按 F12 → Console 能看到

/* ---------- 案例 A：暗色模式（第 4 次课） ----------
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

/* ---------- 动手②：回到顶部按钮（第 4 次课） ----------
   CSS 用 position: fixed 把它钉在右下角；
   JS 只做一件事：点击后滚回页面最上方。 */

const topBtn = document.querySelector("#topBtn");

topBtn.addEventListener("click", function () {
  window.scrollTo(0, 0);   // 横向 0、纵向 0，一次到位
});

/* ---------- 案例 B：购物车计数器（第 4 次课） ----------
   记住这个模式：状态 → 页面。
   数字显示在页面上，但真相存在变量 count 里；
   每次点击：先改 count，再让页面追上 count。 */

let count = 0;                                   // 状态：加了几本
const cart = document.querySelector("#cart");    // 页面上的显示位

// 绑定函数单独封装：每次重新渲染后，按钮是「新」的，要重新绑
function bindAddButtons() {
  // querySelectorAll 拿到的是「一组」按钮，要挨个绑事件
  document.querySelectorAll(".addBtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      count = count + 1;                           // 先改状态
      cart.textContent = "购物车 (" + count + ")"; // 再让页面追上
    });
  });
}

/* ---------- 渲染三步套路（第 5 次课） ----------
   ① 备一个空字符串  ② 每本书拼一段  ③ 一次性 innerHTML 灌入
   为什么最后一次性灌入？循环里每 innerHTML 一次浏览器就重排一次，
   先拼完再一次赋值，只动一次 DOM——习惯从现在养成。 */

const cardsBox = document.querySelector(".cards");   // 书卡容器

function render(list) {
  // 空结果也是一种状态：搜不到时给句话，别让页面白着
  if (list.length === 0) {
    cardsBox.innerHTML = "<p class='empty'>没有找到相关图书</p>";
    return;   // 提前结束，后面的拼接不再执行
  }

  let html = "";                                       // ① 备一个空字符串
  list.forEach(function (b) {                          // ② 每本书拼一段
    // 加分项：isNew 拼「新书」角标，inStock 决定按钮还是「暂无库存」
    const badge = b.isNew ? "<span class='badge-new'>新书</span>" : "";
    const action = b.inStock
      ? "<button class='addBtn add-cart' type='button'>加入购物车</button>"
      : "<p class='stock-out'>暂无库存</p>";
    // 双引号套单引号，是拼 HTML 字符串的固定套路
    html = html + "<article class='book-card'>" + badge +
      "<div class='cover' aria-hidden='true'>封面图</div>" +
      "<div class='info'>" +
      "<h3 class='book-title'>" + b.title + "</h3>" +
      "<p class='book-author'>" + b.author + "</p>" +
      "<p class='book-price'>¥" + b.price.toFixed(2) + "</p>" +
      action +
      "</div></article>";
  });
  cardsBox.innerHTML = html;                           // ③ 一次性灌入
  bindAddButtons();   // 新卡片刚出生，购物车按钮要重新绑一遍
}

/* ---------- fetch 接口版（第 5 次课） ----------
   书单不再写死在 JS 里，而是从 books.json 拿——
   就像点外卖：发请求 → 服务器打包 → 拆餐盒（res.json()）→ 开吃（render）。
   异步铁律：要用接口数据的代码，必须写进 then 里。 */

let books = [];   // 接口数据到手前的空数组

fetch("books.json")                                  // ① 发请求
  .then(function (res) {
    return res.json();                               // ② 拆餐盒：文本转 JS 数据
  })
  .then(function (data) {
    books = data;                                    // ③ 数据到手，存起来
    render(books);                                   // ④ 渲染函数一个字没改，直接复用

    /* ---------- 实时搜索 ----------
       三步法的变体：找元素（input）→ 绑事件（input 类型）→
       改状态（过滤 + 重新渲染）。
       写在 then 里，因为搜索过滤的是接口拿回来的数据——异步铁律。 */
    const input = document.querySelector("#keyword");

    input.addEventListener("input", function () {
      const kw = input.value;                        // 当前输入内容
      // filter = 安检门：函数返回 true 的书放行，返回一个新数组
      const result = books.filter(function (b) {
        return b.title.includes(kw);
      });
      render(result);   // 清空搜索框时 kw 是 ""，includes 对谁都 true → 显示全部
    });
  });

const showImage = document.getElementById("showImage");
const questionText = document.getElementById("question");
const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");
const soundToggle = document.getElementById("soundToggle");

const noImages = [
  "images/wronged.png",
  "images/sad.png",
  "images/beg.png",
  "images/shock.png",
  "images/no.png",
  "images/really.png"
]
const noTexts = [
  "达咩~",
  "点这我会伤心",
  "求你别点",
  "再想想吧",
  "不要啊！",
  "真的吗？"
];

let name = ''
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
name = params.get('name') ? params.get('name') : ''
questionText.textContent += ` ${name}`;

// 背景音乐
const bgMusic = new Audio("多幸运.mp3");
bgMusic.loop = true;
let musicPlaying = false;

// 欢迎遮罩：点击信封后拆开并进入页面
const welcomeOverlay = document.getElementById("welcomeOverlay");
const envelopeWrapper = document.getElementById("envelopeWrapper");
welcomeOverlay.addEventListener("click", function() {
  if (envelopeWrapper.classList.contains("opening")) return;
  envelopeWrapper.classList.add("opening");
  bgMusic.play().then(() => {
    musicPlaying = true;
    soundToggle.textContent = "🔊";
    soundToggle.title = "关闭音乐";
  }).catch(() => {});
  setTimeout(() => {
    welcomeOverlay.style.opacity = "0";
  }, 300);
  setTimeout(() => {
    welcomeOverlay.style.display = "none";
  }, 1100);
});

// 声音切换按钮
soundToggle.addEventListener("click", function(e) {
  e.stopPropagation();
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    soundToggle.textContent = "🔇";
    soundToggle.title = "开启音乐";
  } else {
    bgMusic.play().then(() => {
      musicPlaying = true;
      soundToggle.textContent = "🔊";
      soundToggle.title = "关闭音乐";
    }).catch(() => {});
  }
});

let clickCount = 0;

noButton.addEventListener("click", function() {
  clickCount += 1;
  if (clickCount <= 6) {
    showImage.src = noImages[clickCount - 1]
    noButton.innerText = noTexts[clickCount - 1];
  }
  if (clickCount >= 7) {
    noButton.style.display = "none";
    return;
  }
  let yesSize = 1 + (clickCount * 1.2);
  yesButton.style.transform = `scale(${yesSize})`;
  let noOffset = clickCount * 50;
  noButton.style.transform = `translateX(${noOffset}px)`;
  let moveUp = clickCount * 25;
  showImage.style.transform = `translateY(-${moveUp}px)`;
  questionText.style.transform = `translateY(-${moveUp}px)`;
});

yesButton.addEventListener("click", function() {
  document.body.innerHTML = `
        <div class="yes-wrapper">
            <p class="yes-text">爱你哟~！</p>
            <img src="images/happy.png" alt="开心" class="yes-image">
        </div>
    `;
  createHearts();
});

// 全屏飘爱心
function createHearts() {
  const heartChars = ["❤️", "💕", "💗", "💖", "💝", "💘", "💓", "💞"];
  const total = 50;
  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.fontSize = (16 + Math.random() * 36) + "px";
      heart.style.animationDuration = (2.5 + Math.random() * 4) + "s";
      heart.style.animationDelay = "0s";
      heart.style.opacity = (0.5 + Math.random() * 0.5);
      document.body.appendChild(heart);
      setTimeout(() => { heart.remove(); }, 7000);
    }, i * 80);
  }
}

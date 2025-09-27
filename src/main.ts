declare const p5: any;
declare const gsap: any;
declare const ScrollTrigger: any;

gsap.registerPlugin(ScrollTrigger);

// 0 = 사각형, 1 = 원
const state = { progress: 0 };

// 스크롤 비율을 state.progress(0→1)에 매핑
gsap.to(state, {
  progress: 1,
  ease: "none",
  scrollTrigger: {
    trigger: "#app", // p5-canvas가 뷰포트에 들어올 때부터 반응
    start: "top top",
    end: "bottom bottom", // p5-canvas가 뷰포트에서 나갈 때까지
    scrub: 0.4, // 스크럽(스크롤 연동)
    // pin은 불필요 (이미 #p5-canvas가 CSS sticky)
  },
});

// p5 인스턴스 모드 스케치
const sketch = (p: any) => {
  let side = 0;

  p.setup = () => {
    const mount = document.getElementById("p5-canvas");
    if (!mount) throw new Error("#p5-canvas not found");

    const cnv = p.createCanvas(window.innerWidth, window.innerHeight);
    cnv.parent(mount);
    p.pixelDensity(Math.min(2, window.devicePixelRatio || 1));
    p.noStroke();
  };

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  const lerpHex = (a: string, b: string, t: number) => {
    return p.lerpColor(p.color(a), p.color(b), p.constrain(t, 0, 1));
  };

  p.draw = () => {
    p.background(17); // #111

    const t = p.constrain(state.progress, 0, 1);

    // 크기/라운딩: 정사각형 → 원
    side = Math.min(p.width, p.height) * (0.42 + 0.08 * (1 - t));
    const corner = p.lerp(0, side / 2, t);

    // 색상: teal → indigo
    const fillCol = lerpHex("#2dd4bf", "#6366f1", t);

    // 약간의 회전
    const rot = p.lerp(0, p.PI / 8, t);

    // 그림자
    const ctx = p.drawingContext as CanvasRenderingContext2D;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 16;

    // 중심 도형
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(rot);
    p.rectMode(p.CENTER);
    p.fill(fillCol);
    p.rect(0, 0, side, side, corner);
    p.pop();

    // 진행 바 (하단)
    const barW = p.width * 0.6;
    const barH = 6;
    const barX = (p.width - barW) / 2;
    const barY = p.height * 0.86;

    p.noStroke();
    p.fill(255, 255 * 0.16);
    p.rect(barX, barY, barW, barH, 3);
    p.fill(255, 255 * 0.85);
    p.rect(barX, barY, barW * t, barH, 3);

    p.fill(240);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    p.text("Rectangle", p.width * 0.2, barY - 12);
    p.text("Circle", p.width * 0.8, barY - 12);
  };

  // 옵션: 키보드로 테스트
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight")
      state.progress = Math.min(1, state.progress + 0.02);
    if (e.key === "ArrowLeft")
      state.progress = Math.max(0, state.progress - 0.02);
  });
};

// 실행
new p5(sketch);

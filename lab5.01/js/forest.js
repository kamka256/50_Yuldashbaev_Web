'use strict';

(function() {
    var canvas = document.getElementById('forestCanvas');
    var ctx = canvas.getContext('2d');
    var W, H;
    var trees = [];
    var time = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        generateTrees();
    }

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function generateTrees() {
        trees = [];

        var layers = [
            { count: 22, hMin: 80, hMax: 140, wMul: 0.38, speed: 0.18, alpha: 0.30, swayAmp: 0.00007 },
            { count: 16, hMin: 160, hMax: 260, wMul: 0.42, speed: 0.10, alpha: 0.55, swayAmp: 0.00013 },
            { count: 11, hMin: 280, hMax: 420, wMul: 0.46, speed: 0.04, alpha: 0.85, swayAmp: 0.00020 },
        ];

        layers.forEach(function(l, li) {
            for (var i = 0; i < l.count; i++) {
                var h = rnd(l.hMin, l.hMax);
                trees.push({
                    x: rnd(-60, W + 60),
                    h: h,
                    w: h * l.wMul,
                    layer: li + 1,
                    speed: l.speed,
                    alpha: l.alpha,
                    swayAmp: l.swayAmp,
                    swayOff: rnd(0, Math.PI * 2),
                    swaySpd: rnd(0.4, 0.9),
                });
            }
        });

        trees.sort(function(a, b) { return a.layer - b.layer; });
    }

    function drawFir(cx, baseY, h, w, alpha, sway) {
        var trunkH = h * 0.14;
        var trunkW = w * 0.10;
        var levels = 7;

        ctx.save();
        ctx.translate(cx, baseY);
        ctx.rotate(sway);
        ctx.translate(-cx, -baseY);

        ctx.fillStyle = 'rgba(12,6,2,' + (alpha * 0.9) + ')';
        ctx.fillRect(cx - trunkW / 2, baseY - trunkH, trunkW, trunkH + 2);

        for (var lvl = 0; lvl < levels; lvl++) {
            var t = lvl / (levels - 1);
            var yBase = baseY - trunkH - t * (h - trunkH);
            var yTop = yBase - (h - trunkH) / (levels - 1) * 1.1;
            var hw = (w / 2) * (1 - t * 0.72);
            var droop = hw * 0.18 * (1 - t);

            var col = 'rgba(' +
                Math.round(6 + (1 - alpha) * 30) + ',' +
                Math.round(18 + (1 - alpha) * 55) + ',' +
                Math.round(6 + (1 - alpha) * 20) + ',';

            ctx.beginPath();
            ctx.moveTo(cx, yTop);
            ctx.lineTo(cx - hw, yBase + droop);
            ctx.lineTo(cx, yBase - (h - trunkH) / levels * 0.25);
            ctx.closePath();
            ctx.fillStyle = col + (alpha * 0.65) + ')';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx, yTop);
            ctx.lineTo(cx + hw, yBase + droop * 0.5);
            ctx.lineTo(cx, yBase - (h - trunkH) / levels * 0.25);
            ctx.closePath();
            ctx.fillStyle = col + (alpha * 0.9) + ')';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(cx, yTop);
            ctx.lineTo(cx + hw, yBase + droop * 0.5);
            ctx.lineTo(cx - hw, yBase + droop);
            ctx.closePath();
            ctx.strokeStyle = col + Math.min(1, alpha * 1.2) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawMist(baseY, alpha) {
        var grad = ctx.createLinearGradient(0, baseY - 40, 0, baseY + 20);
        grad.addColorStop(0, 'rgba(15,8,2,0)');
        grad.addColorStop(0.6, 'rgba(15,8,2,' + (alpha * 0.35) + ')');
        grad.addColorStop(1, 'rgba(10,5,1,' + (alpha * 0.6) + ')');
        ctx.fillStyle = grad;
        ctx.fillRect(0, baseY - 40, W, 60);
    }

    function draw() {
        time += 0.012;
        ctx.clearRect(0, 0, W, H);

        var scrollY = window.scrollY;

        trees.forEach(function(t) {
            var baseY = H + scrollY * t.speed;
            if (baseY - t.h > H + 40) return;

            var sway = Math.sin(time * t.swaySpd + t.swayOff) * t.swayAmp * t.h;
            drawFir(t.x, baseY, t.h, t.w, t.alpha, sway);
        });

        drawMist(H, 1.0);

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function() { resize(); });
    resize();
    draw();
})();
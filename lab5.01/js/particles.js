'use strict';

(function () {
	var canvas  = document.getElementById('particlesCanvas');
	var ctx     = canvas.getContext('2d');
	var particles = [];
	var W, H;

	function resize() {
		W = canvas.width  = window.innerWidth;
		H = canvas.height = window.innerHeight;
	}

	function randomBetween(a, b) {
		return a + Math.random() * (b - a);
	}

	function createParticle() {
		var type = Math.random() < 0.6 ? 'ember' : 'ash';
		return {
			type:    type,
			x:       randomBetween(0, W),
			y:       randomBetween(H * 0.3, H + 20),
			size:    type === 'ember'
				? randomBetween(1.5, 3.5)
				: randomBetween(2, 5),
			speedY:  type === 'ember'
				? randomBetween(-0.6, -1.4)
				: randomBetween(-0.2, -0.7),
			speedX:  randomBetween(-0.3, 0.3),
			drift:   randomBetween(-0.008, 0.008),
			opacity: randomBetween(0.4, 1.0),
			fade:    randomBetween(0.002, 0.006),
			flicker: Math.random() < 0.4,
			angle:   randomBetween(0, Math.PI * 2),
			spin:    randomBetween(-0.03, 0.03),
			life:    1.0,
		};
	}

	function spawnParticles(count) {
		for (var i = 0; i < count; i++) {
			particles.push(createParticle());
		}
	}

	function drawEmber(p) {
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(p.angle);
		ctx.globalAlpha = p.opacity * p.life;

		var flicker = p.flicker ? 0.7 + Math.sin(Date.now() * 0.01 + p.x) * 0.3 : 1;
		ctx.globalAlpha *= flicker;

		var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2);
		grad.addColorStop(0,   'rgba(255, 200, 80, 0.95)');
		grad.addColorStop(0.4, 'rgba(220, 80, 10, 0.7)');
		grad.addColorStop(1,   'rgba(180, 30, 0, 0)');

		ctx.beginPath();
		ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
		ctx.fillStyle = grad;
		ctx.fill();

		ctx.beginPath();
		ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(255, 240, 180, 0.95)';
		ctx.fill();

		ctx.restore();
	}

	function drawAsh(p) {
		ctx.save();
		ctx.translate(p.x, p.y);
		ctx.rotate(p.angle);
		ctx.globalAlpha = p.opacity * p.life * 0.5;

		ctx.beginPath();
		ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
		ctx.fillStyle = 'rgba(180, 150, 100, 0.6)';
		ctx.fill();

		ctx.restore();
	}

	function update() {
		ctx.clearRect(0, 0, W, H);

		for (var i = particles.length - 1; i >= 0; i--) {
			var p = particles[i];

			p.x      += p.speedX;
			p.y      += p.speedY;
			p.speedX += p.drift;
			p.angle  += p.spin;
			p.life   -= p.fade;

			if (p.type === 'ember') {
				drawEmber(p);
			} else {
				drawAsh(p);
			}

			if (p.life <= 0 || p.y < -20) {
				particles.splice(i, 1);
			}
		}

		var target = Math.floor(W / 25);
		if (particles.length < target) {
			spawnParticles(2);
		}

		requestAnimationFrame(update);
	}

	window.addEventListener('resize', resize);
	resize();
	spawnParticles(40);
	update();
})();

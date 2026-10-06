(() => {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('.form-status');
  const canvas = document.querySelector('#motion-canvas');
  const context = canvas.getContext('2d');
  let animationFrame;
  let particles = [];

  const setTheme = (light) => {
    body.classList.toggle('light', light);
    themeToggle.setAttribute('aria-pressed', String(light));
    themeToggle.innerHTML = light ? '<span>☾</span>' : '<span>☼</span>';
  };

  themeToggle.addEventListener('click', () => setTheme(!body.classList.contains('light')));
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Thanks — your message is ready to send.';
    form.reset();
  });

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.max(22, Math.floor(window.innerWidth / 44)) }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2 + .5,
      speed: Math.random() * .35 + .1,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const draw = (time = 0) => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const purple = body.classList.contains('light') ? 'rgba(117,39,220,.22)' : 'rgba(157,46,255,.5)';
    particles.forEach((particle, index) => {
      particle.y -= particle.speed;
      if (particle.y < -10) particle.y = window.innerHeight + 10;
      const wave = Math.sin(time * .0005 + particle.phase) * 18;
      context.beginPath();
      context.arc(particle.x + wave, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = purple;
      context.fill();
      if (index > 0 && index % 3 === 0) {
        const previous = particles[index - 1];
        const distance = Math.hypot(particle.x - previous.x, particle.y - previous.y);
        if (distance < 150) {
          context.beginPath();
          context.moveTo(particle.x + wave, particle.y);
          context.lineTo(previous.x, previous.y);
          context.strokeStyle = body.classList.contains('light') ? 'rgba(117,39,220,.06)' : 'rgba(157,46,255,.12)';
          context.stroke();
        }
      }
    });
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) animationFrame = requestAnimationFrame(draw);
  else context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame));
})();
// Ativa o ponto do "rail" correspondente à seção visível
// e permite clicar nos pontos para navegar.

document.addEventListener('DOMContentLoaded', () => {
  const dots = document.querySelectorAll('.rail-dot');
  const sections = Array.from(dots)
    .map(dot => document.getElementById(dot.dataset.target))
    .filter(Boolean);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const dot = document.querySelector(`.rail-dot[data-target="${entry.target.id}"]`);
      if (!dot) return;
      if (entry.isIntersecting) {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
});

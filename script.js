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

  // Cards de ingresso — clicar em qualquer parte do card (não só no botão)
  // abre/fecha o painel com QR code + código Pix.
  document.querySelectorAll('.price-card').forEach(card => {
    const btn = card.querySelector('.btn-pix');
    const panel = card.querySelector('.pix-panel');
    if (!btn || !panel) return;

    card.addEventListener('click', (e) => {
      // Só ignora cliques nos elementos que precisam de comportamento próprio
      // (campo do código e botão "Copiar") — o resto do card, incluindo o
      // QR code e os textos, continua fechando/abrindo o painel normalmente.
      if (e.target.closest('.pix-code, .btn-copy')) return;

      const isHidden = panel.hasAttribute('hidden');
      if (isHidden) {
        panel.removeAttribute('hidden');
        btn.textContent = 'Ocultar Pix';
        card.classList.add('selected');
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        panel.setAttribute('hidden', '');
        btn.textContent = 'Pagar com Pix';
        card.classList.remove('selected');
      }
    });
  });

  // Botão "Copiar" — copia o código Pix para a área de transferência
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const panel = document.getElementById(btn.dataset.copyTarget);
      const input = panel ? panel.querySelector('.pix-code') : null;
      if (!input) return;
      try {
        await navigator.clipboard.writeText(input.value);
      } catch (err) {
        input.select();
        document.execCommand('copy');
      }
      const original = btn.textContent;
      btn.textContent = 'Copiado!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy');
    await navigator.clipboard.writeText(value);
    const original = button.textContent;
    button.textContent = 'Copiado';
    window.setTimeout(() => { button.textContent = original; }, 1200);
  });
});

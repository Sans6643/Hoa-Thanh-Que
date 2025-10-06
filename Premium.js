// Premium.js
// Handles selection of premium plans, keyboard navigation and persistence
document.addEventListener('DOMContentLoaded', function () {
    const planContainer = document.querySelector('.plans');
    if (!planContainer) return;

    const cards = Array.from(planContainer.querySelectorAll('.plan-card'));
    const selectedLabel = document.getElementById('selected-plan');
    const STORAGE_KEY = 'site:plan:selected';

    function clearSelection() {
        cards.forEach(c => {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
        });
    }

    function selectCard(card, dontFocus) {
        if (!card) return;
        clearSelection();
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        const planId = card.dataset.plan || '';
        const title = (card.querySelector('h2') || {}).textContent || planId;
        if (selectedLabel) selectedLabel.textContent = title.trim();
        try { localStorage.setItem(STORAGE_KEY, planId); } catch (e) { /* ignore */ }
        if (!dontFocus) card.focus();
    }

    // Click (delegation) - clicking anywhere in the card selects it
    planContainer.addEventListener('click', function (e) {
        const card = e.target.closest('.plan-card');
        if (!card) return;
        selectCard(card, true);
    });

    // Keyboard handling for accessibility
    planContainer.addEventListener('keydown', function (e) {
        const card = e.target.closest('.plan-card');
        if (!card) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectCard(card);
            return;
        }

        // Navigation between cards
        const idx = cards.indexOf(card);
        if (idx === -1) return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = cards[(idx - 1 + cards.length) % cards.length];
            prev.focus();
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const next = cards[(idx + 1) % cards.length];
            next.focus();
        }
    });

    // Restore saved plan
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const match = cards.find(c => c.dataset.plan === saved);
            if (match) selectCard(match, true);
        }
    } catch (e) { /* ignore */ }

});

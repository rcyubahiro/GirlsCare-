/* GirlsCare – Front-end JavaScript */
'use strict';

(function () {

  // ──────────────────────────────────────────────
  // Utilities
  // ──────────────────────────────────────────────
  function el(id) { return document.getElementById(id); }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }

  // ──────────────────────────────────────────────
  // Education Topics
  // ──────────────────────────────────────────────
  async function loadTopics() {
    const container = el('topics-grid');
    if (!container) return;
    try {
      const data = await fetchJSON('/education');
      if (!data.topics || data.topics.length === 0) {
        container.innerHTML = '<p class="empty-msg">No topics available yet.</p>';
        return;
      }
      container.innerHTML = data.topics.map(topic => `
        <article class="topic-card" aria-label="${escapeHtml(topic.title)}">
          <h3>${escapeHtml(topic.title)}</h3>
          <p>${escapeHtml(topic.summary)}</p>
          <div class="topic-tags">
            ${topic.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </article>
      `).join('');
    } catch (err) {
      container.innerHTML = '<p class="empty-msg">Could not load topics. Please try again later.</p>';
    }
  }

  // ──────────────────────────────────────────────
  // Anonymous Q&A
  // ──────────────────────────────────────────────
  function renderQuestions(questions) {
    const container = el('questions-list');
    if (!container) return;
    if (!questions || questions.length === 0) {
      container.innerHTML = '<p class="empty-msg">No questions yet. Be the first to ask!</p>';
      return;
    }
    container.innerHTML = questions.map(q => `
      <div class="question-item ${q.answer ? 'answered' : ''}" aria-label="Question: ${escapeHtml(q.question)}">
        <div class="question-meta">
          <span>${escapeHtml(q.category)}</span>
          <span>${new Date(q.submittedAt).toLocaleDateString()}</span>
        </div>
        <p class="question-text">${escapeHtml(q.question)}</p>
        ${q.answer
          ? `<div class="answer-block"><strong>Expert Answer:</strong> ${escapeHtml(q.answer)}</div>`
          : '<p class="loading">Awaiting expert answer…</p>'
        }
      </div>
    `).join('');
  }

  async function loadQuestions() {
    const container = el('questions-list');
    if (!container) return;
    try {
      const data = await fetchJSON('/qa');
      renderQuestions(data.questions);
    } catch (err) {
      container.innerHTML = '<p class="empty-msg">Could not load questions. Please try again later.</p>';
    }
  }

  function setupQAForm() {
    const form = el('qa-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const questionInput = el('qa-question');
      const categoryInput = el('qa-category');
      const errorMsg = el('qa-error');
      const successMsg = el('qa-success');

      const questionText = questionInput.value.trim();
      if (!questionText) {
        errorMsg.hidden = false;
        questionInput.focus();
        return;
      }
      errorMsg.hidden = true;

      try {
        const res = await fetch('/qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: questionText,
            category: categoryInput.value,
          }),
        });
        if (!res.ok) throw new Error('Submission failed');
        const data = await res.json();
        successMsg.hidden = false;
        form.reset();
        // Prepend the new (unanswered) question to the list
        const container = el('questions-list');
        if (container) {
          const newItem = document.createElement('div');
          newItem.className = 'question-item';
          newItem.innerHTML = `
            <div class="question-meta">
              <span>${escapeHtml(data.question.category)}</span>
              <span>${new Date(data.question.submittedAt).toLocaleDateString()}</span>
            </div>
            <p class="question-text">${escapeHtml(data.question.question)}</p>
            <p class="loading">Awaiting expert answer…</p>
          `;
          container.prepend(newItem);
        }
        setTimeout(() => { successMsg.hidden = true; }, 5000);
      } catch (err) {
        errorMsg.textContent = 'Could not submit your question. Please try again.';
        errorMsg.hidden = false;
      }
    });

    el('qa-question').addEventListener('input', () => {
      el('qa-error').hidden = true;
      el('qa-error').textContent = 'Please enter a question.';
    });
  }

  // ──────────────────────────────────────────────
  // Health Professionals
  // ──────────────────────────────────────────────
  function renderProfessionals(professionals) {
    const container = el('professionals-grid');
    if (!container) return;
    if (!professionals || professionals.length === 0) {
      container.innerHTML = '<p class="empty-msg">No professionals found for this specialty.</p>';
      return;
    }
    container.innerHTML = professionals.map(p => {
      const initials = p.name.split(' ').map(w => w[0]).slice(0, 2).join('');
      return `
        <div class="pro-card card" aria-label="Professional: ${escapeHtml(p.name)}">
          <div class="pro-avatar">${escapeHtml(initials)}</div>
          <p class="pro-name">${escapeHtml(p.name)}</p>
          <span class="pro-specialty">${escapeHtml(p.specialty)}</span>
          <p class="pro-credentials">${escapeHtml(p.credentials)}</p>
          <p class="pro-bio">${escapeHtml(p.bio)}</p>
          <span class="availability ${p.available ? 'available' : 'unavailable'}">
            ${p.available ? '✅ Available for consultation' : '⏸ Currently unavailable'}
          </span>
          ${p.available ? `<a href="${escapeHtml(p.contact.url)}" class="btn btn-purple" style="margin-top:0.5rem">${escapeHtml(p.contact.type)}</a>` : ''}
        </div>
      `;
    }).join('');
  }

  async function loadProfessionals(specialty = '') {
    const container = el('professionals-grid');
    if (!container) return;
    container.innerHTML = '<p class="loading">Loading professionals…</p>';
    try {
      const url = specialty ? `/professionals?specialty=${encodeURIComponent(specialty)}` : '/professionals';
      const data = await fetchJSON(url);
      renderProfessionals(data.professionals);
    } catch (err) {
      container.innerHTML = '<p class="empty-msg">Could not load professionals. Please try again later.</p>';
    }
  }

  function setupProfessionalsFilter() {
    const filter = el('specialty-filter');
    if (!filter) return;
    filter.addEventListener('change', () => {
      loadProfessionals(filter.value);
    });
  }

  // ──────────────────────────────────────────────
  // Resources
  // ──────────────────────────────────────────────
  async function loadResources() {
    const container = el('resources-grid');
    if (!container) return;
    try {
      const data = await fetchJSON('/resources');
      if (!data.resources || data.resources.length === 0) {
        container.innerHTML = '<p class="empty-msg">No resources available yet.</p>';
        return;
      }
      container.innerHTML = data.resources.map(r => `
        <div class="resource-card" aria-label="Resource: ${escapeHtml(r.title)}">
          <span class="resource-type">${escapeHtml(r.type)}</span>
          <h3>${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.description)}</p>
          <div class="topic-tags">
            ${r.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
          </div>
          <a href="${escapeHtml(r.url)}" class="btn btn-purple" style="margin-top:0.5rem;align-self:flex-start">View Resource</a>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = '<p class="empty-msg">Could not load resources. Please try again later.</p>';
    }
  }

  // ──────────────────────────────────────────────
  // Init
  // ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    loadTopics();
    loadQuestions();
    setupQAForm();
    loadProfessionals();
    setupProfessionalsFilter();
    loadResources();
  });

})();

const STORAGE_KEY = 'inspireme-daily-v1';

const selectors = {
  quote: document.getElementById('quote-of-day'),
  quoteAuthor: document.getElementById('quote-author'),
  heroButtons: document.querySelectorAll('[data-scroll]'),
  activityForm: document.getElementById('activity-form'),
  activityList: document.getElementById('activity-list'),
  emptyActivities: document.getElementById('empty-activities'),
  categoryPills: document.getElementById('category-pills'),
  categoryList: document.getElementById('category-list'),
  personForm: document.getElementById('person-form'),
  personGrid: document.getElementById('person-grid'),
  notificationsRange: document.getElementById('notifications-count'),
  notificationsDisplay: document.getElementById('count-display'),
  generatePlan: document.getElementById('generate-plan'),
  notificationList: document.getElementById('notification-list'),
  emptyPlan: document.getElementById('empty-plan'),
  futureForm: document.getElementById('future-form'),
  futureList: document.getElementById('future-list'),
  portfolioForm: document.getElementById('portfolio-form'),
  portfolioGrid: document.getElementById('portfolio-grid'),
  chips: document.querySelectorAll('.chip')
};

const basePeople = [
  {
    id: crypto.randomUUID(),
    name: 'Maya Angelou',
    category: 'Life',
    notes: 'Warmth, resilience, and clarity.',
    inspirations: [
      'Try to be a rainbow in someone\'s cloud.',
      'You may not control all the events that happen to you, but you can decide not to be reduced by them.',
      'Courage allows the successful woman to fail and learn powerful lessons.'
    ]
  },
  {
    id: crypto.randomUUID(),
    name: 'Professor Kim',
    category: 'Study',
    notes: 'Guides research mindset and curiosity.',
    inspirations: [
      'Depth beats speed—give yourself time to think.',
      'Map the question before chasing the answer.',
      'A good hypothesis is a compass, not a cage.'
    ]
  },
  {
    id: crypto.randomUUID(),
    name: 'Serena W.',
    category: 'Gym',
    notes: 'Quiet accountability with joyful energy.',
    inspirations: [
      'One more rep is one more vote for your future self.',
      'Start with mobility; power arrives after you warm up.',
      'Consistency is a kindness to your body.'
    ]
  },
  {
    id: crypto.randomUUID(),
    name: 'Ada, your mentor',
    category: 'Work',
    notes: 'Strategic calm under pressure.',
    inspirations: [
      'Focus on the decisive 20% of tasks that shift the week.',
      'Feedback is data; give it room to breathe.',
      'Protect deep work like a meeting with your favorite person.'
    ]
  }
];

const defaultState = {
  categories: ['Work', 'Study', 'Gym', 'Life', 'Self-care'],
  activities: [],
  people: basePeople,
  notificationsPerDay: 3,
  notifications: [],
  futureNotes: [],
  portfolio: [],
  quoteOfDay: null
};

let state = structuredClone(defaultState);

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    state = {
      ...structuredClone(defaultState),
      ...parsed,
      categories: Array.isArray(parsed.categories) ? parsed.categories : defaultState.categories,
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
      people: Array.isArray(parsed.people) ? parsed.people : basePeople,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      futureNotes: Array.isArray(parsed.futureNotes) ? parsed.futureNotes : [],
      portfolio: Array.isArray(parsed.portfolio) ? parsed.portfolio : [],
      quoteOfDay: parsed.quoteOfDay || null
    };
  } catch (error) {
    console.warn('Could not load saved data', error);
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to save progress', error);
  }
}

function scrollToTarget() {
  selectors.heroButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function ensureCategory(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  if (!state.categories.includes(trimmed)) {
    state.categories.push(trimmed);
  }
}

function renderCategories() {
  selectors.categoryPills.innerHTML = '';
  selectors.categoryList.innerHTML = '';
  state.categories.forEach((cat) => {
    const pill = document.createElement('span');
    pill.className = 'pill';
    const count = state.activities.filter((item) => item.category === cat).length;
    pill.textContent = `${cat} · ${count}`;
    selectors.categoryPills.appendChild(pill);

    const option = document.createElement('option');
    option.value = cat;
    selectors.categoryList.appendChild(option);
  });
}

function renderActivities() {
  selectors.activityList.innerHTML = '';
  if (!state.activities.length) {
    selectors.emptyActivities.hidden = false;
    return;
  }
  selectors.emptyActivities.hidden = true;
  state.activities
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .forEach((item) => {
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.innerHTML = `<strong>${item.title}</strong><small>${item.category} • ${item.time}</small>`;
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = item.category;
      li.append(text, tag);
      selectors.activityList.appendChild(li);
    });
}

function renderPeople() {
  selectors.personGrid.innerHTML = '';
  state.people.forEach((person) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${person.name}</strong>
      <small>${person.category}</small>
      <small class="meta">${person.notes || 'Soft encouragement ready to send.'}</small>
      <small class="meta">${person.inspirations.length} saved inspirations</small>
    `;
    selectors.personGrid.appendChild(li);
  });
}

function renderQuoteOfDay() {
  const today = new Date().toISOString().slice(0, 10);
  if (!state.quoteOfDay || state.quoteOfDay.date !== today) {
    const allInspirations = state.people.flatMap((person) =>
      person.inspirations.map((text) => ({ text, author: person.name }))
    );
    if (!allInspirations.length) return;
    const selected = allInspirations[Math.floor(Math.random() * allInspirations.length)];
    state.quoteOfDay = { ...selected, date: today };
    persistState();
  }
  selectors.quote.querySelector('p').textContent = state.quoteOfDay.text;
  selectors.quoteAuthor.textContent = state.quoteOfDay.author;
}

function renderNotifications() {
  selectors.notificationList.innerHTML = '';
  if (!state.notifications.length) {
    selectors.emptyPlan.hidden = false;
    return;
  }
  selectors.emptyPlan.hidden = true;
  state.notifications.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${item.title}</strong><small>${item.time} • ${item.person}</small></span>
      <span class="tag">${item.category}</span>
    `;
    selectors.notificationList.appendChild(li);
  });
}

function renderFutureNotes() {
  selectors.futureList.innerHTML = '';
  if (!state.futureNotes.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Schedule a note to your future self.';
    selectors.futureList.appendChild(empty);
    return;
  }

  state.futureNotes
    .slice()
    .sort((a, b) => new Date(a.deliverAt) - new Date(b.deliverAt))
    .forEach((note) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span><strong>${note.title}</strong><small>${new Date(note.deliverAt).toLocaleString()}</small></span>
        <small>${note.message}</small>
      `;
      selectors.futureList.appendChild(li);
    });
}

function renderPortfolio(filter = 'all') {
  selectors.portfolioGrid.innerHTML = '';
  const entries = filter === 'all' ? state.portfolio : state.portfolio.filter((item) => item.type === filter);
  if (!entries.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No entries yet—share a thought or poem.';
    selectors.portfolioGrid.appendChild(empty);
    return;
  }

  entries
    .slice()
    .reverse()
    .forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${item.type.toUpperCase()}</strong>
        <small class="meta">Visibility: ${item.visibility}</small>
        <p>${item.content}</p>
      `;
      selectors.portfolioGrid.appendChild(li);
    });
}

function syncAndRender() {
  persistState();
  renderCategories();
  renderActivities();
  renderPeople();
  renderQuoteOfDay();
  renderNotifications();
  renderFutureNotes();
  renderPortfolio(currentFilter);
}

function addActivity(event) {
  event.preventDefault();
  const data = new FormData(selectors.activityForm);
  const title = data.get('title').trim();
  const category = data.get('category').trim();
  const time = data.get('time');
  if (!title || !category || !time) return;
  ensureCategory(category);
  state.activities.push({
    id: crypto.randomUUID(),
    title,
    category,
    time
  });
  selectors.activityForm.reset();
  syncAndRender();
}

function addPerson(event) {
  event.preventDefault();
  const data = new FormData(selectors.personForm);
  const name = data.get('name').trim();
  const category = data.get('category').trim();
  if (!name || !category) return;
  ensureCategory(category);
  state.people.push({
    id: crypto.randomUUID(),
    name,
    category,
    notes: data.get('notes').trim(),
    inspirations: ['A fresh note just for you.']
  });
  selectors.personForm.reset();
  syncAndRender();
}

function addFutureNote(event) {
  event.preventDefault();
  const data = new FormData(selectors.futureForm);
  const title = data.get('title').trim();
  const message = data.get('message').trim();
  const deliverAt = data.get('deliverAt');
  if (!title || !message || !deliverAt) return;
  state.futureNotes.push({
    id: crypto.randomUUID(),
    title,
    message,
    deliverAt
  });
  selectors.futureForm.reset();
  syncAndRender();
}

let currentFilter = 'all';

function handleChipFiltering() {
  selectors.chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      selectors.chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderPortfolio(currentFilter);
    });
  });
}

function addPortfolioEntry(event) {
  event.preventDefault();
  const data = new FormData(selectors.portfolioForm);
  const content = data.get('content').trim();
  if (!content) return;
  state.portfolio.push({
    id: crypto.randomUUID(),
    content,
    type: data.get('type'),
    visibility: data.get('visibility'),
    createdAt: new Date().toISOString()
  });
  selectors.portfolioForm.reset();
  renderPortfolio(currentFilter);
  persistState();
}

function findMatchForCategory(category) {
  const matchingPeople = state.people.filter((person) => person.category.toLowerCase() === category.toLowerCase());
  if (!matchingPeople.length) return null;
  const person = matchingPeople[Math.floor(Math.random() * matchingPeople.length)];
  const inspiration = person.inspirations[Math.floor(Math.random() * person.inspirations.length)];
  return { person: person.name, text: inspiration, category: person.category };
}

function generateNotifications() {
  const desired = Number(selectors.notificationsRange.value) || state.notificationsPerDay;
  state.notificationsPerDay = desired;
  const matches = [];

  const sortedActivities = state.activities.slice().sort((a, b) => a.time.localeCompare(b.time));
  sortedActivities.forEach((activity) => {
    const inspiration = findMatchForCategory(activity.category);
    if (inspiration) {
      matches.push({
        title: inspiration.text,
        person: inspiration.person,
        category: activity.category,
        time: activity.time
      });
    }
  });

  if (!matches.length) {
    state.notifications = [];
    syncAndRender();
    return;
  }

  state.notifications = matches.slice(0, desired);
  syncAndRender();
}

function setupRange() {
  selectors.notificationsDisplay.textContent = selectors.notificationsRange.value;
  selectors.notificationsRange.addEventListener('input', () => {
    selectors.notificationsDisplay.textContent = selectors.notificationsRange.value;
  });
}

function init() {
  loadState();
  scrollToTarget();
  setupRange();
  renderQuoteOfDay();
  renderCategories();
  renderActivities();
  renderPeople();
  renderNotifications();
  renderFutureNotes();
  renderPortfolio();
  const defaultChip = document.querySelector('.chip[data-filter="all"]');
  if (defaultChip) defaultChip.classList.add('active');

  selectors.activityForm.addEventListener('submit', addActivity);
  selectors.personForm.addEventListener('submit', addPerson);
  selectors.generatePlan.addEventListener('click', generateNotifications);
  selectors.futureForm.addEventListener('submit', addFutureNote);
  selectors.portfolioForm.addEventListener('submit', addPortfolioEntry);
  handleChipFiltering();
}

document.addEventListener('DOMContentLoaded', init);

// Travel Planner Application JavaScript

// Global state
let currentTrips = [];
let currentTripData = {};
let currentLanguage = localStorage.getItem('travelLanguage') || 'en';
let selectedTripId = null;

// API
const apiBase = localStorage.getItem('travelApiBase') || 'http://localhost:8000';

async function apiRequest(path, options = {}) {
    const url = `${apiBase}${path}`;
    const headers = options.headers || {};
    headers['Content-Type'] = 'application/json';
    try {
        const res = await fetch(url, { ...options, headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('API error', err);
        throw err;
    }
}

// Internationalization
const translations = {
    en: {
        app: { title: "TravelPlanner" },
        nav: { newTrip: "New Trip", backToHome: "Back to Home" },
        home: {
            hero: {
                title: "Plan Your Dream Adventure",
                subtitle: "Create detailed itineraries, manage budgets, and organize every aspect of your journey",
                stats: { anywhere: "Plan trips anywhere", flexible: "Flexible duration", budget: "Budget tracking" },
                startButton: "Start Planning", floatingCard: "Ready to explore?"
            },
            features: {
                title: "Why Choose TravelPlanner?",
                itineraries: { title: "Smart Itineraries", description: "Create detailed day-by-day plans with our intuitive template system" },
                budget: { title: "Budget Management", description: "Track expenses and stay within your travel budget" },
                group: { title: "Group Planning", description: "Plan trips with friends and family seamlessly" },
                cloud: { title: "Cloud Sync", description: "Access your plans from anywhere, anytime" }
            },
            myTrips: { title: "My Trips", empty: "No trips yet. Create your first one!" }
        },
        trip: {
            create: { title: "Create New Trip", subtitle: "Fill out the details below to start planning your adventure" },
            saveButton: "Save Trip",
            updateButton: "Update Trip",
            form: {
                basicInfo: {
                    title: "Basic Information", tripName: "Trip Name *", tripNamePlaceholder: "e.g., Summer in Paris",
                    destination: "Where are we going? *", destinationPlaceholder: "e.g., Paris, France",
                    tripType: "Trip Type", startDate: "Start Date *", duration: "How many days? *", durationPlaceholder: "7",
                    tripTypes: { vacation: "Vacation", business: "Business", adventure: "Adventure", cultural: "Cultural", relaxation: "Relaxation" }
                },
                budget: {
                    title: "Budget & Costs", totalBudget: "What's the budget? *", totalBudgetPlaceholder: "1000.00", currency: "Currency",
                    flightTickets: {
                        title: "Flight Tickets",
                        passengerName: "Passenger Name",
                        passengerNamePlaceholder: "e.g., John Doe",
                        ticketCost: "Ticket Cost",
                        ticketCostPlaceholder: "250.00",
                        ticketLink: "Airline Ticket Link",
                        ticketLinkPlaceholder: "https://airline.com/ticket/...",
                        addTicket: "Add Another Ticket",
                        removeTicket: "Remove Last Ticket",
                        totalCost: "Total Flight Cost: "
                    },
                    breakdown: {
                        title: "Budget Breakdown",
                        accommodation: "Accommodation", accommodationPlaceholder: "300.00",
                        transportation: "Transportation", transportationPlaceholder: "200.00",
                        food: "Food & Dining", foodPlaceholder: "250.00",
                        activities: "Activities & Entertainment", activitiesPlaceholder: "150.00"
                    }
                },
                travelers: {
                    title: "Travelers & Accommodation", count: "Number of Travelers", countPlaceholder: "2",
                    accommodationType: "Preferred Accommodation", specialRequirements: "Special Requirements",
                    specialRequirementsPlaceholder: "Any special needs, accessibility requirements, or preferences...",
                    accommodationTypes: { hotel: "Hotel", hostel: "Hostel", airbnb: "Airbnb", resort: "Resort", camping: "Camping" }
                },
                details: {
                    title: "Trip Details & Notes", description: "Trip Description",
                    descriptionPlaceholder: "Describe your trip goals, what you want to experience, and any specific highlights...",
                    mustSee: "Must-See Attractions", mustSeePlaceholder: "List the top attractions or experiences you don't want to miss...",
                    additionalNotes: "Additional Notes", additionalNotesPlaceholder: "Any other important information, reminders, or notes..."
                },
                actions: { cancel: "Cancel", create: "Create Trip" }
            },
            detail: {
                saveChanges: "Save Changes",
                notes: { title: "Notes", placeholder: "Write your plans, ideas, packing list, etc." },
                important: { title: "Important", add: "Add", placeholder: "Add important item..." },
                basic: { title: "Basic information" }
            }
        },
        notifications: {
            tripSaved: "Trip saved successfully! 🎉",
            budgetExceeded: "Budget breakdown exceeds total budget!",
            fillRequired: "Please fill in {field}",
            errors: { tripname: "Trip Name", destination: "Destination", startdate: "Start Date", duration: "Duration", totalbudget: "Total Budget" }
        }
    },
    ru: {
        app: { title: "DIVAN" },
        nav: { newTrip: "Новое Путешествие", backToHome: "Назад на Главную" },
        home: {
            hero: {
                title: "Планируйте Свою Мечту",
                subtitle: "Создавайте детальные маршруты, управляйте бюджетом и организуйте каждый аспект вашего путешествия",
                stats: { anywhere: "Планируйте поездки куда угодно", flexible: "Гибкая продолжительность", budget: "Отслеживание бюджета" },
                startButton: "Начать Планирование", floatingCard: "Готовы к приключениям?"
            },
            features: {
                title: "Почему Выбирают Нас?",
                itineraries: { title: "Умные Маршруты", description: "Создавайте детальные планы по дням с нашей интуитивной системой шаблонов" },
                budget: { title: "Управление Бюджетом", description: "Отслеживайте расходы и оставайтесь в рамках бюджета" },
                group: { title: "Групповое Планирование", description: "Планируйте поездки с друзьями и семьей без проблем" },
                cloud: { title: "Облачная Синхронизация", description: "Доступ к вашим планам откуда угодно и когда угодно" }
            },
            myTrips: { title: "Мои поездки", empty: "Пока нет поездок. Создайте первую!" }
        },
        trip: {
            create: { title: "Создать Новое Путешествие", subtitle: "Заполните детали ниже, чтобы начать планирование вашего приключения" },
            saveButton: "Сохранить Поездку",
            updateButton: "Сохранить Изменения",
            form: {
                basicInfo: {
                    title: "Основная Информация", tripName: "Название Поездки *", tripNamePlaceholder: "например, Лето в Париже",
                    destination: "Куда мы едем? *", destinationPlaceholder: "например, Париж, Франция",
                    tripType: "Тип Поездки", startDate: "Дата Начала *", duration: "Сколько дней? *", durationPlaceholder: "7",
                    tripTypes: { vacation: "Отпуск", business: "Деловая", adventure: "Приключение", cultural: "Культурная", relaxation: "Отдых" }
                },
                budget: {
                    title: "Бюджет и Расходы", totalBudget: "Какой бюджет? *", totalBudgetPlaceholder: "1000.00", currency: "Валюта",
                    flightTickets: {
                        title: "Билеты на Самолет",
                        passengerName: "Имя Пассажира",
                        passengerNamePlaceholder: "например, Джон Доу",
                        ticketCost: "Стоимость Билета",
                        ticketCostPlaceholder: "250.00",
                        ticketLink: "Ссылка на Билет",
                        ticketLinkPlaceholder: "https://airline.com/ticket/...",
                        addTicket: "Добавить Еще Билет",
                        removeTicket: "Удалить Последний Билет",
                        totalCost: "Общая Стоимость Перелетов: "
                    },
                    breakdown: {
                        title: "Детализация Бюджета",
                        accommodation: "Проживание", accommodationPlaceholder: "300.00",
                        transportation: "Транспорт", transportationPlaceholder: "200.00",
                        food: "Питание", foodPlaceholder: "250.00",
                        activities: "Развлечения", activitiesPlaceholder: "150.00"
                    }
                },
                travelers: {
                    title: "Путешественники и Проживание", count: "Количество Путешественников", countPlaceholder: "2",
                    accommodationType: "Предпочтительное Проживание", specialRequirements: "Особые Требования",
                    specialRequirementsPlaceholder: "Любые особые потребности, требования доступности или предпочтения...",
                    accommodationTypes: { hotel: "Отель", hostel: "Хостел", airbnb: "Airbnb", resort: "Курорт", camping: "Кемпинг" }
                },
                details: {
                    title: "Детали Поездки и Заметки", description: "Описание Поездки",
                    descriptionPlaceholder: "Опишите цели поездки, что вы хотите испытать и конкретные моменты...",
                    mustSee: "Обязательно Посмотреть", mustSeePlaceholder: "Перечислите главные достопримечательности или впечатления, которые нельзя пропустить...",
                    additionalNotes: "Дополнительные Заметки", additionalNotesPlaceholder: "Любая другая важная информация, напоминания или заметки..."
                },
                actions: { cancel: "Отмена", create: "Создать Поездку" }
            },
            detail: {
                saveChanges: "Сохранить изменения",
                notes: { title: "Заметки", placeholder: "Пишите планы, идеи, список вещей и т.д." },
                important: { title: "Важно", add: "Добавить", placeholder: "Добавьте важный пункт..." },
                basic: { title: "Основная информация" }
            }
        },
        notifications: {
            tripSaved: "Поездка успешно сохранена! 🎉",
            budgetExceeded: "Детализация бюджета превышает общий бюджет!",
            fillRequired: "Пожалуйста, заполните {field}",
            errors: { tripname: "Название Поездки", destination: "Направление", startdate: "Дата Начала", duration: "Продолжительность", totalbudget: "Общий Бюджет" }
        }
    }
};

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const createTripScreen = document.getElementById('create-trip-screen');
const tripForm = document.getElementById('trip-form');
const tripDetailScreen = document.getElementById('trip-detail-screen');

// Language Management
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('travelLanguage', lang);
    updateLanguageButtons();
    applyTranslations();
    document.documentElement.lang = lang;
}

function updateLanguageButtons() {
    const langButtons = document.querySelectorAll('[id^="lang-"]');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === `lang-${currentLanguage}` || btn.id === `lang-${currentLanguage}-2` || btn.id === `lang-${currentLanguage}-3`) {
            btn.classList.add('active');
        }
    });
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) element.textContent = translation;
    });

    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key);
        if (translation) element.placeholder = translation;
    });

    // Trip detail placeholders
    const detailNotes = document.getElementById('detail-notes');
    if (detailNotes) detailNotes.placeholder = t('trip.detail.notes.placeholder');
    const importantInput = document.getElementById('important-input');
    if (importantInput) importantInput.placeholder = t('trip.detail.important.placeholder');
}

function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) value = value[k]; else return null;
    }
    return value;
}

function t(key, params = {}) {
    let translation = getTranslation(key);
    if (!translation) return key;
    Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
    });
    return translation;
}

// Screen Navigation
function showHome() {
    homeScreen.classList.add('active');
    createTripScreen.classList.remove('active');
    tripDetailScreen.classList.remove('active');
    resetForm();
    loadTrips();
}

function showCreateTrip(tripData = null) {
    homeScreen.classList.remove('active');
    tripDetailScreen.classList.remove('active');
    createTripScreen.classList.add('active');
    
    if (tripData) {
        // Editing existing trip
        populateFormWithTripData(tripData);
        // Update button text
        const saveButton = document.querySelector('#create-trip-screen .btn-primary');
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-save"></i><span data-i18n="trip.updateButton">Update Trip</span>';
        }
    } else {
        // Creating new trip
        resetForm();
        setDefaultDates();
        // Reset flight tickets to one empty ticket
        const container = document.getElementById('flight-tickets-container');
        if (container) {
            container.innerHTML = '';
            addFlightTicket();
        }
        // Reset button text
        const saveButton = document.querySelector('#create-trip-screen .btn-primary');
        if (saveButton) {
            saveButton.innerHTML = '<i class="fas fa-check"></i><span data-i18n="trip.form.actions.create">Create Trip</span>';
        }
    }
}

function showTripDetail(trip) {
    selectedTripId = trip.id;
    homeScreen.classList.remove('active');
    createTripScreen.classList.remove('active');
    tripDetailScreen.classList.add('active');

    document.getElementById('detail-title').textContent = `${trip.tripName} — ${trip.destination}`;
    document.getElementById('detail-subtitle').textContent = `${trip.startDate} • ${trip.duration}d • ${trip.totalBudget} ${trip.currency || ''}`;

    document.getElementById('detail-notes').value = trip.notes || '';

    const basic = document.getElementById('detail-basic');
    basic.innerHTML = `
        <div class="card" style="padding:0.75rem;">
            <div><strong>${t('trip.form.basicInfo.tripName').replace(' *','')}:</strong> ${trip.tripName}</div>
            <div><strong>${t('trip.form.basicInfo.destination').replace(' *','')}:</strong> ${trip.destination}</div>
            <div><strong>${t('trip.form.basicInfo.tripType')}:</strong> ${trip.tripType || '-'}</div>
            <div><strong>${t('trip.form.basicInfo.startDate').replace(' *','')}:</strong> ${trip.startDate}</div>
            <div><strong>${t('trip.form.basicInfo.duration').replace(' *','')}:</strong> ${trip.duration}</div>
            <div><strong>${t('trip.form.budget.totalBudget').replace(' *','')}:</strong> ${trip.totalBudget} ${trip.currency || ''}</div>
        </div>
    `;

    const list = document.getElementById('important-list');
    list.innerHTML = '';
    (trip.important || []).forEach(item => {
        const el = document.createElement('div');
        el.className = 'important-item';
        el.innerHTML = `<span>${item.content}</span>
            <div class="important-actions">
                <button class="btn btn-text" onclick="removeImportantItem(${item.id})" title="Delete"><i class="fas fa-trash"></i></button>
            </div>`;
        list.appendChild(el);
    });
}

// Form Management
function setDefaultDates() {
    const startDateInput = document.getElementById('start-date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    startDateInput.value = tomorrow.toISOString().split('T')[0];
}

function resetForm() {
    if (tripForm) tripForm.reset();
    currentTripData = {};
    
    // Reset flight tickets to one empty ticket
    const container = document.getElementById('flight-tickets-container');
    if (container) {
        container.innerHTML = '';
        addFlightTicket();
    }
}

// Validation
function validateForm() {
    const requiredFields = [ 'trip-name', 'destination', 'start-date', 'duration', 'total-budget' ];
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error');
            const fieldName = t(`notifications.errors.${fieldId.replace('-', '')}`);
            showNotification(t('notifications.fillRequired', { field: fieldName }), 'error');
            return false;
        } else {
            field.classList.remove('error');
        }
    }

    const totalBudget = parseFloat(document.getElementById('total-budget').value);
    const a = parseFloat(document.getElementById('accommodation-budget').value) || 0;
    const tr = parseFloat(document.getElementById('transportation-budget').value) || 0;
    const f = parseFloat(document.getElementById('food-budget').value) || 0;
    const ac = parseFloat(document.getElementById('activities-budget').value) || 0;
    if (a + tr + f + ac > totalBudget) {
        showNotification(t('notifications.budgetExceeded'), 'error');
        return false;
    }
    return true;
}

// Data Collection
function collectTripData() {
    const formData = new FormData(tripForm);
    const tripData = {};
    for (const [key, value] of formData.entries()) tripData[key] = value;

    // Add flight ticket data
    tripData.flightTickets = getFlightTicketsData();

    return tripData;
}

// API-integrated actions
async function saveTrip() {
    if (!validateForm()) return;
    const td = collectTripData();

    const payload = {
        tripName: td.tripName,
        destination: td.destination,
        tripType: td.tripType || null,
        startDate: td.startDate,
        duration: parseInt(td.duration, 10),
        totalBudget: parseFloat(td.totalBudget),
        currency: td.currency || null,
        travelersCount: td.travelersCount ? parseInt(td.travelersCount, 10) : null,
        accommodationType: td.accommodationType || null,
        tripDescription: td.tripDescription || null,
        mustSee: td.mustSee || null,
        additionalNotes: td.additionalNotes || null,
        flightTickets: td.flightTickets || [],
        notes: '',
        important: [],
    };

    try {
        const created = await apiRequest('/trips/', { method: 'POST', body: JSON.stringify(payload) });
        showNotification(t('notifications.tripSaved'), 'success');
        setTimeout(() => { showTripDetail(created); }, 600);
    } catch (e) {
        showNotification('API unavailable. Please run the backend.', 'error');
    }
}

async function loadTrips() {
    try {
        const trips = await apiRequest('/trips/');
        currentTrips = trips;
        renderTripsList(trips);
    } catch (e) {
        // Fallback empty state
        renderTripsList([]);
    }
}

function renderTripsList(trips) {
    const container = document.getElementById('my-trips-list');
    if (!container) return;
    container.innerHTML = '';

    if (!trips || trips.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'feature-card';
        empty.textContent = t('home.myTrips.empty');
        container.appendChild(empty);
        return;
    }

    trips.forEach(trip => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <h3>${trip.tripName}</h3>
            <p>${trip.destination}</p>
            <p><small>${trip.startDate} • ${trip.duration}d</small></p>
            <div class="form-actions" style="justify-content:flex-start;border-top:none;padding-top:0;margin-top:0.25rem;">
                <button class="btn btn-secondary" onclick='showTripDetail(${JSON.stringify(trip).replace(/'/g, "&apos;")})'>
                    <i class="fas fa-eye"></i> ${currentLanguage === 'ru' ? 'Просмотр' : 'View'}
                </button>
                <button class="btn btn-primary" onclick='showCreateTrip(${JSON.stringify(trip).replace(/'/g, "&apos;")})'>
                    <i class="fas fa-edit"></i> ${currentLanguage === 'ru' ? 'Редактировать' : 'Edit'}
                </button>
            </div>`;
        container.appendChild(card);
    });
}

async function saveTripDetails() {
    if (!selectedTripId) return;
    const notesVal = document.getElementById('detail-notes').value;
    const items = Array.from(document.querySelectorAll('#important-list .important-item span')).map(el => ({ content: el.textContent }));
    try {
        const updated = await apiRequest(`/trips/${selectedTripId}`, { method: 'PATCH', body: JSON.stringify({ notes: notesVal, important: items }) });
        showNotification(currentLanguage === 'ru' ? 'Изменения сохранены' : 'Changes saved', 'success');
        showTripDetail(updated);
    } catch (e) {
        showNotification('API unavailable. Please run the backend.', 'error');
    }
}

function addImportantItem() {
    const input = document.getElementById('important-input');
    const value = input.value.trim();
    if (!value) return;
    const list = document.getElementById('important-list');
    const el = document.createElement('div');
    el.className = 'important-item';
    el.innerHTML = `<span>${value}</span>
        <div class="important-actions">
            <button class="btn btn-text" onclick="this.closest('.important-item').remove()" title="Delete"><i class="fas fa-trash"></i></button>
        </div>`;
    list.appendChild(el);
    input.value = '';
}

function removeImportantItem(id) {
    // Will be removed on save by replacing items, this is only UI marker
    const list = document.getElementById('important-list');
    const items = Array.from(list.children);
    for (const el of items) {
        const span = el.querySelector('span');
        if (span && span.dataset.id === String(id)) {
            el.remove();
            break;
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white; padding: 0.75rem 1rem; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000; display: flex; align-items: center; gap: 0.5rem; max-width: 400px; animation: slideIn 0.25s ease-out;`;

    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn {from {transform: translateX(100%); opacity: 0;} to {transform: translateX(0); opacity: 1;}}`;
    document.head.appendChild(style);

    document.body.appendChild(notification);
    setTimeout(() => { if (notification.parentElement) notification.remove(); }, 4000);
}

// Events
if (tripForm) {
    tripForm.addEventListener('submit', function(e) { e.preventDefault(); saveTrip(); });
}

// Budget calc
function updateBudgetCalculation() {
    const totalBudget = parseFloat(document.getElementById('total-budget').value) || 0;
    const a = parseFloat(document.getElementById('accommodation-budget').value) || 0;
    const tr = parseFloat(document.getElementById('transportation-budget').value) || 0;
    const f = parseFloat(document.getElementById('food-budget').value) || 0;
    const ac = parseFloat(document.getElementById('activities-budget').value) || 0;
    
    // Get flight ticket total
    const flightTotal = parseFloat(document.getElementById('flight-total-cost').textContent) || 0;
    
    const totalBreakdown = a + tr + f + ac + flightTotal;
    const remaining = totalBudget - totalBreakdown;
    const remainingDisplay = document.getElementById('remaining-budget-display');
    if (remainingDisplay) {
        remainingDisplay.textContent = remaining.toFixed(2);
        remainingDisplay.style.color = remaining < 0 ? '#ef4444' : '#10b981';
    }
}

// Flight Ticket Management
function addFlightTicket() {
    const container = document.getElementById('flight-tickets-container');
    if (!container) return;
    
    const ticketItem = document.createElement('div');
    ticketItem.className = 'flight-ticket-item';
    
    const currentLanguage = localStorage.getItem('travelLanguage') || 'en';
    const translations = currentLanguage === 'ru' ? {
        passengerName: 'Имя Пассажира',
        passengerNamePlaceholder: 'например, Джон Доу',
        ticketCost: 'Стоимость Билета',
        ticketCostPlaceholder: '250.00',
        ticketLink: 'Ссылка на Билет',
        ticketLinkPlaceholder: 'https://airline.com/ticket/...'
    } : {
        passengerName: 'Passenger Name',
        passengerNamePlaceholder: 'e.g., John Doe',
        ticketCost: 'Ticket Cost',
        ticketCostPlaceholder: '250.00',
        ticketLink: 'Airline Ticket Link',
        ticketLinkPlaceholder: 'https://airline.com/ticket/...'
    };
    
    ticketItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>${translations.passengerName}</label>
                <input type="text" class="passenger-name" placeholder="${translations.passengerNamePlaceholder}">
            </div>
            <div class="form-group">
                <label>${translations.ticketCost}</label>
                <div class="input-with-icon">
                    <i class="fas fa-dollar-sign"></i>
                    <input type="number" class="ticket-cost" min="0" step="0.01" placeholder="${translations.ticketCostPlaceholder}">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>${translations.ticketLink}</label>
            <input type="url" class="ticket-link" placeholder="${translations.ticketLinkPlaceholder}">
        </div>
    `;
    
    container.appendChild(ticketItem);
    
    // Add event listeners for cost calculation
    const costInput = ticketItem.querySelector('.ticket-cost');
    if (costInput) {
        costInput.addEventListener('input', updateFlightTotal);
    }
    
    // Show remove button if more than one ticket
    const removeBtn = document.getElementById('remove-ticket-btn');
    if (removeBtn && container.children.length > 1) {
        removeBtn.style.display = 'inline-flex';
    }
}

function removeFlightTicket() {
    const container = document.getElementById('flight-tickets-container');
    if (container.children.length > 1) {
        container.removeChild(container.lastElementChild);
        updateFlightTotal();
        
        // Hide remove button if only one ticket left
        const removeBtn = document.getElementById('remove-ticket-btn');
        if (container.children.length === 1) {
            removeBtn.style.display = 'none';
        }
    }
}

function updateFlightTotal() {
    const costInputs = document.querySelectorAll('.ticket-cost');
    let total = 0;
    
    costInputs.forEach(input => {
        const cost = parseFloat(input.value) || 0;
        total += cost;
    });
    
    const totalDisplay = document.getElementById('flight-total-cost');
    if (totalDisplay) {
        totalDisplay.textContent = total.toFixed(2);
    }
    
    // Update overall budget calculation
    updateBudgetCalculation();
}

function getFlightTicketsData() {
    const tickets = [];
    const ticketItems = document.querySelectorAll('.flight-ticket-item');
    
    ticketItems.forEach(item => {
        const passengerName = item.querySelector('.passenger-name').value;
        const ticketCost = parseFloat(item.querySelector('.ticket-cost').value) || 0;
        const ticketLink = item.querySelector('.ticket-link').value;
        
        if (passengerName || ticketCost > 0 || ticketLink) {
            tickets.push({
                passengerName,
                ticketCost,
                ticketLink
            });
        }
    });
    
    return tickets;
}

function loadFlightTicketsData(tickets) {
    const container = document.getElementById('flight-tickets-container');
    if (!container || !tickets || tickets.length === 0) return;
    
    // Clear existing tickets
    container.innerHTML = '';
    
    tickets.forEach(ticket => {
        addFlightTicket();
        const lastTicket = container.lastElementChild;
        if (lastTicket) {
            lastTicket.querySelector('.passenger-name').value = ticket.passengerName || '';
            lastTicket.querySelector('.ticket-cost').value = ticket.ticketCost || '';
            lastTicket.querySelector('.ticket-link').value = ticket.ticketLink || '';
        }
    });
    
    // Update total
    updateFlightTotal();
    
    // Show/hide remove button
    const removeBtn = document.getElementById('remove-ticket-btn');
    if (removeBtn) {
        removeBtn.style.display = container.children.length > 1 ? 'inline-flex' : 'none';
    }
}

function populateFormWithTripData(trip) {
    // Populate basic fields
    document.getElementById('trip-name').value = trip.tripName || '';
    document.getElementById('destination').value = trip.destination || '';
    document.getElementById('trip-type').value = trip.tripType || '';
    document.getElementById('start-date').value = trip.startDate || '';
    document.getElementById('duration').value = trip.duration || '';
    document.getElementById('total-budget').value = trip.totalBudget || '';
    document.getElementById('currency').value = trip.currency || 'USD';
    document.getElementById('travelers-count').value = trip.travelersCount || '';
    document.getElementById('accommodation-type').value = trip.accommodationType || '';
    document.getElementById('trip-description').value = trip.tripDescription || '';
    document.getElementById('must-see').value = trip.mustSee || '';
    document.getElementById('additional-notes').value = trip.additionalNotes || '';
    
    // Load flight tickets
    if (trip.flightTickets) {
        loadFlightTicketsData(trip.flightTickets);
    }
}

// Init
document.addEventListener('DOMContentLoaded', function() {
    ['total-budget','accommodation-budget','transportation-budget','food-budget','activities-budget'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('input', updateBudgetCalculation);
    });

    // Add event listeners for initial flight ticket cost input
    const initialTicketCost = document.querySelector('.ticket-cost');
    if (initialTicketCost) {
        initialTicketCost.addEventListener('input', updateFlightTotal);
    }

    setDefaultDates();
    updateLanguageButtons();
    applyTranslations();
    loadTrips();
});

// Shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (createTripScreen.classList.contains('active')) saveTrip();
        if (tripDetailScreen.classList.contains('active')) saveTripDetails();
    }
    if (e.key === 'Escape') {
        if (!homeScreen.classList.contains('active')) showHome();
    }
}); 
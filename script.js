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
                share: "Share",
                edit: "Edit Trip",
                notes: { title: "Notes & Plans", placeholder: "Write your plans, ideas, packing list, etc." },
                important: { title: "Important Items", add: "Add", placeholder: "Add important item..." },
                basic: { title: "Trip Details" },
                flightTickets: { title: "Flight Tickets" },
                budget: { title: "Budget Overview" },
                sharing: {
                    title: "Share Trip",
                    description: "Share this trip with friends and family",
                    copy: "Copy Link",
                    email: "Email",
                    whatsapp: "WhatsApp",
                    telegram: "Telegram"
                }
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
                share: "Поделиться",
                edit: "Редактировать",
                notes: { title: "Заметки и Планы", placeholder: "Пишите планы, идеи, список вещей и т.д." },
                important: { title: "Важные Пункты", add: "Добавить", placeholder: "Добавьте важный пункт..." },
                basic: { title: "Детали Поездки" },
                flightTickets: { title: "Билеты на Самолет" },
                budget: { title: "Обзор Бюджета" },
                sharing: {
                    title: "Поделиться Поездкой",
                    description: "Поделитесь этой поездкой с друзьями и семьей",
                    copy: "Копировать Ссылку",
                    email: "Email",
                    whatsapp: "WhatsApp",
                    telegram: "Telegram"
                }
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
    currentTripData = trip; // Store current trip data for reference
    
    homeScreen.classList.remove('active');
    createTripScreen.classList.remove('active');
    tripDetailScreen.classList.add('active');

    document.getElementById('detail-title').textContent = `${trip.tripName} — ${trip.destination}`;
    document.getElementById('detail-subtitle').textContent = `${trip.startDate} • ${trip.duration}d • ${trip.totalBudget} ${trip.currency || ''}`;

    document.getElementById('detail-notes').value = trip.notes || '';

    // Display trip meta information
    displayTripMeta(trip);

    // Display flight tickets if available
    if (trip.flightTickets && trip.flightTickets.length > 0) {
        displayFlightTickets(trip.flightTickets);
    }

    // Display budget overview
    displayBudgetOverview(trip);

    // Update basic information
    const basic = document.getElementById('detail-basic');
    basic.innerHTML = `
        <div class="basic-info-grid">
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <div class="info-content">
                    <span class="info-label">${t('trip.form.basicInfo.destination').replace(' *','')}</span>
                    <span class="info-value">${trip.destination}</span>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-calendar"></i>
                <div class="info-content">
                    <span class="info-label">${t('trip.form.basicInfo.startDate').replace(' *','')}</span>
                    <span class="info-value">${trip.startDate}</span>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-clock"></i>
                <div class="info-content">
                    <span class="info-label">${t('trip.form.basicInfo.duration').replace(' *','')}</span>
                    <span class="info-value">${trip.duration} days</span>
                </div>
            </div>
            <div class="info-item">
                <i class="fas fa-tag"></i>
                <div class="info-content">
                    <span class="info-label">${t('trip.form.basicInfo.tripType')}</span>
                    <span class="info-value">${trip.tripType || 'Not specified'}</span>
                </div>
            </div>
            ${trip.travelersCount ? `
            <div class="info-item">
                <i class="fas fa-users"></i>
                <div class="info-content">
                    <span class="info-label">${t('trip.form.travelers.count')}</span>
                    <span class="info-value">${trip.travelersCount}</span>
                </div>
            </div>
            ` : ''}
            ${trip.accommodationType ? `
            <div class="info-item">
                <i class="fas fa-bed"></i>
                <div class="info-content">
                    <span class="info-label">${t('trip.form.travelers.accommodationType')}</span>
                    <span class="info-value">${trip.accommodationType}</span>
                </div>
            </div>
            ` : ''}
        </div>
        ${trip.tripDescription ? `
        <div class="trip-description-section">
            <h4>${t('trip.form.details.description')}</h4>
            <p>${trip.tripDescription}</p>
        </div>
        ` : ''}
        ${trip.mustSee ? `
        <div class="must-see-section">
            <h4>${t('trip.form.details.mustSee')}</h4>
            <p>${trip.mustSee}</p>
        </div>
        ` : ''}
        ${trip.additionalNotes ? `
        <div class="additional-notes-section">
            <h4>${t('trip.form.details.additionalNotes')}</h4>
            <p>${trip.additionalNotes}</p>
        </div>
        ` : ''}
    `;

    const list = document.getElementById('important-list');
    list.innerHTML = '';
    (trip.important || []).forEach(item => {
        const el = document.createElement('div');
        el.className = 'important-item';
        el.innerHTML = `<span>${item.content}</span>
            <div class="important-actions">
                <button class="btn btn-text" onclick="this.closest('.important-item').remove()" title="Delete"><i class="fas fa-trash"></i></button>
            </div>`;
        list.appendChild(el);
    });

    // Generate and set share link
    const shareLinkInput = document.getElementById('share-link');
    if (shareLinkInput) {
        shareLinkInput.value = generateShareLink(trip.id);
    }
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
    
    // Add budget breakdown data
    tripData.accommodationBudget = parseFloat(document.getElementById('accommodation-budget')?.value) || 0;
    tripData.transportationBudget = parseFloat(document.getElementById('transportation-budget')?.value) || 0;
    tripData.foodBudget = parseFloat(document.getElementById('food-budget')?.value) || 0;
    tripData.activitiesBudget = parseFloat(document.getElementById('activities-budget')?.value) || 0;

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
        accommodationBudget: td.accommodationBudget || 0,
        transportationBudget: td.transportationBudget || 0,
        foodBudget: td.foodBudget || 0,
        activitiesBudget: td.activitiesBudget || 0,
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
    
    // Populate budget breakdown fields
    const accommodationBudgetField = document.getElementById('accommodation-budget');
    const transportationBudgetField = document.getElementById('transportation-budget');
    const foodBudgetField = document.getElementById('food-budget');
    const activitiesBudgetField = document.getElementById('activities-budget');
    
    if (accommodationBudgetField) accommodationBudgetField.value = trip.accommodationBudget || '';
    if (transportationBudgetField) transportationBudgetField.value = trip.transportationBudget || '';
    if (foodBudgetField) foodBudgetField.value = trip.foodBudget || '';
    if (activitiesBudgetField) activitiesBudgetField.value = trip.activitiesBudget || '';
    
    // Load flight tickets
    if (trip.flightTickets) {
        loadFlightTicketsData(trip.flightTickets);
    }
}

// Enhanced Trip Display Functions
function displayFlightTickets(tickets) {
    const display = document.getElementById('flight-tickets-display');
    const list = document.getElementById('flight-tickets-list');
    
    if (!display || !list) return;
    
    if (!tickets || tickets.length === 0) {
        display.style.display = 'none';
        return;
    }
    
    display.style.display = 'block';
    list.innerHTML = '';
    
    tickets.forEach((ticket, index) => {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'flight-ticket-display-item';
        ticketElement.innerHTML = `
            <div class="ticket-header">
                <span class="passenger-name">${ticket.passengerName || 'Unknown Passenger'}</span>
                <span class="ticket-cost">${ticket.ticketCost ? `${ticket.ticketCost} ${currentTripData.currency || 'USD'}` : 'Cost not specified'}</span>
            </div>
            ${ticket.ticketLink ? `<div class="ticket-link"><a href="${ticket.ticketLink}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> View Ticket</a></div>` : ''}
        `;
        list.appendChild(ticketElement);
    });
}

function displayBudgetOverview(trip) {
    const budgetOverview = document.getElementById('budget-overview');
    if (!budgetOverview) return;
    
    const totalBudget = trip.totalBudget || 0;
    const accommodation = trip.accommodationBudget || 0;
    const transportation = trip.transportationBudget || 0;
    const food = trip.foodBudget || 0;
    const activities = trip.activitiesBudget || 0;
    const flightTotal = trip.flightTickets ? trip.flightTickets.reduce((sum, ticket) => sum + (ticket.ticketCost || 0), 0) : 0;
    
    const totalSpent = accommodation + transportation + food + activities + flightTotal;
    const remaining = totalBudget - totalSpent;
    
    budgetOverview.innerHTML = `
        <div class="budget-summary">
            <div class="budget-item">
                <span class="budget-label">Total Budget</span>
                <span class="budget-amount total">${totalBudget.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
            <div class="budget-item">
                <span class="budget-label">Accommodation</span>
                <span class="budget-amount">${accommodation.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
            <div class="budget-item">
                <span class="budget-label">Transportation</span>
                <span class="budget-amount">${transportation.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
            <div class="budget-item">
                <span class="budget-label">Food & Dining</span>
                <span class="budget-amount">${food.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
            <div class="budget-item">
                <span class="budget-label">Activities</span>
                <span class="budget-amount">${activities.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
            <div class="budget-item">
                <span class="budget-label">Flight Tickets</span>
                <span class="budget-amount">${flightTotal.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
            <div class="budget-item total">
                <span class="budget-label">Total Spent</span>
                <span class="budget-amount">${totalSpent.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
            <div class="budget-item ${remaining >= 0 ? 'positive' : 'negative'}">
                <span class="budget-label">Remaining</span>
                <span class="budget-amount">${remaining.toFixed(2)} ${trip.currency || 'USD'}</span>
            </div>
        </div>
    `;
}

function displayTripMeta(trip) {
    // Update trip meta information in header
    const budgetDisplay = document.getElementById('trip-budget-amount');
    const durationDisplay = document.getElementById('trip-duration-amount');
    const typeDisplay = document.getElementById('trip-type-amount');
    
    if (budgetDisplay) budgetDisplay.textContent = `${trip.totalBudget} ${trip.currency || 'USD'}`;
    if (durationDisplay) durationDisplay.textContent = `${trip.duration} days`;
    if (typeDisplay) typeDisplay.textContent = trip.tripType || 'Not specified';
}

// Sharing Functionality
function generateShareLink(tripId) {
    const currentUrl = window.location.origin + window.location.pathname;
    return `${currentUrl}?trip=${tripId}&view=shared`;
}

function shareTrip() {
    if (!selectedTripId) return;
    
    const shareLink = generateShareLink(selectedTripId);
    const shareLinkInput = document.getElementById('share-link');
    
    if (shareLinkInput) {
        shareLinkInput.value = shareLink;
        shareLinkInput.select();
    }
    
    // Show sharing section
    const sharingSection = document.querySelector('.sharing-section');
    if (sharingSection) {
        sharingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function copyShareLink() {
    const shareLinkInput = document.getElementById('share-link');
    if (!shareLinkInput) return;
    
    shareLinkInput.select();
    document.execCommand('copy');
    
    // Show success notification
    showNotification(currentLanguage === 'ru' ? 'Ссылка скопирована!' : 'Link copied!', 'success');
}

function shareViaEmail() {
    if (!selectedTripId) return;
    
    const trip = currentTrips.find(t => t.id === selectedTripId);
    if (!trip) return;
    
    const subject = encodeURIComponent(`Trip: ${trip.tripName} to ${trip.destination}`);
    const body = encodeURIComponent(`Check out this trip: ${generateShareLink(selectedTripId)}`);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
}

function shareViaWhatsApp() {
    if (!selectedTripId) return;
    
    const shareLink = generateShareLink(selectedTripId);
    const text = encodeURIComponent(`Check out this trip: ${shareLink}`);
    
    window.open(`https://wa.me/?text=${text}`);
}

function shareViaTelegram() {
    if (!selectedTripId) return;
    
    const shareLink = generateShareLink(selectedTripId);
    const text = encodeURIComponent(`Check out this trip: ${shareLink}`);
    
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${text}`);
}

// Trip Detail Enhancement Functions
function toggleNotesEdit() {
    const notesEditor = document.getElementById('detail-notes');
    const toggleBtn = document.getElementById('notes-edit-toggle');
    
    if (notesEditor.readOnly) {
        notesEditor.readOnly = false;
        notesEditor.focus();
        toggleBtn.innerHTML = '<i class="fas fa-save"></i>';
        toggleBtn.onclick = saveNotesEdit;
    } else {
        saveNotesEdit();
    }
}

function saveNotesEdit() {
    const notesEditor = document.getElementById('detail-notes');
    const toggleBtn = document.getElementById('notes-edit-toggle');
    
    notesEditor.readOnly = true;
    toggleBtn.innerHTML = '<i class="fas fa-edit"></i>';
    toggleBtn.onclick = toggleNotesEdit;
    
    // Auto-save notes
    saveTripDetails();
}

function editTrip() {
    const trip = currentTrips.find(t => t.id === selectedTripId);
    if (trip) {
        showCreateTrip(trip);
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

    // Handle URL parameters for shared trips
    handleSharedTrip();

    setDefaultDates();
    updateLanguageButtons();
    applyTranslations();
    loadTrips();
});

// Handle shared trip URLs
function handleSharedTrip() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('trip');
    const view = urlParams.get('view');
    
    if (tripId && view === 'shared') {
        // Load the shared trip
        loadSharedTrip(tripId);
    }
}

async function loadSharedTrip(tripId) {
    try {
        const trip = await apiRequest(`/trips/${tripId}`);
        showSharedTrip(trip);
    } catch (e) {
        showNotification('Trip not found or unavailable', 'error');
        setTimeout(() => showHome(), 2000);
    }
}

function showSharedTrip(trip) {
    // Show trip in read-only mode
    selectedTripId = trip.id;
    currentTripData = trip;
    
    homeScreen.classList.remove('active');
    createTripScreen.classList.remove('active');
    tripDetailScreen.classList.add('active');
    
    // Hide edit buttons for shared view
    const editButtons = document.querySelectorAll('.btn[onclick*="edit"], .btn[onclick*="save"]');
    editButtons.forEach(btn => btn.style.display = 'none');
    
    // Show trip details
    showTripDetail(trip);
    
    // Update page title
    document.title = `Shared Trip: ${trip.tripName} - ${trip.destination}`;
}

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
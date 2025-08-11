// Travel Planner Application JavaScript

// Global state
let currentTrips = JSON.parse(localStorage.getItem('travelTrips')) || [];
let currentTripData = {};
let currentLanguage = localStorage.getItem('travelLanguage') || 'en';

// Internationalization
const translations = {
    en: {
        app: {
            title: "TravelPlanner"
        },
        nav: {
            newTrip: "New Trip",
            backToHome: "Back to Home"
        },
        home: {
            hero: {
                title: "Plan Your Dream Adventure",
                subtitle: "Create detailed itineraries, manage budgets, and organize every aspect of your journey",
                stats: {
                    anywhere: "Plan trips anywhere",
                    flexible: "Flexible duration",
                    budget: "Budget tracking"
                },
                startButton: "Start Planning",
                floatingCard: "Ready to explore?"
            },
            features: {
                title: "Why Choose TravelPlanner?",
                itineraries: {
                    title: "Smart Itineraries",
                    description: "Create detailed day-by-day plans with our intuitive template system"
                },
                budget: {
                    title: "Budget Management",
                    description: "Track expenses and stay within your travel budget"
                },
                group: {
                    title: "Group Planning",
                    description: "Plan trips with friends and family seamlessly"
                },
                cloud: {
                    title: "Cloud Sync",
                    description: "Access your plans from anywhere, anytime"
                }
            }
        },
        trip: {
            create: {
                title: "Create New Trip",
                subtitle: "Fill out the details below to start planning your adventure"
            },
            saveButton: "Save Trip",
            form: {
                basicInfo: {
                    title: "Basic Information",
                    tripName: "Trip Name *",
                    tripNamePlaceholder: "e.g., Summer in Paris",
                    destination: "Where are we going? *",
                    destinationPlaceholder: "e.g., Paris, France",
                    tripType: "Trip Type",
                    startDate: "Start Date *",
                    duration: "How many days? *",
                    durationPlaceholder: "7",
                    tripTypes: {
                        vacation: "Vacation",
                        business: "Business",
                        adventure: "Adventure",
                        cultural: "Cultural",
                        relaxation: "Relaxation"
                    }
                },
                budget: {
                    title: "Budget & Costs",
                    totalBudget: "What's the budget? *",
                    totalBudgetPlaceholder: "1000.00",
                    currency: "Currency",
                    breakdown: {
                        title: "Budget Breakdown",
                        accommodation: "Accommodation",
                        accommodationPlaceholder: "300.00",
                        transportation: "Transportation",
                        transportationPlaceholder: "200.00",
                        food: "Food & Dining",
                        foodPlaceholder: "250.00",
                        activities: "Activities & Entertainment",
                        activitiesPlaceholder: "150.00"
                    }
                },
                travelers: {
                    title: "Travelers & Accommodation",
                    count: "Number of Travelers",
                    countPlaceholder: "2",
                    accommodationType: "Preferred Accommodation",
                    specialRequirements: "Special Requirements",
                    specialRequirementsPlaceholder: "Any special needs, accessibility requirements, or preferences...",
                    accommodationTypes: {
                        hotel: "Hotel",
                        hostel: "Hostel",
                        airbnb: "Airbnb",
                        resort: "Resort",
                        camping: "Camping"
                    }
                },
                details: {
                    title: "Trip Details & Notes",
                    description: "Trip Description",
                    descriptionPlaceholder: "Describe your trip goals, what you want to experience, and any specific highlights...",
                    mustSee: "Must-See Attractions",
                    mustSeePlaceholder: "List the top attractions or experiences you don't want to miss...",
                    additionalNotes: "Additional Notes",
                    additionalNotesPlaceholder: "Any other important information, reminders, or notes..."
                },
                actions: {
                    cancel: "Cancel",
                    create: "Create Trip"
                }
            }
        },
        notifications: {
            tripSaved: "Trip saved successfully! 🎉",
            budgetExceeded: "Budget breakdown exceeds total budget!",
            fillRequired: "Please fill in {field}",
            errors: {
                tripName: "Trip Name",
                destination: "Destination",
                startDate: "Start Date",
                duration: "Duration",
                totalBudget: "Total Budget"
            }
        }
    },
    ru: {
        app: {
            title: "Планировщик Путешествий"
        },
        nav: {
            newTrip: "Новое Путешествие",
            backToHome: "Назад на Главную"
        },
        home: {
            hero: {
                title: "Планируйте Свою Мечту",
                subtitle: "Создавайте детальные маршруты, управляйте бюджетом и организуйте каждый аспект вашего путешествия",
                stats: {
                    anywhere: "Планируйте поездки куда угодно",
                    flexible: "Гибкая продолжительность",
                    budget: "Отслеживание бюджета"
                },
                startButton: "Начать Планирование",
                floatingCard: "Готовы к приключениям?"
            },
            features: {
                title: "Почему Выбирают Нас?",
                itineraries: {
                    title: "Умные Маршруты",
                    description: "Создавайте детальные планы по дням с нашей интуитивной системой шаблонов"
                },
                budget: {
                    title: "Управление Бюджетом",
                    description: "Отслеживайте расходы и оставайтесь в рамках бюджета"
                },
                group: {
                    title: "Групповое Планирование",
                    description: "Планируйте поездки с друзьями и семьей без проблем"
                },
                cloud: {
                    title: "Облачная Синхронизация",
                    description: "Доступ к вашим планам откуда угодно и когда угодно"
                }
            }
        },
        trip: {
            create: {
                title: "Создать Новое Путешествие",
                subtitle: "Заполните детали ниже, чтобы начать планирование вашего приключения"
            },
            saveButton: "Сохранить Поездку",
            form: {
                basicInfo: {
                    title: "Основная Информация",
                    tripName: "Название Поездки *",
                    tripNamePlaceholder: "например, Лето в Париже",
                    destination: "Куда мы едем? *",
                    destinationPlaceholder: "например, Париж, Франция",
                    tripType: "Тип Поездки",
                    startDate: "Дата Начала *",
                    duration: "Сколько дней? *",
                    durationPlaceholder: "7",
                    tripTypes: {
                        vacation: "Отпуск",
                        business: "Деловая",
                        adventure: "Приключение",
                        cultural: "Культурная",
                        relaxation: "Отдых"
                    }
                },
                budget: {
                    title: "Бюджет и Расходы",
                    totalBudget: "Какой бюджет? *",
                    totalBudgetPlaceholder: "1000.00",
                    currency: "Валюта",
                    breakdown: {
                        title: "Детализация Бюджета",
                        accommodation: "Проживание",
                        accommodationPlaceholder: "300.00",
                        transportation: "Транспорт",
                        transportationPlaceholder: "200.00",
                        food: "Питание",
                        foodPlaceholder: "250.00",
                        activities: "Развлечения",
                        activitiesPlaceholder: "150.00"
                    }
                },
                travelers: {
                    title: "Путешественники и Проживание",
                    count: "Количество Путешественников",
                    countPlaceholder: "2",
                    accommodationType: "Предпочтительное Проживание",
                    specialRequirements: "Особые Требования",
                    specialRequirementsPlaceholder: "Любые особые потребности, требования доступности или предпочтения...",
                    accommodationTypes: {
                        hotel: "Отель",
                        hostel: "Хостел",
                        airbnb: "Airbnb",
                        resort: "Курорт",
                        camping: "Кемпинг"
                    }
                },
                details: {
                    title: "Детали Поездки и Заметки",
                    description: "Описание Поездки",
                    descriptionPlaceholder: "Опишите цели поездки, что вы хотите испытать и конкретные моменты...",
                    mustSee: "Обязательно Посмотреть",
                    mustSeePlaceholder: "Перечислите главные достопримечательности или впечатления, которые нельзя пропустить...",
                    additionalNotes: "Дополнительные Заметки",
                    additionalNotesPlaceholder: "Любая другая важная информация, напоминания или заметки..."
                },
                actions: {
                    cancel: "Отмена",
                    create: "Создать Поездку"
                }
            }
        },
        notifications: {
            tripSaved: "Поездка успешно сохранена! 🎉",
            budgetExceeded: "Детализация бюджета превышает общий бюджет!",
            fillRequired: "Пожалуйста, заполните {field}",
            errors: {
                tripName: "Название Поездки",
                destination: "Направление",
                startDate: "Дата Начала",
                duration: "Продолжительность",
                totalBudget: "Общий Бюджет"
            }
        }
    }
};

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const createTripScreen = document.getElementById('create-trip-screen');
const tripForm = document.getElementById('trip-form');

// Language Management
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('travelLanguage', lang);
    
    // Update active state for language buttons
    updateLanguageButtons();
    
    // Apply translations
    applyTranslations();
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
}

function updateLanguageButtons() {
    // Update all language buttons
    const langButtons = document.querySelectorAll('[id^="lang-"]');
    langButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.id === `lang-${currentLanguage}` || btn.id === `lang-${currentLanguage}-2`) {
            btn.classList.add('active');
        }
    });
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getTranslation(key);
        if (translation) {
            element.placeholder = translation;
        }
    });
}

function getTranslation(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value;
}

function t(key, params = {}) {
    let translation = getTranslation(key);
    if (!translation) return key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
    });
    
    return translation;
}

// Screen Navigation Functions
function showHome() {
    homeScreen.classList.add('active');
    createTripScreen.classList.remove('active');
    resetForm();
}

function showCreateTrip() {
    homeScreen.classList.remove('active');
    createTripScreen.classList.add('active');
    setDefaultDates();
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
    tripForm.reset();
    currentTripData = {};
}

// Form Validation
function validateForm() {
    const requiredFields = [
        'trip-name',
        'destination',
        'start-date',
        'duration',
        'total-budget'
    ];

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

    // Validate budget breakdown
    const totalBudget = parseFloat(document.getElementById('total-budget').value);
    const accommodationBudget = parseFloat(document.getElementById('accommodation-budget').value) || 0;
    const transportationBudget = parseFloat(document.getElementById('transportation-budget').value) || 0;
    const foodBudget = parseFloat(document.getElementById('food-budget').value) || 0;
    const activitiesBudget = parseFloat(document.getElementById('activities-budget').value) || 0;

    const totalBreakdown = accommodationBudget + transportationBudget + foodBudget + activitiesBudget;
    
    if (totalBreakdown > totalBudget) {
        showNotification(t('notifications.budgetExceeded'), 'error');
        return false;
    }

    return true;
}

// Trip Data Collection
function collectTripData() {
    const formData = new FormData(tripForm);
    const tripData = {};

    for (const [key, value] of formData.entries()) {
        tripData[key] = value;
    }

    // Add calculated fields
    tripData.id = Date.now().toString();
    tripData.createdAt = new Date().toISOString();
    tripData.status = 'planned';
    
    // Calculate end date
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + parseInt(tripData.duration));
    tripData.endDate = endDate.toISOString().split('T')[0];

    // Calculate remaining budget
    const totalBudget = parseFloat(tripData.totalBudget);
    const accommodationBudget = parseFloat(tripData.accommodationBudget) || 0;
    const transportationBudget = parseFloat(document.getElementById('transportation-budget').value) || 0;
    const foodBudget = parseFloat(tripData.foodBudget) || 0;
    const activitiesBudget = parseFloat(tripData.activitiesBudget) || 0;
    
    tripData.remainingBudget = totalBudget - (accommodationBudget + transportationBudget + foodBudget + activitiesBudget);
    tripData.budgetBreakdown = {
        accommodation: accommodationBudget,
        transportation: transportationBudget,
        food: foodBudget,
        activities: activitiesBudget
    };

    return tripData;
}

// Save Trip Function
function saveTrip() {
    if (!validateForm()) {
        return;
    }

    const tripData = collectTripData();
    
    // Add to trips array
    currentTrips.push(tripData);
    
    // Save to localStorage
    localStorage.setItem('travelTrips', JSON.stringify(currentTrips));
    
    // Show success message
    showNotification(t('notifications.tripSaved'), 'success');
    
    // Reset form and go back to home
    setTimeout(() => {
        showHome();
    }, 1500);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
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

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Form Event Listeners
tripForm.addEventListener('submit', function(e) {
    e.preventDefault();
    saveTrip();
});

// Budget Calculation Helper
function updateBudgetCalculation() {
    const totalBudget = parseFloat(document.getElementById('total-budget').value) || 0;
    const accommodationBudget = parseFloat(document.getElementById('accommodation-budget').value) || 0;
    const transportationBudget = parseFloat(document.getElementById('transportation-budget').value) || 0;
    const foodBudget = parseFloat(document.getElementById('food-budget').value) || 0;
    const activitiesBudget = parseFloat(document.getElementById('activities-budget').value) || 0;

    const totalBreakdown = accommodationBudget + transportationBudget + foodBudget + activitiesBudget;
    const remaining = totalBudget - totalBreakdown;

    // Update remaining budget display if it exists
    const remainingDisplay = document.getElementById('remaining-budget-display');
    if (remainingDisplay) {
        remainingDisplay.textContent = remaining.toFixed(2);
        remainingDisplay.style.color = remaining < 0 ? '#ef4444' : '#10b981';
    }
}

// Add budget calculation listeners
document.addEventListener('DOMContentLoaded', function() {
    const budgetInputs = [
        'total-budget',
        'accommodation-budget',
        'transportation-budget',
        'food-budget',
        'activities-budget'
    ];

    budgetInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateBudgetCalculation);
        }
    });

    // Set default dates when page loads
    setDefaultDates();
    
    // Apply initial language
    updateLanguageButtons();
    applyTranslations();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to save trip
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (createTripScreen.classList.contains('active')) {
            saveTrip();
        }
    }
    
    // Escape to go back to home
    if (e.key === 'Escape') {
        if (createTripScreen.classList.contains('active')) {
            showHome();
        }
    }
});

// Add some sample data for demonstration
function addSampleTrip() {
    const sampleTrip = {
        id: 'sample-1',
        tripName: currentLanguage === 'ru' ? 'Лето в Париже' : 'Summer in Paris',
        destination: currentLanguage === 'ru' ? 'Париж, Франция' : 'Paris, France',
        tripType: 'vacation',
        startDate: '2024-07-15',
        duration: '7',
        totalBudget: '2500',
        currency: 'EUR',
        travelersCount: '2',
        accommodationType: 'hotel',
        tripDescription: currentLanguage === 'ru' ? 'Романтическое летнее путешествие в Город Света' : 'A romantic summer getaway to the City of Light',
        mustSee: currentLanguage === 'ru' ? 'Эйфелева башня, Лувр, Нотр-Дам, Елисейские поля' : 'Eiffel Tower, Louvre Museum, Notre-Dame, Champs-Élysées',
        createdAt: new Date().toISOString(),
        status: 'planned'
    };

    if (currentTrips.length === 0) {
        currentTrips.push(sampleTrip);
        localStorage.setItem('travelTrips', JSON.stringify(currentTrips));
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    addSampleTrip();
    showHome();
}); 
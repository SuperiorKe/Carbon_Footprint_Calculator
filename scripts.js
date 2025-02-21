// script.js

// Parse the questions from the JSON structure in your HTML
const questionsData = JSON.parse(document.querySelector('#question-container').textContent.trim());
const questions = questionsData.questions;

// Get DOM elements
const questionContainer = document.getElementById('question-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const form = document.getElementById('calculator-form');

let currentQuestionIndex = 0;
const answers = new Map(); // Store user answers

function updateProgress() {
    const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
    progress.style.width = `${progressPercentage}%`;
    progress.setAttribute('aria-valuenow', progressPercentage);
}

function createQuestionElement(questionData) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';

    // Add category as a subtitle
    const category = document.createElement('h2');
    category.className = 'question-category';
    category.textContent = questionData.category;
    questionDiv.appendChild(category);

    // Add question text
    const questionText = document.createElement('p');
    questionText.className = 'question-text';
    questionText.textContent = questionData.question;
    questionDiv.appendChild(questionText);

    // Add hint if it exists
    if (questionData.hint) {
        const hint = document.createElement('p');
        hint.className = 'question-hint';
        hint.textContent = questionData.hint;
        questionDiv.appendChild(hint);
    }

    // Create options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options';

    // Handle both simple options and nested options (like for flights)
    if (Array.isArray(questionData.options)) {
        questionData.options.forEach((option, index) => {
            const label = createOptionLabel(option, index, questionData.question);
            optionsContainer.appendChild(label);
        });
    } else if (typeof questionData.options === 'object') {
        // Handle nested options (like flight questions)
        Object.entries(questionData.options).forEach(([subCategory, subOptions]) => {
            const subCategoryTitle = document.createElement('p');
            subCategoryTitle.className = 'sub-category';
            subCategoryTitle.textContent = subCategory;
            optionsContainer.appendChild(subCategoryTitle);

            subOptions.forEach((option, index) => {
                const label = createOptionLabel(option, index, `${questionData.question}-${subCategory}`);
                optionsContainer.appendChild(label);
            });
        });
    }

    questionDiv.appendChild(optionsContainer);
    return questionDiv;
}

function createOptionLabel(optionText, index, questionText) {
    const label = document.createElement('label');
    label.className = 'option-label';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = questionText;
    input.value = optionText;
    input.id = `option-${index}-${questionText}`;
    input.required = true;

    const span = document.createElement('span');
    span.textContent = optionText;

    label.appendChild(input);
    label.appendChild(span);

    // Restore previous answer if it exists
    if (answers.has(questionText) && answers.get(questionText) === optionText) {
        input.checked = true;
    }

    return label;
}

function showQuestion(index) {
    questionContainer.innerHTML = '';
    const questionElement = createQuestionElement(questions[index]);
    questionContainer.appendChild(questionElement);
    
    // Update button states
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === questions.length - 1 ? 'Calculate Results' : 'Next Question';
    
    updateProgress();
}

function saveAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const formData = new FormData(form);
    
    if (typeof currentQuestion.options === 'object' && !Array.isArray(currentQuestion.options)) {
        // Handle nested options
        Object.keys(currentQuestion.options).forEach(subCategory => {
            const answer = formData.get(`${currentQuestion.question}-${subCategory}`);
            if (answer) {
                answers.set(`${currentQuestion.question}-${subCategory}`, answer);
            }
        });
    } else {
        // Handle simple options
        const answer = formData.get(currentQuestion.question);
        if (answer) {
            answers.set(currentQuestion.question, answer);
        }
    }
}

// Event Listeners
nextBtn.addEventListener('click', () => {
    if (!form.checkValidity()) {
        alert('Please select an option before proceeding.');
        return;
    }

    saveAnswer();
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    } else {
        // Handle form submission and calculation
        calculateFootprint();
    }
});

prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
});

function calculateFootprint() {
    // Placeholder for calculation logic
    console.log('Calculating footprint with answers:', Object.fromEntries(answers));
    // Add your calculation logic here
}

// Initialize the first question
showQuestion(0);

// Add this to your script.js

// Carbon footprint factors (CO2e in kg)
const CARBON_FACTORS = {
    transportation: {
        car: {
            'Petrol/Diesel Car (Daily)': 4.6,
            'Hybrid Car (Daily)': 2.3,
            'Electric Car (Daily)': 1.1,
            'No Car': 0
        },
        publicTransport: {
            'Daily': 1.5,
            'Few times a week': 0.8,
            'Rarely': 0.3,
            'Never': 0
        },
        flights: {
            domestic: {
                'Frequently (>6 times/year)': 1200,
                'Sometimes (3-6 times/year)': 600,
                'Rarely (1-2 times/year)': 200,
                'Never': 0
            },
            international: {
                'Frequently (>4 times/year)': 4000,
                'Sometimes (2-4 times/year)': 2000,
                'Rarely (1 time/year)': 1000,
                'Never': 0
            }
        }
    },
    household: {
        energySource: {
            'Renewable Energy': 0.2,
            'Mixed Sources': 0.5,
            'Fossil Fuels': 1.0
        },
        homeSize: {
            'Large House (>200m²)': 1.5,
            'Medium House (100-200m²)': 1.0,
            'Small House/Apartment (<100m²)': 0.5
        },
        occupants: {
            '1': 1.0,
            '2': 0.8,
            '3-4': 0.6,
            '5+': 0.4
        }
    },
    lifestyle: {
        diet: {
            'Meat Daily': 2.5,
            'Meat Few Times a Week': 1.5,
            'Vegetarian': 0.8,
            'Vegan': 0.5
        },
        shopping: {
            'Frequently Buy New': 1.5,
            'Mix of New and Second-hand': 1.0,
            'Mostly Second-hand': 0.5,
            'Minimal Consumer': 0.2
        },
        recycling: {
            'Always': 0.5,
            'Sometimes': 1.0,
            'Never': 1.5
        }
    }
};

function calculateFootprint() {
    let totalFootprint = 0;
    let breakdown = {
        transportation: 0,
        household: 0,
        lifestyle: 0
    };

    // Convert answers Map to regular object for easier processing
    const userAnswers = Object.fromEntries(answers);

    // Calculate Transportation Impact
    if (userAnswers['What type of car do you primarily use?']) {
        breakdown.transportation += CARBON_FACTORS.transportation.car[userAnswers['What type of car do you primarily use?']] * 365;
    }

    if (userAnswers['How often do you use public transportation?']) {
        breakdown.transportation += CARBON_FACTORS.transportation.publicTransport[userAnswers['How often do you use public transportation?']] * 365;
    }

    if (userAnswers['How often do you take domestic flights?']) {
        breakdown.transportation += CARBON_FACTORS.transportation.flights.domestic[userAnswers['How often do you take domestic flights?']];
    }

    if (userAnswers['How often do you take international flights?']) {
        breakdown.transportation += CARBON_FACTORS.transportation.flights.international[userAnswers['How often do you take international flights?']];
    }

    // Calculate Household Impact
    if (userAnswers['What is your primary source of household energy?']) {
        breakdown.household += CARBON_FACTORS.household.energySource[userAnswers['What is your primary source of household energy?']] * 365;
    }

    if (userAnswers['What is the size of your home?']) {
        breakdown.household += CARBON_FACTORS.household.homeSize[userAnswers['What is the size of your home?']] * 365;
    }

    if (userAnswers['How many people live in your household?']) {
        breakdown.household *= CARBON_FACTORS.household.occupants[userAnswers['How many people live in your household?']];
    }

    // Calculate Lifestyle Impact
    if (userAnswers['What best describes your diet?']) {
        breakdown.lifestyle += CARBON_FACTORS.lifestyle.diet[userAnswers['What best describes your diet?']] * 365;
    }

    if (userAnswers['What are your shopping habits?']) {
        breakdown.lifestyle += CARBON_FACTORS.lifestyle.shopping[userAnswers['What are your shopping habits?']] * 365;
    }

    if (userAnswers['How often do you recycle?']) {
        breakdown.lifestyle += CARBON_FACTORS.lifestyle.recycling[userAnswers['How often do you recycle?']] * 365;
    }

    // Calculate total
    totalFootprint = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

    displayResults(totalFootprint, breakdown);
}

function displayResults(totalFootprint, breakdown) {
    // Clear the question container
    questionContainer.innerHTML = '';

    // Create results container
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'results-container';

    // Add total footprint
    const totalDiv = document.createElement('div');
    totalDiv.className = 'total-footprint';
    totalDiv.innerHTML = `
        <h2>Your Annual Carbon Footprint</h2>
        <p class="footprint-number">${totalFootprint.toFixed(2)} kg CO₂e</p>
        <p class="footprint-comparison">The average global carbon footprint is 5,000 kg CO₂e per year.</p>
    `;

    // Add breakdown
    const breakdownDiv = document.createElement('div');
    breakdownDiv.className = 'footprint-breakdown';
    breakdownDiv.innerHTML = `
        <h3>Breakdown by Category</h3>
        <div class="breakdown-chart">
            <div class="breakdown-bar transportation" style="width: ${(breakdown.transportation / totalFootprint * 100)}%">
                <span>Transportation: ${breakdown.transportation.toFixed(2)} kg CO₂e</span>
            </div>
            <div class="breakdown-bar household" style="width: ${(breakdown.household / totalFootprint * 100)}%">
                <span>Household: ${breakdown.household.toFixed(2)} kg CO₂e</span>
            </div>
            <div class="breakdown-bar lifestyle" style="width: ${(breakdown.lifestyle / totalFootprint * 100)}%">
                <span>Lifestyle: ${breakdown.lifestyle.toFixed(2)} kg CO₂e</span>
            </div>
        </div>
    `;

    // Add recommendations
    const recommendationsDiv = document.createElement('div');
    recommendationsDiv.className = 'recommendations';
    recommendationsDiv.innerHTML = `
        <h3>Recommendations to Reduce Your Footprint</h3>
        <ul>
            ${generateRecommendations(breakdown)}
        </ul>
    `;

    // Add action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'result-actions';
    actionsDiv.innerHTML = `
        <button onclick="window.location.reload()" class="btn btn-primary">Calculate Again</button>
        <button onclick="window.location.href='index.html'" class="btn btn-secondary">Back to Home</button>
    `;

    // Append all sections
    resultsDiv.appendChild(totalDiv);
    resultsDiv.appendChild(breakdownDiv);
    resultsDiv.appendChild(recommendationsDiv);
    resultsDiv.appendChild(actionsDiv);

    // Add to page
    questionContainer.appendChild(resultsDiv);

    // Hide navigation buttons
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
}

function generateRecommendations(breakdown) {
    const recommendations = [];
    
    if (breakdown.transportation > 1000) {
        recommendations.push('Consider using public transportation or cycling for daily commutes');
        recommendations.push('Look into carpooling options or switching to an electric vehicle');
    }
    
    if (breakdown.household > 1000) {
        recommendations.push('Install energy-efficient appliances and LED lighting');
        recommendations.push('Consider switching to renewable energy sources');
    }
    
    if (breakdown.lifestyle > 1000) {
        recommendations.push('Try incorporating more plant-based meals into your diet');
        recommendations.push('Practice conscious consumption and buy second-hand when possible');
    }

    return recommendations.map(rec => `<li>${rec}</li>`).join('');
}



/* JavaScript */
// script.js
const questions = [
    {
        section: "Transportation",
        question: [
            {
                "id": 1,
                "question": "What type of vehicle do you primarily use?",
                "choices": ["Gasoline car", "Diesel car", "Electric car", "Hybrid car", "Motorcycle", "Public transportation", "Bicycle/Walk", "None"],
                "tip": "Select the vehicle you use most often for daily travel."
            }
        ]
    },
    {
        section: "Food",
        question: [
            {
                "id": 2,
                "question": "What type of vehicle do you primarily use?",
                "choices": ["Gasoline car", "Diesel car", "Electric car", "Hybrid car", "Motorcycle", "Public transportation", "Bicycle/Walk", "None"],
                "tip": "Select the vehicle you use most often for daily travel."
            }
        ]
    },
    {
        section: "Flight",
        question: [
            {
                "id": 3,
                "question": "What type of vehicle do you primarily use?",
                "choices": ["Gasoline car", "Diesel car", "Electric car", "Hybrid car", "Motorcycle", "Public transportation", "Bicycle/Walk", "None"],
                "tip": "Select the vehicle you use most often for daily travel."
            }
        ]
    },
    {
        section: "Energy",
        question: [
            {
                "id": 4,
                "question": "What type of vehicle do you primarily use?",
                "choices": ["Gasoline car", "Diesel car", "Electric car", "Hybrid car", "Motorcycle", "Public transportation", "Bicycle/Walk", "None"],
                "tip": "Select the vehicle you use most often for daily travel."
            }
        ]
    },
    {
        section: "Waste",
        question: [
            {
                "id": 10,
                "question": "How much waste do you produce weekly?",
                "choices": ["0-10 kg", "11-20 kg", "21-30 kg", "31-50 kg", "50+ kg"],
                "tip": "Estimate based on your household waste output."
            }
        ]
    }
];


const mainSection = document.getElementById('main-section');
const nextButton = document.getElementById('next-button');
const backButton = document.getElementById('back-button');
const stepNumber = document.getElementById('step-number');
const totalSteps = document.getElementById('total-steps');
const progressBar = document.querySelector('.progress');

let currentSectionIndex = 0;

function updateProgress() {
    stepNumber.textContent = currentSectionIndex + 1;
    totalSteps.textContent = questions.length;
    const progressPercent = ((currentSectionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function loadSection(sectionIndex) {
    mainSection.innerHTML = '';
    const section = questions[sectionIndex];
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('question-section', 'active');

    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = section.section;
    sectionDiv.appendChild(sectionTitle);

    const { id, question, choices, tip } = section.question[0];
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionTitle = document.createElement('h2');
    questionTitle.textContent = `${id}. ${question}`;
    questionDiv.appendChild(questionTitle);

    const tooltip = document.createElement('p');
    tooltip.classList.add('tooltip');
    tooltip.textContent = tip;
    questionDiv.appendChild(tooltip);

    const choicesDiv = document.createElement('div');
    choicesDiv.classList.add('choices');

    choices.forEach(choice => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `question${id}`;
        input.value = choice;

        label.appendChild(input);
        label.append(` ${choice}`);
        choicesDiv.appendChild(label);
    });

    questionDiv.appendChild(choicesDiv);
    sectionDiv.appendChild(questionDiv);

    mainSection.appendChild(sectionDiv);
}

nextButton.addEventListener('click', () => {
    if (currentSectionIndex < questions.length - 1) {
        currentSectionIndex++;
        loadSection(currentSectionIndex);
        updateProgress();
        backButton.disabled = false;
        nextButton.textContent = 'Next Question'; // Reset button text
    } 
    if (currentSectionIndex === questions.length - 1) {
        nextButton.textContent = 'Calculate Footprint'; // Update button text
    }
});

backButton.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        loadSection(currentSectionIndex);
        updateProgress();
        nextButton.textContent = 'Next Question'; // Reset button text
    }
    if (currentSectionIndex === 0) {
        backButton.disabled = true;
    }
});

// Initialize the first section and progress bar
loadSection(currentSectionIndex);
updateProgress();

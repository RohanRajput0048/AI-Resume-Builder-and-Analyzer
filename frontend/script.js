// --- START OF FILE script.js ---

// --- Tab Switching ---
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const backendUrl = 'http://localhost:8080'; // Define backend URL

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        if (!tabId) return; // Safety check

        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const contentElement = document.getElementById(`${tabId}-content`);
        if (contentElement) {
            contentElement.classList.add('active');
        } else {
            console.error(`Content element not found for tab: ${tabId}`);
        }
    });
});


// --- Theme Switching Logic ---
const themeToggleButton = document.getElementById('theme-toggle-button');
const themeIcon = document.getElementById('theme-icon');
const bodyElement = document.body;

const ICONS = {
    light: '☀️',
    dark: '🌙'
};
const THEMES = {
    light: 'light',
    dark: 'dark'
};

// Function to apply the theme and update icon/localStorage
function applyTheme(theme) {
    if (theme === THEMES.dark) {
        bodyElement.classList.add('dark-mode');
        themeIcon.textContent = ICONS.light; // Show sun to switch back to light
        localStorage.setItem('theme', THEMES.dark);
    } else {
        bodyElement.classList.remove('dark-mode');
        themeIcon.textContent = ICONS.dark; // Show moon to switch to dark
        localStorage.setItem('theme', THEMES.light);
    }
}

// Add click listener to the button
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        const isDarkMode = bodyElement.classList.contains('dark-mode');
        applyTheme(isDarkMode ? THEMES.light : THEMES.dark);
    });
}

// Function to initialize the theme on load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Check system preference if no theme is saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Apply saved theme, or system preference, or default to light
    const initialTheme = savedTheme || (prefersDark ? THEMES.dark : THEMES.light);
    console.log("Initializing theme:", initialTheme);
    applyTheme(initialTheme);
}


// --- Helper: Set Nested Object Property ---
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // If the key involves an array index (e.g., 'education[0]')
        const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            if (!current[arrayKey]) current[arrayKey] = [];
            if (!current[arrayKey][index]) current[arrayKey][index] = {};
            current = current[arrayKey][index];
        } else {
            if (!current[key]) current[key] = {};
            current = current[key];
        }
    }
    // Set the final value
    const finalKey = keys[keys.length - 1];
    const finalArrayMatch = finalKey.match(/^(\w+)\[(\d+)\]$/);
    if (finalArrayMatch) {
        const arrayKey = finalArrayMatch[1];
        const index = parseInt(finalArrayMatch[2], 10);
        if (!current[arrayKey]) current[arrayKey] = [];
        if (!current[arrayKey][index]) current[arrayKey][index] = {};
        // Assuming the path ends with the array index itself if it's just setting the array element
        console.warn(`Direct assignment to array index '${path}' is unusual. Check config.`);
        current[arrayKey][index] = value;
    } else {
        current[finalKey] = value;
    }
}


// --- Helper: Get Nested Object Property ---
function getNestedValue(obj, path) {
    if (!obj || typeof path !== 'string') return undefined; // Basic safety checks
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current === null || typeof current !== 'object') return undefined;
        const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
        if (arrayMatch) {
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            if (!Array.isArray(current[arrayKey]) || index >= current[arrayKey].length) return undefined;
            current = current[arrayKey][index];
        } else {
            if (current[key] === undefined) return undefined;
            current = current[key];
        }
    }
    return current;
}


// --- Template Field Definitions ---
const templateFieldConfigs = {
    modern: [
        { path: 'name', label: 'Full Name', type: 'text', required: true },
        { path: 'email', label: 'Email', type: 'email', required: true },
        { path: 'phone', label: 'Phone', type: 'tel' },
        { path: 'skills', label: 'Skills (comma-separated)', type: 'textarea' },
        { type: 'section-title', title: 'Education' },
        { path: 'education', type: 'dynamic-list', listType: 'educationModern' },
        { type: 'section-title', title: 'Experience' },
        { path: 'experience', type: 'dynamic-list', listType: 'experienceModern' },
    ],
    classic: [
        { path: 'name', label: 'Full Name', type: 'text', required: true },
        { path: 'email', label: 'Email', type: 'email', required: true },
        { path: 'phone', label: 'Phone', type: 'tel' },
        { path: 'skills', label: 'Skills (comma-separated)', type: 'textarea' },
        { type: 'section-title', title: 'Education' },
        { path: 'education', type: 'dynamic-list', listType: 'educationClassic' },
        { type: 'section-title', title: 'Experience' },
        { path: 'experience', type: 'dynamic-list', listType: 'experienceClassic' },
    ],
    azurill: [
        { path: 'name', label: 'Full Name', type: 'text', required: true },
        { path: 'email', label: 'Email', type: 'email', required: true },
        { path: 'phone', label: 'Phone', type: 'tel' },
        { path: 'skills', label: 'Skills (comma-separated)', type: 'textarea' },
        { type: 'section-title', title: 'Education' },
        { path: 'education', type: 'dynamic-list', listType: 'educationAzurill' },
        { type: 'section-title', title: 'Experience' },
        { path: 'experience', type: 'dynamic-list', listType: 'experienceAzurill' },
    ],
    bhendi: [
        { path: 'name', label: 'Full Name', type: 'text', required: true },
        { path: 'phone', label: 'Phone', type: 'tel' },
        { path: 'email', label: 'Email', type: 'email', required: true },
        { path: 'links.linkedin', label: 'LinkedIn URL', type: 'url' },
        { path: 'links.github', label: 'GitHub URL', type: 'url' },
        { type: 'section-title', title: 'Technical Skills' },
        { path: 'technicalSkills.languages', label: 'Languages (comma-separated)', type: 'text' },
        { path: 'technicalSkills.frameworks', label: 'Frameworks & Libraries (comma-separated)', type: 'text' },
        { path: 'technicalSkills.databases', label: 'Databases (comma-separated)', type: 'text' },
        { path: 'technicalSkills.tools', label: 'Tools & Technologies (comma-separated)', type: 'text' },
        { type: 'section-title', title: 'Experience' },
        { path: 'experience', type: 'dynamic-list', listType: 'experienceBhendi' },
        { type: 'section-title', title: 'Projects' },
        { path: 'projects', type: 'dynamic-list', listType: 'projectBhendi' },
        { type: 'section-title', title: 'Education' },
        { path: 'education', type: 'dynamic-list', listType: 'educationBhendi' },
    ],
    kd: [
        { path: 'name', label: 'Full Name', type: 'text', required: true },
        { path: 'email', label: 'Email', type: 'email', required: true },
        { path: 'phone', label: 'Phone', type: 'tel' },
        { path: 'links.github', label: 'GitHub URL', type: 'url' },
        { path: 'links.website', label: 'Website/Portfolio URL', type: 'url' },
        { path: 'links.linkedin', label: 'LinkedIn URL', type: 'url' },
        { type: 'section-title', title: 'Education' },
        { path: 'education.details', type: 'dynamic-list', listType: 'educationKd' },
        { type: 'section-title', title: 'Projects' },
        { path: 'projects', type: 'dynamic-list', listType: 'projectKd' },
        { type: 'section-title', title: 'Technical Skills' },
        { path: 'technicalSkills.languages', label: 'Programming Languages (comma-separated)', type: 'text' },
        { path: 'technicalSkills.frameworks', label: 'Frameworks/Libraries (comma-separated)', type: 'text' },
        { path: 'technicalSkills.databases', label: 'Databases (comma-separated)', type: 'text' },
        { path: 'technicalSkills.tools', label: 'Tools & Editing (comma-separated)', type: 'text' },
        { type: 'section-title', title: 'Courses Taken' },
        { path: 'courses.CSE & Maths', label: 'CSE & Maths Courses (comma-separated)', type: 'text' },
        { path: 'courses.Other', label: 'Other Courses (comma-separated)', type: 'text' },
        { type: 'section-title', title: 'Positions of Responsibility' },
        { path: 'positions', type: 'dynamic-list', listType: 'positionKd' },
        { type: 'section-title', title: 'Miscellaneous' },
        { path: 'misc', type: 'dynamic-list', listType: 'miscKd' },
    ],
};

// --- Dynamic List Item Creators ---
const dynamicListItemTemplates = {
    // Modern/Classic/Azurill use similar simple structures
    educationModern: [{ path: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Sc. Computer Science' }, { path: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' }, { path: 'duration', label: 'Year or Duration', type: 'text', placeholder: '2018-2022 or 2022' }, ],
    experienceModern: [{ path: 'role', label: 'Role', type: 'text', placeholder: 'Software Engineer' }, { path: 'company', label: 'Company', type: 'text', placeholder: 'Tech Corp' }, { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Jan 2022 - Present' }, ],
    educationClassic: [{ path: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Sc. Computer Science' }, { path: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' }, { path: 'duration', label: 'Year or Duration', type: 'text', placeholder: '2018-2022 or 2022' }, ],
    experienceClassic: [{ path: 'role', label: 'Role', type: 'text', placeholder: 'Software Engineer' }, { path: 'company', label: 'Company', type: 'text', placeholder: 'Tech Corp' }, { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Jan 2022 - Present' }, ],
    educationAzurill: [{ path: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Sc. Computer Science' }, { path: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' }, { path: 'duration', label: 'Year or Duration', type: 'text', placeholder: '2018-2022 or 2022' }, ],
    experienceAzurill: [{ path: 'role', label: 'Role', type: 'text', placeholder: 'Software Engineer' }, { path: 'company', label: 'Company', type: 'text', placeholder: 'Tech Corp' }, { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Jan 2022 - Present' }, ],
    // Bhendi
    experienceBhendi: [{ path: 'title', label: 'Title', type: 'text', placeholder: 'Software Development Engineer' }, { path: 'company', label: 'Company', type: 'text', placeholder: 'Innovate Inc.' }, { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Aug 2021 - May 2023' }, { path: 'location', label: 'Location', type: 'text', placeholder: 'Remote / City, State' }, { path: 'points', label: 'Points (one per line)', type: 'points' }, ],
    projectBhendi: [{ path: 'title', label: 'Project Title', type: 'text' }, { path: 'techStack', label: 'Tech Stack (comma-separated)', type: 'text' }, { path: 'points', label: 'Points (one per line)', type: 'points' }, { path: 'links.live', label: 'Live Link (Optional)', type: 'url' }, { path: 'links.github', label: 'GitHub Link (Optional)', type: 'url' }, ],
    educationBhendi: [{ path: 'institution', label: 'Institution', type: 'text' }, { path: 'degree', label: 'Degree', type: 'text' }, { path: 'duration', label: 'Duration', type: 'text' }, { path: 'location', label: 'Location (Optional)', type: 'text' }, ],
    // KD
    educationKd: [{ path: 'degree', label: 'Degree', type: 'text' }, { path: 'institution', label: 'Institution', type: 'text' }, { path: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 2022' }, { path: 'score', label: 'Score/GPA', type: 'text' }, ],
    projectKd: [{ path: 'title', label: 'Project Title', type: 'text' }, { path: 'techStack', label: 'Tech Stack (comma-separated)', type: 'text' }, { path: 'points', label: 'Points (one per line)', type: 'points' }, { path: 'links.live', label: 'Live Link (Optional)', type: 'url' }, { path: 'links.github', label: 'GitHub Link (Optional)', type: 'url' }, ],
    positionKd: [{ path: 'title', label: 'Title', type: 'text' }, { path: 'org', label: 'Organization', type: 'text' }, { path: 'duration', label: 'Duration', type: 'text' }, { path: 'desc', label: 'Description', type: 'textarea' }, ],
    miscKd: [{ path: 'title', label: 'Title (e.g., Award, Achievement)', type: 'text' }, { path: 'desc', label: 'Description', type: 'text' }, { path: 'year', label: 'Year', type: 'text' }, ]
};


function createListItemHTML(fields, listType, basePath, index) {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.setAttribute('data-list-type', listType);
    item.setAttribute('data-list-index', index);

    let innerHTML = `<button type="button" class="remove-item" aria-label="Remove item">×</button>`;

    fields.forEach(field => {
        const fieldPath = `${basePath}[${index}].${field.path}`;
        const inputId = fieldPath.replace(/[.\[\]]/g, '-'); // Create unique ID based on path

        innerHTML += `<div class="form-group">`;
        innerHTML += `<label for="${inputId}">${field.label}</label>`;

        if (field.type === 'textarea') {
            innerHTML += `<textarea id="${inputId}" class="form-control" data-path="${fieldPath}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>`;
        } else if (field.type === 'points') {
            innerHTML += `<textarea id="${inputId}" class="form-control" data-path="${fieldPath}" placeholder="${field.placeholder || 'Enter points, one per line...'}" rows="4"></textarea>`;
            innerHTML += `<small class="form-text text-muted">Enter each point on a new line.</small>`;
        } else {
            innerHTML += `<input type="${field.type || 'text'}" id="${inputId}" class="form-control" data-path="${fieldPath}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
        }
        innerHTML += `</div>`;
    });

    item.innerHTML = innerHTML;
    // Attach remove listener after setting innerHTML
    const removeButton = item.querySelector('.remove-item');
    if (removeButton) {
        removeButton.addEventListener('click', () => item.remove());
    }
    return item;
}


// --- Render Dynamic Form Fields ---
const dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
const templateSelector = document.getElementById('template-selector');

function renderDynamicFormFields(templateName) {
    if (!dynamicFieldsContainer || !templateFieldConfigs[templateName]) {
        console.error("Cannot render fields: Container or config missing for", templateName);
        dynamicFieldsContainer.innerHTML = '<p class="error-message">Error loading form fields for this template.</p>';
        return;
    }
    dynamicFieldsContainer.innerHTML = ''; // Clear previous fields

    const fields = templateFieldConfigs[templateName];
    fields.forEach(field => {
        const fieldWrapper = document.createElement('div'); // Use a wrapper for consistent spacing

        if (field.type === 'section-title') {
            fieldWrapper.innerHTML = `<h3 class="section-title">${field.title}</h3>`;
            dynamicFieldsContainer.appendChild(fieldWrapper);
            return; // Move to next field
        }

        fieldWrapper.className = 'form-group'; // Add form-group class here

        const inputId = field.path.replace(/[.\[\]& ]/g, '-'); // Basic ID generation, remove spaces too
        let labelHTML = `<label for="${inputId}">${field.label}</label>`;
        let inputHTML = '';

        if (field.type === 'textarea') {
            inputHTML = `<textarea id="${inputId}" class="form-control" data-path="${field.path}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} rows="3"></textarea>`;
        } else if (field.type === 'dynamic-list') {
            const listContainerId = `${field.listType}-list-${Date.now()}`; // Unique ID for list container
            // Dynamic lists don't need a standard label/input, handled by the add button and items
            fieldWrapper.innerHTML = `
                <div class="dynamic-list" id="${listContainerId}"></div>
                <button type="button" class="add-item-btn" data-list-type="${field.listType}" data-target-list="#${listContainerId}" data-base-path="${field.path}">
                    <span>+</span> Add ${field.listType.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}
                </button>`;

            // Add initial item for usability inside the wrapper
            const listContainer = fieldWrapper.querySelector(`#${listContainerId}`);
            if (listContainer) {
                const itemFields = dynamicListItemTemplates[field.listType];
                if (itemFields) {
                    listContainer.appendChild(createListItemHTML(itemFields, field.listType, field.path, 0));
                } else {
                    console.warn(`No item template found for list type: ${field.listType}`);
                    listContainer.innerHTML = '<p>Could not load items.</p>';
                }
            }
            dynamicFieldsContainer.appendChild(fieldWrapper);
            return; // Skip rest of processing for dynamic list wrapper

        } else if (['text', 'email', 'tel', 'url', 'month'].includes(field.type)) {
            // Handle nested paths like 'links.linkedin' or 'technicalSkills.languages'
            inputHTML = `<input type="${field.type}" id="${inputId}" class="form-control" data-path="${field.path}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
        } else {
            console.warn("Unsupported field type:", field.type);
            inputHTML = `<p>Unsupported field type: ${field.type}</p>`;
        }

        fieldWrapper.innerHTML = labelHTML + inputHTML;
        dynamicFieldsContainer.appendChild(fieldWrapper);
    });
}

// --- Event Listener for Template Selector ---
if (templateSelector) {
    templateSelector.addEventListener('change', (e) => {
        renderDynamicFormFields(e.target.value);
        // Hide preview and download button when template changes
        const previewSection = document.getElementById('resume-preview-section');
        const downloadBtn = document.getElementById('download-generated-pdf');
        if (previewSection) previewSection.style.display = 'none';
        if (downloadBtn) downloadBtn.style.display = 'none';
    });
}

// --- Event Delegation for Adding Dynamic List Items ---
if (dynamicFieldsContainer) {
    dynamicFieldsContainer.addEventListener('click', function(e) {
        // Use closest to handle clicks on the button or its children (like the span)
        const button = e.target.closest('.add-item-btn');
        if (button) {
            const listType = button.dataset.listType;
            const targetListSelector = button.dataset.targetList;
            const basePath = button.dataset.basePath;
            const listContainer = document.querySelector(targetListSelector);

            if (listContainer && dynamicListItemTemplates[listType]) {
                const itemFields = dynamicListItemTemplates[listType];
                const currentItemCount = listContainer.querySelectorAll('.list-item').length;
                listContainer.appendChild(createListItemHTML(itemFields, listType, basePath, currentItemCount));
            } else {
                console.error("Could not add list item. Container or template missing for:", listType, targetListSelector);
                showToast("Error adding item.", "error");
            }
        }
    });
}


// --- Resume Builder Form Submission (Preview & Prepare for PDF) ---
const builderForm = document.getElementById('resume-builder-form');
const previewSection = document.getElementById('resume-preview-section');
const previewContainer = document.getElementById('resume-preview');
const downloadPdfButton = document.getElementById('download-generated-pdf');
let currentResumeData = null; // Store data for PDF generation

if (builderForm) {
    builderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Builder form submitted");
        showToast('Generating preview...', 'success');

        try {
            currentResumeData = collectFormData(); // Collect data based on current fields
            if (!currentResumeData) {
                throw new Error("Could not collect form data.");
            }
            console.log("Collected Data for Preview:", JSON.stringify(currentResumeData, null, 2)); // Pretty print data

            if (!previewContainer) throw new Error("Preview container element not found.");
            generateResumePreview(currentResumeData); // Generate HTML preview

            populateBuilderAnalysis(); // Simulate analysis

            if (previewSection) {
                previewSection.style.display = 'block';
                previewSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                 console.error("Preview section element not found.");
            }
            if (downloadPdfButton) {
                downloadPdfButton.style.display = 'block'; // Show PDF download button
            }


        } catch (error) {
            console.error("Error during builder preview generation:", error);
            showToast(`Error generating preview: ${error.message}`, 'error');
            if (downloadPdfButton) downloadPdfButton.style.display = 'none';
            currentResumeData = null;
        }
    });
}

// --- Collect Form Data based on Dynamic Fields ---
function collectFormData() {
    if (!templateSelector || !dynamicFieldsContainer) {
        console.error("Cannot collect data: Template selector or dynamic fields container missing.");
        return null;
    }
    const selectedTemplate = templateSelector.value;
    const config = templateFieldConfigs[selectedTemplate];
    if (!config) {
        console.error("Cannot collect data: Config missing for template", selectedTemplate);
        return null;
    }

    const data = {};

    // Helper to determine if a field should be treated as an array from comma/newline separated input
    function isArrayField(path) {
        const arrayFieldSubstrings = ['skills', 'languages', 'frameworks', 'databases', 'tools', 'courses', 'techStack'];
        return arrayFieldSubstrings.some(sub => path.toLowerCase().includes(sub));
    }
    function isPointsField(path) {
         return path.toLowerCase().endsWith('.points');
    }

    // Process simple fields and textareas first
    dynamicFieldsContainer.querySelectorAll('input[data-path], textarea[data-path]').forEach(input => {
        const path = input.dataset.path;
        if (!path) return; // Skip inputs without a path

        let value = input.value.trim();

        if (isPointsField(path)) {
            value = value.split('\n').map(p => p.trim()).filter(p => p); // Split by newline for points
        } else if (isArrayField(path)) {
            if (value) {
                value = value.split(',').map(s => s.trim()).filter(s => s); // Split by comma for others
            } else {
                value = []; // Default to empty array if input is empty
            }
        }
        setNestedValue(data, path, value);
    });

    // Process dynamic lists
    dynamicFieldsContainer.querySelectorAll('.dynamic-list').forEach(listContainer => {
        const addButton = listContainer.nextElementSibling; // Find the corresponding add button
        if (!addButton || !addButton.matches('.add-item-btn')) return; // Ensure it's the add button

        const listBasePath = addButton.dataset.basePath;
        if (!listBasePath) return; // Skip if button has no base path

        const itemsData = [];
        listContainer.querySelectorAll('.list-item').forEach((item) => {
            const itemData = {};
            let hasData = false; // Flag to check if item has any non-empty values

            item.querySelectorAll('input[data-path], textarea[data-path]').forEach(input => {
                const itemPath = input.dataset.path; // e.g., "experience[0].role"
                // Extract the property name from the full path (e.g., "role" from "experience[0].role")
                const propNameMatch = itemPath.match(/\.(\w+)$/);
                if (propNameMatch) {
                    const propName = propNameMatch[1];
                    let value = input.value.trim();

                    // Handle array conversion within list items too
                    if (isPointsField(itemPath)) {
                        value = value.split('\n').map(p => p.trim()).filter(p => p);
                    } else if (isArrayField(itemPath)) {
                         if (value) {
                            value = value.split(',').map(s => s.trim()).filter(s => s);
                        } else {
                            value = [];
                        }
                    }

                    itemData[propName] = value;
                    // Check if this value contributes data
                    if ((typeof value === 'string' && value !== '') || (Array.isArray(value) && value.length > 0)) {
                        hasData = true;
                    }
                }
            });

            // Only add item if it has some actual data
            if (hasData) {
                itemsData.push(itemData);
            }
        });
        // Set the collected array data using the base path (e.g., 'experience')
        setNestedValue(data, listBasePath, itemsData);
    });


    return data;
}


// --- Generate Resume Preview HTML (Adapted for Dynamic Data) ---
function generateResumePreview(data) {
    if (!previewContainer || !data) {
        console.error("Preview container or data missing");
        if (previewContainer) previewContainer.innerHTML = '<p>Error generating preview.</p>';
        return;
    }
    previewContainer.innerHTML = ''; // Clear previous

    const selectedTemplate = templateSelector ? templateSelector.value : null;

    // --- Helper functions to get data safely ---
    const getName = () => data.name || 'Name Not Provided';
    const getEmail = () => data.email || '';
    const getPhone = () => data.phone || '';
    const getLinkedIn = () => getNestedValue(data, 'links.linkedin') || '';
    const getGithub = () => getNestedValue(data, 'links.github') || '';
    const getWebsite = () => getNestedValue(data, 'links.website') || '';
    const getJobTitle = () => data.jobTitle || ''; // Example for templates having this
    const getLocation = () => data.location || ''; // Example for templates having this

    // --- Generic Formatting Helpers ---
    const formatDateRange = (start, end, isCurrent = false) => {
        const options = { month: 'short', year: 'numeric', timeZone: 'UTC' }; // UTC to avoid timezone issues
        let startDateStr = '';
        let endDateStr = 'Present';

        try {
            if (start) {
                // Add day for robust parsing, handles YYYY-MM
                startDateStr = new Date(start + '-02').toLocaleDateString('en-US', options);
            }
        } catch (e) { console.warn("Invalid start date:", start); }

        if (!isCurrent && end) {
            try {
                endDateStr = new Date(end + '-02').toLocaleDateString('en-US', options);
            } catch (e) { console.warn("Invalid end date:", end); endDateStr = ''; }
        } else if (isCurrent) {
            endDateStr = 'Present';
        } else {
            endDateStr = ''; // No end date and not current
        }

        if (startDateStr && endDateStr) return `${startDateStr} - ${endDateStr}`;
        if (startDateStr) return startDateStr;
        if (endDateStr === 'Present') return 'Present'; // Show 'Present' if only start date implies current
        return ''; // Return empty if only end date or no dates
    };

    const createLinkHTML = (url, text, cssClass = '') => {
        if (!url || typeof url !== 'string') return '';
        let safeUrl = url.trim();
        if (!safeUrl) return '';

        // Handle email links
        if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && safeUrl.includes('@')) {
            return `<span><a href="mailto:${safeUrl}" class="${cssClass}">${text || safeUrl}</a></span>`;
        }
        // Add protocol if missing
        if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) {
            safeUrl = `https://${safeUrl}`;
        }
        // Basic URL structure check
        try {
            new URL(safeUrl); // Check if it parses
            return `<span><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${cssClass}">${text || url}</a></span>`;
        } catch (e) {
            console.warn("Invalid URL provided:", url);
            return `<span>${text || url} (invalid link)</span>`; // Indicate invalid link
        }
    };

    const formatPoints = (points) => {
        if (!Array.isArray(points) || points.length === 0) return '';
        // Escape basic HTML in points for safety
        const escapedPoints = points.map(p => p.replace(/</g, "<").replace(/>/g, ">"));
        return `<ul class="resume-item-points">${escapedPoints.map(p => `<li>${p}</li>`).join('')}</ul>`;
    };

    // --- Build HTML ---
    let resumeHTML = `<div class="resume-section resume-header">`;
    resumeHTML += `<h1 class="resume-name">${getName()}</h1>`;
    if (getJobTitle()) resumeHTML += `<p class="resume-job-title">${getJobTitle()}</p>`;

    const contactInfo = [
        createLinkHTML(getEmail(), getEmail(), 'resume-contact-link'),
        getPhone() ? `<span class="resume-contact-info">${getPhone()}</span>` : '',
        getLocation() ? `<span class="resume-contact-info">${getLocation()}</span>` : '',
        createLinkHTML(getLinkedIn(), 'LinkedIn', 'resume-contact-link'),
        createLinkHTML(getGithub(), 'GitHub', 'resume-contact-link'),
        createLinkHTML(getWebsite(), 'Portfolio/Website', 'resume-contact-link')
    ].filter(Boolean).join(' <span class="separator">|</span> '); // Add separator span for styling

    resumeHTML += `<div class="resume-contact">${contactInfo}</div></div>`; // Close header section

    // Summary
    if (data.summary) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Summary</div><p>${data.summary.replace(/\n/g, '<br>')}</p></div>`;
    }

    // Experience
    const experiences = Array.isArray(data.experience) ? data.experience : [];
    if (experiences.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Work Experience</div>`;
        experiences.forEach(exp => {
            resumeHTML += `
                <div class="resume-item">
                    <div class="resume-item-header">
                         <span class="resume-item-title">${exp.title || exp.role || exp.position || 'Position'}</span>
                         <span class="resume-item-date">${exp.duration || formatDateRange(exp.start, exp.end, exp.isCurrent)}</span>
                    </div>
                    <div class="resume-item-subtitle">${exp.company || 'Company'} ${exp.location ? `(${exp.location})` : ''}</div>
                    ${exp.description ? `<div class="resume-item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    ${formatPoints(exp.points)}
                </div>`;
        });
        resumeHTML += `</div>`;
    }

    // Education
    const educationItems = (data.education && Array.isArray(data.education.details)) ? data.education.details // KD Path
                           : (Array.isArray(data.education) ? data.education : []); // Standard Path
    if (educationItems.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
        educationItems.forEach(edu => {
            resumeHTML += `
                <div class="resume-item">
                     <div class="resume-item-header">
                         <span class="resume-item-title">${edu.degree || 'Degree'}</span>
                         <span class="resume-item-date">${edu.duration || edu.year || formatDateRange(edu.start, edu.end)}</span>
                     </div>
                     <div class="resume-item-subtitle">${edu.institution || edu.school || 'Institution'} ${edu.location ? `(${edu.location})` : ''}</div>
                     ${edu.score ? `<div class="resume-item-score">Score: ${edu.score}</div>` : ''}
                     ${edu.description ? `<div class="resume-item-description">${edu.description.replace(/\n/g, '<br>')}</div>` : ''}
                </div>`;
        });
        resumeHTML += `</div>`;
    }

    // Skills (combine different possible structures)
    let allSkills = [];
    if (Array.isArray(data.skills)) allSkills = data.skills;
    else if (typeof data.skills === 'string' && data.skills) allSkills = data.skills.split(',').map(s => s.trim()).filter(s => s);

    if (data.technicalSkills && typeof data.technicalSkills === 'object') {
        Object.values(data.technicalSkills).forEach(skillCategory => {
            if (Array.isArray(skillCategory)) allSkills.push(...skillCategory);
        });
    }
    allSkills = [...new Set(allSkills.filter(Boolean))]; // Remove duplicates and falsy values

    if (allSkills.length > 0) {
        resumeHTML += `
            <div class="resume-section"><div class="resume-section-title">Skills</div>
            <div class="skills-list">${allSkills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}</div></div>`;
    }

    // Projects
    const projects = Array.isArray(data.projects) ? data.projects : [];
    if (projects.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Projects</div>`;
        projects.forEach(proj => {
            const tech = Array.isArray(proj.techStack) ? proj.techStack.join(', ') : (proj.tech || '');
            const projLinks = [
                createLinkHTML(getNestedValue(proj, 'links.live'), 'Live Demo', 'resume-project-link'),
                createLinkHTML(getNestedValue(proj, 'links.github'), 'GitHub', 'resume-project-link')
            ].filter(Boolean).join(' <span class="separator">|</span> ');

            resumeHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${proj.title || proj.name || 'Project Name'}</div>
                    ${tech ? `<div class="resume-item-subtitle">Technologies: ${tech}</div>` : ''}
                    ${projLinks ? `<div class="resume-item-links">${projLinks}</div>` : ''}
                    ${proj.description ? `<div class="resume-item-description">${proj.description.replace(/\n/g, '<br>')}</div>` : ''}
                    ${formatPoints(proj.points)}
                </div>`;
        });
        resumeHTML += `</div>`;
    }

    // KD Specific Sections (only add if template is KD)
    if (selectedTemplate === 'kd') {
        if (data.courses && typeof data.courses === 'object' && (data.courses['CSE & Maths']?.length || data.courses.Other?.length)) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Courses Taken</div>`;
            if (data.courses['CSE & Maths']?.length) resumeHTML += `<p><strong>CSE & Maths:</strong> ${data.courses['CSE & Maths'].join(', ')}</p>`;
            if (data.courses.Other?.length) resumeHTML += `<p><strong>Other:</strong> ${data.courses.Other.join(', ')}</p>`;
            resumeHTML += `</div>`;
        }
        const positions = Array.isArray(data.positions) ? data.positions : [];
        if (positions.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Positions of Responsibility</div>`;
            positions.forEach(pos => {
                resumeHTML += `<div class="resume-item">
                   <div class="resume-item-header">
                         <span class="resume-item-title">${pos.title}, ${pos.org}</span>
                         <span class="resume-item-date">${pos.duration || ''}</span>
                    </div>
                    ${pos.desc ? `<div class="resume-item-description">${pos.desc.replace(/\n/g, '<br>')}</div>` : ''}
                 </div>`;
            });
            resumeHTML += `</div>`;
        }
        const miscItems = Array.isArray(data.misc) ? data.misc : [];
        if (miscItems.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Miscellaneous</div>`;
            miscItems.forEach(item => {
                resumeHTML += `<div class="resume-item">
                    <div class="resume-item-title">${item.title}</div>
                     ${item.desc ? `<div class="resume-item-subtitle">${item.desc} ${item.year ? `(${item.year})` : ''}</div>` : ''}
                 </div>`;
            });
            resumeHTML += `</div>`;
        }
    }

    previewContainer.innerHTML = resumeHTML;
}


// --- Populate Builder Analysis (Simulated) ---
function populateBuilderAnalysis() {
    const suggestionsContainer = document.getElementById('builder-ai-suggestions');
    if (!suggestionsContainer) return;

    suggestionsContainer.innerHTML = ''; // Clear previous
    const suggestions = [
        { type: 'positive', text: 'Clear contact information provided.' },
        { type: 'suggestion', text: 'Consider quantifying achievements in experience points (e.g., "Increased X by Y%").' },
        { type: 'suggestion', text: 'Tailor the skills section to match keywords from target job descriptions.' }
    ];

    suggestions.forEach(suggestion => {
        const { className, symbol } = getSuggestionIconClassAndSymbol(suggestion.type, suggestion.text);
        suggestionsContainer.innerHTML += `
            <div class="analysis-item">
                <div class="analysis-item-icon ${className}">${symbol}</div>
                <div class="analysis-item-text">${suggestion.text}</div>
            </div>`;
    });

    // Simulate Score
    const score = Math.floor(Math.random() * 31) + 65; // Score between 65-95
    const scoreCircle = document.getElementById('builder-score-circle');
    const scoreText = document.getElementById('builder-score-text');
    if (scoreCircle) {
         scoreCircle.textContent = score;
         scoreCircle.className = `score-circle ${getScoreClass(score)}`;
    }
    if (scoreText) {
         scoreText.innerHTML = score >= 85 ? '<p>Strong foundation! Review suggestions for minor improvements.</p>' :
                               score >= 70 ? '<p>Good start! Consider the suggestions to enhance your resume.</p>' :
                                             '<p>Needs work. Review the suggestions carefully to improve.</p>';
    }
}

// --- PDF Download Button Action (Builder Section) ---
if (downloadPdfButton) {
    downloadPdfButton.addEventListener('click', async () => {
        if (!currentResumeData) {
            showToast('Please generate the preview first using "Generate Resume Preview".', 'error');
            return;
        }
        const selectedTemplate = templateSelector ? templateSelector.value : null;
        if (!selectedTemplate) {
            showToast('Please select a template.', 'error');
            return;
        }

        showToast('Generating PDF...', 'success');
        downloadPdfButton.disabled = true;
        downloadPdfButton.textContent = 'Generating...';

        try {
            console.log("Sending data to backend for PDF generation:", JSON.stringify({ template: selectedTemplate, data: currentResumeData }, null, 2));

            const response = await fetch(`${backendUrl}/api/resume/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template: selectedTemplate,
                    data: currentResumeData
                })
            });

            console.log("Backend response status:", response.status);

            if (!response.ok) {
                let errorMsg = `PDF generation failed (Status: ${response.status})`;
                try {
                    const errorData = await response.json();
                    console.error("Backend error response:", errorData);
                    errorMsg = errorData.message || errorMsg;
                } catch (e) {
                    errorMsg = `${errorMsg}: ${response.statusText || 'Server error'}`;
                    console.error("Could not parse error response as JSON.");
                }
                throw new Error(errorMsg);
            }

            const blob = await response.blob();
            if (blob.type !== 'application/pdf') {
                console.error("Server response type:", blob.type);
                throw new Error('Server did not return a PDF file.');
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            const username = currentResumeData?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume';
            const filename = `${username}_${selectedTemplate}.pdf`;
            a.download = filename;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            a.remove();

            showToast('PDF downloaded successfully!', 'success');

        } catch (error) {
            console.error('Error generating or downloading PDF:', error);
            showToast(`Download Error: ${error.message}`, 'error');
        } finally {
            downloadPdfButton.disabled = false;
            downloadPdfButton.textContent = 'Download PDF';
        }
    });
}


// --- Resume Analyzer Logic ---
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('resume-file');
const uploadButton = document.getElementById('upload-btn');
const jobDescriptionInput = document.getElementById('job-description');
const loadingIndicator = document.getElementById('analysis-loading');
const resultsSection = document.getElementById('analysis-results-section');

if (uploadButton) { uploadButton.addEventListener('click', () => fileInput.click()); }

if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragging'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragging'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragging');
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (isValidFileType(file)) {
                if (fileInput) fileInput.files = e.dataTransfer.files; // Set fileInput's files for consistency
                handleFileUpload(file);
            } else {
                showToast('Invalid file type. Please upload a PDF.', 'error');
            }
        }
    });
}

if (fileInput) {
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            const file = fileInput.files[0];
            if (isValidFileType(file)) {
                handleFileUpload(file);
            } else {
                showToast('Invalid file type. Please upload a PDF.', 'error');
                fileInput.value = ''; // Reset input if invalid
            }
        }
    });
}

function isValidFileType(file) {
    return file && file.type === 'application/pdf';
}

// Handle File Upload and API Call (Analyzer)
async function handleFileUpload(file) {
    if (!jobDescriptionInput || !fileInput || !uploadArea || !resultsSection || !loadingIndicator) {
         console.error("Analyzer UI elements missing.");
         showToast("UI Error. Cannot process upload.", "error");
         return;
    }

    const jobDescription = jobDescriptionInput.value.trim();
    if (!jobDescription) {
        showToast('Please paste the Job Description first.', 'error');
        jobDescriptionInput.focus();
        return;
    }
    if (!file) {
        showToast('Please select a resume file to upload.', 'error');
        return;
    }

    uploadArea.style.display = 'none';
    resultsSection.style.display = 'none';
    loadingIndicator.style.display = 'flex';

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
        console.log("Sending analysis request to backend...");
        const response = await fetch(`${backendUrl}/api/resume/analyze`, {
            method: 'POST',
            body: formData
        });
        console.log("Received response from backend. Status:", response.status);

        if (!response.ok) {
            let errorMsg = `Analysis failed (${response.status})`;
            try {
                const errorData = await response.json();
                console.error("Backend error response:", errorData);
                errorMsg = errorData.message || errorMsg;
            } catch (e) {
                errorMsg = `${errorMsg}: ${response.statusText || 'Server error'}`;
                console.error("Could not parse error response as JSON.");
            }
            throw new Error(errorMsg);
        }

        let analysisData;
        try {
            console.log("Attempting to parse response JSON...");
            analysisData = await response.json();
            console.log("Successfully parsed JSON:", analysisData);
        } catch (jsonError) {
            console.error("Failed to parse JSON response from backend:", jsonError);
            showToast('Received an invalid format from the server.', 'error');
            throw new Error("Invalid JSON received");
        }

        if (analysisData) {
            console.log("Rendering analysis results...");
            renderAnalysisResults(analysisData);
            console.log("Rendering resume preview...");
            renderUploadedResumePreview(analysisData);
            resultsSection.style.display = 'block';
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            showToast('Resume analyzed successfully!', 'success');
        } else {
            throw new Error("Parsed analysis data is empty.");
        }

    } catch (err) {
        console.error("Error in handleFileUpload:", err);
        showToast(`Analysis Error: ${err.message}`, 'error');
        uploadArea.style.display = 'block'; // Show upload area again on error
        fileInput.value = ''; // Reset file input
    } finally {
        loadingIndicator.style.display = 'none';
    }
}


// --- Render Analysis Results (Right Side - Analyzer) ---
function renderAnalysisResults(analysisData) {
    console.log("Inside renderAnalysisResults");
    if (!analysisData) return;

    try {
        // Score
        const scoreCircle = document.getElementById('analyzer-score-circle');
        const scoreText = document.getElementById('analyzer-score-text');
        if (scoreCircle && scoreText) {
            const score = analysisData.score || 0;
            scoreCircle.textContent = score;
            scoreCircle.className = `score-circle ${getScoreClass(score)}`;
            scoreText.innerHTML = `<p>${analysisData.summaryFeedback || 'Analysis complete. See suggestions.'}</p>`;
        }

        // Keywords
        const keywordsContainer = document.getElementById('analyzer-keyword-matches');
        if (keywordsContainer) {
            keywordsContainer.innerHTML = '<p class="keyword-title">Job Keyword Matches:</p>'; // Added class for styling
            const foundKeywords = analysisData.keywordMatches?.found || [];
            const missingKeywords = analysisData.keywordMatches?.missing || [];
            if (foundKeywords.length > 0) {
                foundKeywords.forEach(k => { keywordsContainer.innerHTML += `<div class="keyword-item"><span class="keyword-name">${k}</span><span class="keyword-status found">Found</span></div>`; });
            }
            if (missingKeywords.length > 0) {
                missingKeywords.forEach(k => { keywordsContainer.innerHTML += `<div class="keyword-item"><span class="keyword-name">${k}</span><span class="keyword-status missing">Missing</span></div>`; });
            }
            if (!foundKeywords.length && !missingKeywords.length) {
                 keywordsContainer.innerHTML += '<p class="no-keywords">No keyword analysis available.</p>';
            }
        }

        // Section Strength
        const strengthContainer = document.getElementById('analyzer-section-strength');
        if (strengthContainer) {
            strengthContainer.innerHTML = '';
            const sectionScores = analysisData.sectionAnalysis || {};
            const sectionOrder = ['workExperience', 'skills', 'education', 'summary', 'projects'];
            let analysisRendered = false;
            const renderedKeys = new Set();

            sectionOrder.forEach(key => {
                if (sectionScores.hasOwnProperty(key) && sectionScores[key] !== null && sectionScores[key] !== undefined) {
                    renderStrengthBar(strengthContainer, key, sectionScores[key]);
                    renderedKeys.add(key);
                    analysisRendered = true;
                }
            });

            Object.keys(sectionScores).forEach(key => {
                if (!renderedKeys.has(key) && sectionScores[key] !== null && sectionScores[key] !== undefined) {
                    renderStrengthBar(strengthContainer, key, sectionScores[key]);
                    analysisRendered = true;
                }
            });

            if (!analysisRendered) {
                strengthContainer.innerHTML = '<p class="no-analysis">Section analysis unavailable.</p>';
            }
        }

        // Suggestions
        const suggestionsContainer = document.getElementById('analyzer-ai-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            const suggestions = analysisData.suggestions || [];
            if (suggestions.length > 0) {
                suggestions.forEach(text => {
                    const { className, symbol } = getSuggestionIconClassAndSymbol(null, text); // Let helper infer type
                    suggestionsContainer.innerHTML += `
                        <div class="analysis-item">
                            <div class="analysis-item-icon ${className}">${symbol}</div>
                            <div class="analysis-item-text">${text}</div>
                        </div>`;
                });
            } else {
                suggestionsContainer.innerHTML = '<p class="no-suggestions">No specific suggestions provided.</p>';
            }
        }
    } catch (error) {
        console.error("Error rendering analysis results:", error);
        showToast('Error displaying analysis details.', 'error');
    }
}

// Helper for rendering strength bars (Analyzer)
function renderStrengthBar(container, key, scoreValue) {
    const label = getSectionStrengthLabel(scoreValue);
    // Simple camelCase to Title Case conversion
    const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    container.innerHTML += `
        <div class="strength-item">
            <p class="strength-label">${displayName}</p>
            <div class="progress-container">
                <div class="progress-bar" style="width: ${scoreValue}%;" title="${scoreValue}%"></div>
            </div>
            <div class="progress-label">
                <span>${label}</span>
                <span>${scoreValue}%</span>
            </div>
        </div>`;
}


// --- Render Resume Preview from Analysis (Left Side - Analyzer) ---
function renderUploadedResumePreview(analysisData) {
    console.log("Inside renderUploadedResumePreview");
    const previewContainer = document.getElementById('analyzer-resume-preview');
    if (!previewContainer) return;
    previewContainer.innerHTML = ''; // Clear previous content

    if (!analysisData) {
        previewContainer.innerHTML = '<p>Error: No analysis data received for preview.</p>';
        return;
    }

    try {
        const userInfo = analysisData.userInfo || {};
        const summary = analysisData.summary || '';
        const skills = Array.isArray(analysisData.skills) ? analysisData.skills : [];
        const experiences = Array.isArray(analysisData.experienceDetails) ? analysisData.experienceDetails : [];
        const projects = Array.isArray(analysisData.projects) ? analysisData.projects : [];
        const generalLinks = Array.isArray(analysisData.links) ? analysisData.links : [];
        let educationItems = [];
        if (Array.isArray(analysisData.educationDetails)) educationItems = analysisData.educationDetails;
        else if (analysisData.education && Array.isArray(analysisData.education.details)) educationItems = analysisData.education.details;
        else if (Array.isArray(analysisData.education)) educationItems = analysisData.education;

        // --- Re-use Helper functions ---
        const createLink = (url, text, cssClass = '') => { if (!url || typeof url !== 'string') return ''; let safeUrl = url.trim(); if (!safeUrl) return ''; if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && safeUrl.includes('@')) { return `<span><a href="mailto:${safeUrl}" class="${cssClass}">${text || safeUrl}</a></span>`; } if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) { safeUrl = `https://${safeUrl}`; } try { new URL(safeUrl); return `<span><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${cssClass}">${text || url}</a></span>`; } catch (e) { return `<span>${text || url} (invalid link)</span>`; } };
        const formatAnalysisPoints = (description) => { if (!description || typeof description !== 'string') return ''; const points = description.split('\n').map(p => p.trim()).filter(p => p); if (points.length <= 1 && !points[0]?.match(/^[\*\-\•]\s/)) { return `<div class="resume-item-description">${description.replace(/\n/g, '<br>')}</div>`; } const escapedPoints = points.map(p => p.replace(/^[\*\-\•]\s*/, '').replace(/</g, "<").replace(/>/g, ">")); return `<ul class="resume-item-points">${escapedPoints.map(p => `<li>${p}</li>`).join('')}</ul>`; };
        // --- End Helpers ---

        let resumeHTML = '<div class="resume-section resume-header">';
        resumeHTML += `<h1 class="resume-name">${userInfo.name || 'Name Not Found'}</h1>`;
        if (experiences.length > 0 && experiences[0].jobTitle) resumeHTML += `<p class="resume-job-title">${experiences[0].jobTitle}</p>`;
        const contactInfo = [
            createLink(userInfo.email, userInfo.email, 'resume-contact-link'),
            userInfo.phone ? `<span class="resume-contact-info">${userInfo.phone}</span>` : '',
            userInfo.address ? `<span class="resume-contact-info">${userInfo.address}</span>` : '',
            // Assume generalLinks might be strings or objects with url property
            ...generalLinks.map(link => createLink(link.url || link, link.type || 'Link', 'resume-contact-link'))
        ].filter(Boolean).join(' <span class="separator">|</span> ');
        resumeHTML += `<div class="resume-contact">${contactInfo}</div></div>`;

        if (summary) resumeHTML += `<div class="resume-section"><div class="resume-section-title">Summary</div><p>${summary.replace(/\n/g, '<br>')}</p></div>`;

        const validExperiences = experiences.filter(exp => exp.jobTitle || exp.description);
        if (validExperiences.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Work Experience</div>`;
            validExperiences.forEach(exp => {
                resumeHTML += `<div class="resume-item">
                                <div class="resume-item-header">
                                    <span class="resume-item-title">${exp.jobTitle || ''}</span>
                                    <span class="resume-item-date">${exp.duration || ''}</span>
                                </div>
                                <div class="resume-item-subtitle">${exp.company || ''}</div>
                                ${formatAnalysisPoints(exp.description)}
                              </div>`;
            });
            resumeHTML += `</div>`;
        }

        const validEducation = educationItems.filter(edu => edu.degree || edu.institution || edu.school);
        if (validEducation.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
            validEducation.forEach(edu => {
                resumeHTML += `<div class="resume-item">
                                <div class="resume-item-header">
                                    <span class="resume-item-title">${edu.degree || ''}</span>
                                    <span class="resume-item-date">${edu.duration || edu.year || ''}</span>
                                </div>
                                <div class="resume-item-subtitle">${edu.institution || edu.school || ''}</div>
                                ${edu.description ? `<div class="resume-item-description">${edu.description.replace(/\n/g, '<br>')}</div>` : ''}
                             </div>`;
            });
            resumeHTML += `</div>`;
        }

        if (skills.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Skills</div>
                           <div class="skills-list">${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}</div></div>`;
        }

        const validProjects = projects.filter(proj => proj.projectName || proj.projectDescription);
        if (validProjects.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Projects</div>`;
            validProjects.forEach(project => {
                const tools = Array.isArray(project.toolsUsed) ? project.toolsUsed.join(', ') : '';
                const projectLinks = Array.isArray(project.links) ? project.links : [];
                const linksHTML = projectLinks.map(link => createLink(link, 'Project Link', 'resume-project-link')).filter(Boolean).join(' <span class="separator">|</span> ');
                resumeHTML += `
                     <div class="resume-item">
                         <div class="resume-item-title">${project.projectName || ''}</div>
                         ${tools ? `<div class="resume-item-subtitle">Technologies: ${tools}</div>` : ''}
                         ${project.date ? `<div class="resume-item-date">${project.date}</div>` : ''}
                         ${formatAnalysisPoints(project.projectDescription)}
                         ${linksHTML ? `<div class="resume-item-links">${linksHTML}</div>` : ''}
                     </div>`;
            });
            resumeHTML += `</div>`;
        }

        if (!userInfo.name && !summary && skills.length === 0 && validExperiences.length === 0 && validProjects.length === 0 && validEducation.length === 0) {
            resumeHTML = `<div class="no-preview-content"><p>Could not parse sufficient resume content for preview.</p><p>Please check the analysis results.</p></div>`;
        }

        previewContainer.innerHTML = resumeHTML;

    } catch (error) {
        console.error("Error rendering uploaded resume preview:", error);
        previewContainer.innerHTML = '<p class="error-message">Error displaying resume preview.</p>';
        showToast('Error displaying resume preview details.', 'error');
    }
}


// --- Helper Functions ---
function getScoreClass(score) {
    if (score >= 85) return 'high-score';
    if (score >= 70) return 'medium-score';
    return 'low-score';
}

function getSectionStrengthLabel(score) {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
}

function getSuggestionIconClassAndSymbol(type, text) {
    let symbol = '💡'; // Default to suggestion
    let className = 'suggestion';
    const lowerText = text ? text.toLowerCase() : '';

    // Prioritize specific type if provided (though AI response might not include it)
    if (type === 'positive') { symbol = '✓'; className = 'positive'; }
    else if (type === 'negative') { symbol = '❌'; className = 'negative'; }
    // Infer from text content as fallback
    else if (lowerText) {
        if (lowerText.includes('excellent') || lowerText.includes('strong') || lowerText.includes('well done') || lowerText.includes('clear') || lowerText.includes('good job') || lowerText.includes('effectively')) { symbol = '✓'; className = 'positive'; }
        else if (lowerText.includes('missing') || lowerText.includes('lack') || lowerText.includes('unclear') || lowerText.includes('vague') || lowerText.includes('weak') || lowerText.includes('generic') || lowerText.includes('too short') || lowerText.includes('too long') || lowerText.includes('consider removing') || lowerText.includes('avoid')) { symbol = '❌'; className = 'negative'; }
        else if (lowerText.includes('consider') || lowerText.includes('add') || lowerText.includes('quantify') || lowerText.includes('improve') || lowerText.includes('expand') || lowerText.includes('tailor') || lowerText.includes('suggest') || lowerText.includes('recommend') || lowerText.includes('ensure') || lowerText.includes('try')) { symbol = '💡'; className = 'suggestion'; }
        // If none match, keep default suggestion
    }
    return { className, symbol };
}

// --- Button Actions ---
const downloadAnalysisBtn = document.getElementById('download-analysis');
const editResumeBtn = document.getElementById('edit-resume');
const improveResumeBtn = document.getElementById('improve-resume');

// PDF Download for Analysis Tab
if (downloadAnalysisBtn) {
    downloadAnalysisBtn.addEventListener('click', () => {
        console.log("Download Analysis button clicked.");
        const analysisResultsDiv = document.getElementById('analysis-results-section')?.querySelector('.analysis-results'); // Target inner div
        const previewElement = document.getElementById('analyzer-resume-preview');

        if (!analysisResultsDiv || !previewElement) {
            showToast('No analysis results or preview content to download.', 'error');
            return;
        }
        // Check if libraries are loaded
        if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
            console.error("jsPDF or html2canvas library not loaded!");
            showToast('Error preparing download. Libraries not found.', 'error');
            // Optionally disable the button permanently if libraries are missing
            // downloadAnalysisBtn.disabled = true;
            // downloadAnalysisBtn.title = "PDF download libraries not loaded.";
            return;
        }
        const { jsPDF } = jspdf; // Destructure from window.jspdf
        showToast('Preparing analysis PDF...', 'success');

        const pdfWidth = 210; // A4 width in mm
        const pdfHeight = 297; // A4 height in mm
        const margin = 15; // Increased margin
        const contentWidth = pdfWidth - margin * 2;
        const pdf = new jsPDF('p', 'mm', 'a4');
        let yOffset = margin; // Current y position on the PDF page

        const addContentToPdf = async (element, title) => {
            if (!element) return yOffset; // Skip if element doesn't exist

            const options = {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                scrollX: 0,
                scrollY: -window.scrollY, // Try to capture from the top
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight
            };

            try {
                const canvas = await html2canvas(element, options);
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const imgWidth = contentWidth;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                let heightLeft = imgHeight;
                let position = yOffset; // Where this content block starts

                // Add Title before the content block
                pdf.setFontSize(14);
                pdf.setTextColor(40, 40, 40);
                pdf.text(title, margin, position);
                position += 10; // Add space after title
                heightLeft += 10; // Account for title space

                // Check if the *entire* block (title + image) fits on the current page
                if (position + imgHeight > pdfHeight - margin) {
                     // If it's not the first element, start on a new page
                     if (yOffset > margin + 5) { // Check if we're not at the very top
                         pdf.addPage();
                         position = margin; // Reset position
                         // Add title again on new page
                         pdf.setFontSize(14);
                         pdf.text(title, margin, position);
                         position += 10;
                         heightLeft = imgHeight + 10; // Reset heightLeft for the new page
                     } else {
                         // First element is too tall, warn and proceed (jsPDF might clip)
                         console.warn("PDF Generation: Element might be too tall for one page.", title);
                     }
                }


                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= (pdfHeight - position - margin); // Remaining height of the image needing placement

                // Add new pages if the image was split
                while (heightLeft > 0) {
                    position = margin - heightLeft; // Calculate negative offset for next chunk
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                    heightLeft -= (pdfHeight - margin * 2); // Reduce by full page usable height
                }

                // Return the Y position for the START of the next block
                return position + imgHeight + 10; // Add spacing after the block

            } catch (error) {
                console.error(`Error processing element for PDF: ${title}`, error);
                showToast(`Failed to capture ${title} for PDF.`, 'error');
                return yOffset; // Return current offset on error
            }
        };

        // Chain the promises to add elements sequentially
        addContentToPdf(previewElement, "Resume Preview")
            .then(nextY => {
                // Determine where the next element should start
                 if (pdf.internal.getNumberOfPages() > 1 && nextY < yOffset) { // If addImage added pages
                     yOffset = margin; // Start at top margin of new page
                 } else if (nextY > pdfHeight - margin - 30) { // If close to bottom, force new page
                    pdf.addPage();
                    yOffset = margin;
                 } else {
                    yOffset = nextY; // Continue after the previous element on the same page
                 }
                console.log("Next Y offset after preview:", yOffset);
                return addContentToPdf(analysisResultsDiv, "Analysis Details");
            })
            .then(() => {
                pdf.save('ResumeAnalysis.pdf');
                console.log("PDF generated and download initiated.");
                showToast('Analysis downloaded!', 'success');
            })
            .catch(error => {
                console.error("Error generating PDF:", error);
                showToast(`Failed to generate PDF analysis: ${error.message}`, 'error');
            });
    });
}


// Builder Edit Button
if (editResumeBtn) {
    editResumeBtn.addEventListener('click', () => {
        if (previewSection) previewSection.style.display = 'none';
        if (downloadPdfButton) downloadPdfButton.style.display = 'none'; // Hide download button too
        currentResumeData = null; // Clear data
        if (builderForm) {
            builderForm.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to top of form
        }
    });
}

// Analyzer Improve Button Placeholder
if (improveResumeBtn) {
    improveResumeBtn.addEventListener('click', () => {
        showToast('Improvement function not implemented yet.', 'warning');
    });
}


// --- Toast Notification ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    if (toastMessage) toastMessage.textContent = message;
    toast.className = `toast toast-${type}`; // Base classes + type
    if (toastIcon) toastIcon.textContent = type === 'success' ? '✓' : (type === 'error' ? '✕' : '!'); // Adjust icon

    toast.classList.add('show');
    // Automatically hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
// Allow closing toast manually
const toastCloseButton = document.querySelector('.toast-close');
if (toastCloseButton) {
    toastCloseButton.addEventListener('click', () => {
        const toast = document.getElementById('toast');
        if (toast) toast.classList.remove('show');
    });
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Theme FIRST - applies class to body needed by CSS
    initializeTheme();

    // Render form fields for the initially selected template
    if (templateSelector) { // Check if template selector exists (relevant only for builder)
        renderDynamicFormFields(templateSelector.value);
    } else {
        console.warn("Template selector not found on this page.");
    }

    // Check for PDF libraries needed for Analyzer download
    if (downloadAnalysisBtn && (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined')) {
        console.warn("jsPDF or html2canvas not found. Analysis download disabled.");
        downloadAnalysisBtn.disabled = true;
        downloadAnalysisBtn.title = "PDF download libraries not loaded.";
        downloadAnalysisBtn.style.cursor = 'not-allowed';
        downloadAnalysisBtn.style.opacity = '0.6';
    }

});


// --- END OF script.js ---
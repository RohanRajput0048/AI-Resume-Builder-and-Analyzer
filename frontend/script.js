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
         // This case might need adjustment if the value itself should be set on a property *within* the array object
         // Assuming the path ends with the array index itself if it's just setting the array element
         console.warn(`Direct assignment to array index '${path}' is unusual. Check config.`);
         current[arrayKey][index] = value;
     } else {
        current[finalKey] = value;
     }
}

// --- Helper: Get Nested Object Property ---
function getNestedValue(obj, path) {
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
// Defines the structure and fields for each template
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
        // KD Education seems to be a single object 'details' which is an array in the generator, let's map directly to the array
        { path: 'education.details', type: 'dynamic-list', listType: 'educationKd' },
        { type: 'section-title', title: 'Projects' },
        { path: 'projects', type: 'dynamic-list', listType: 'projectKd' },
        { type: 'section-title', title: 'Technical Skills' },
        { path: 'technicalSkills.languages', label: 'Programming Languages (comma-separated)', type: 'text' },
        { path: 'technicalSkills.frameworks', label: 'Frameworks/Libraries (comma-separated)', type: 'text' },
        { path: 'technicalSkills.databases', label: 'Databases (comma-separated)', type: 'text' },
        { path: 'technicalSkills.tools', label: 'Tools & Editing (comma-separated)', type: 'text' },
        { type: 'section-title', title: 'Courses Taken' },
        { path: 'courses.CSE & Maths', label: 'CSE & Maths Courses (comma-separated)', type: 'text' }, // Key needs quotes
        { path: 'courses.Other', label: 'Other Courses (comma-separated)', type: 'text' },
        { type: 'section-title', title: 'Positions of Responsibility' },
        { path: 'positions', type: 'dynamic-list', listType: 'positionKd' },
        { type: 'section-title', title: 'Miscellaneous' },
        { path: 'misc', type: 'dynamic-list', listType: 'miscKd' },
    ],
};

// --- Dynamic List Item Creators ---
// Refactored to accept a 'basePath' to help with data collection
function createListItemHTML(fields, listType, basePath, index) {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.setAttribute('data-list-type', listType);
    item.setAttribute('data-list-index', index); // Keep track of index

    let innerHTML = `<button type="button" class="remove-item">×</button>`;

    fields.forEach(field => {
        const fieldPath = `${basePath}[${index}].${field.path}`;
        const inputId = fieldPath.replace(/[\[\].]/g, '-'); // Create unique ID

        innerHTML += `<div class="form-group">`;
        innerHTML += `<label for="${inputId}">${field.label}</label>`;
        if (field.type === 'textarea') {
            innerHTML += `<textarea id="${inputId}" class="form-control" data-path="${fieldPath}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>`;
        } else if (field.type === 'points') { // Special type for bullet points
            innerHTML += `<textarea id="${inputId}" class="form-control" data-path="${fieldPath}" placeholder="${field.placeholder || 'Enter points, one per line...'}" rows="4"></textarea>`;
            innerHTML += `<small class="form-text text-muted">Enter each point on a new line.</small>`;
        } else {
            innerHTML += `<input type="${field.type}" id="${inputId}" class="form-control" data-path="${fieldPath}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
        }
        innerHTML += `</div>`;
    });

    item.innerHTML = innerHTML;
    item.querySelector('.remove-item').addEventListener('click', () => item.remove());
    return item;
}


// Specific list item definitions
const dynamicListItemTemplates = {
    // --- Modern ---
    educationModern: [
        { path: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Sc. Computer Science' },
        { path: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' },
        { path: 'duration', label: 'Year or Duration', type: 'text', placeholder: '2018-2022 or 2022' },
    ],
    experienceModern: [
        { path: 'role', label: 'Role', type: 'text', placeholder: 'Software Engineer' },
        { path: 'company', label: 'Company', type: 'text', placeholder: 'Tech Corp' },
        { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Jan 2022 - Present' },
    ],
    // --- Classic ---
    educationClassic: [ // Same as Modern for simplicity in this example
        { path: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Sc. Computer Science' },
        { path: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' },
        { path: 'duration', label: 'Year or Duration', type: 'text', placeholder: '2018-2022 or 2022' },
    ],
    experienceClassic: [ // Same as Modern for simplicity in this example
        { path: 'role', label: 'Role', type: 'text', placeholder: 'Software Engineer' },
        { path: 'company', label: 'Company', type: 'text', placeholder: 'Tech Corp' },
        { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Jan 2022 - Present' },
    ],
    // --- Azurill ---
     educationAzurill: [ // Same as Modern
        { path: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Sc. Computer Science' },
        { path: 'institution', label: 'Institution', type: 'text', placeholder: 'University Name' },
        { path: 'duration', label: 'Year or Duration', type: 'text', placeholder: '2018-2022 or 2022' },
    ],
    experienceAzurill: [ // Same as Modern
        { path: 'role', label: 'Role', type: 'text', placeholder: 'Software Engineer' },
        { path: 'company', label: 'Company', type: 'text', placeholder: 'Tech Corp' },
        { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Jan 2022 - Present' },
    ],
    // --- Bhendi ---
    experienceBhendi: [
        { path: 'title', label: 'Title', type: 'text', placeholder: 'Software Development Engineer' },
        { path: 'company', label: 'Company', type: 'text', placeholder: 'Innovate Inc.' },
        { path: 'duration', label: 'Duration', type: 'text', placeholder: 'Aug 2021 - May 2023' },
        { path: 'location', label: 'Location', type: 'text', placeholder: 'Remote / City, State' },
        { path: 'points', label: 'Points (one per line)', type: 'points' }, // Use special 'points' type
    ],
    projectBhendi: [
        { path: 'title', label: 'Project Title', type: 'text' },
        { path: 'techStack', label: 'Tech Stack (comma-separated)', type: 'text' },
        { path: 'points', label: 'Points (one per line)', type: 'points' },
        { path: 'links.live', label: 'Live Link (Optional)', type: 'url' },
        { path: 'links.github', label: 'GitHub Link (Optional)', type: 'url' },
    ],
    educationBhendi: [
        { path: 'institution', label: 'Institution', type: 'text' },
        { path: 'degree', label: 'Degree', type: 'text' },
        { path: 'duration', label: 'Duration', type: 'text' },
        { path: 'location', label: 'Location (Optional)', type: 'text' },
    ],
    // --- KD ---
    educationKd: [ // Maps to education.details array
        { path: 'degree', label: 'Degree', type: 'text' },
        { path: 'institution', label: 'Institution', type: 'text' },
        { path: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 2022' },
        { path: 'score', label: 'Score/GPA', type: 'text' },
    ],
    projectKd: [
        { path: 'title', label: 'Project Title', type: 'text' },
        { path: 'techStack', label: 'Tech Stack (comma-separated)', type: 'text' },
        { path: 'points', label: 'Points (one per line)', type: 'points' },
        { path: 'links.live', label: 'Live Link (Optional)', type: 'url' },
        { path: 'links.github', label: 'GitHub Link (Optional)', type: 'url' },
    ],
    positionKd: [
        { path: 'title', label: 'Title', type: 'text' },
        { path: 'org', label: 'Organization', type: 'text' },
        { path: 'duration', label: 'Duration', type: 'text' },
        { path: 'desc', label: 'Description', type: 'textarea' },
    ],
    miscKd: [
        { path: 'title', label: 'Title (e.g., Award, Achievement)', type: 'text' },
        { path: 'desc', label: 'Description', type: 'text' },
        { path: 'year', label: 'Year', type: 'text' },
    ]
};

// --- Render Dynamic Form Fields ---
const dynamicFieldsContainer = document.getElementById('dynamic-form-fields');
const templateSelector = document.getElementById('template-selector');

function renderDynamicFormFields(templateName) {
    if (!dynamicFieldsContainer || !templateFieldConfigs[templateName]) {
        console.error("Cannot render fields: Container or config missing for", templateName);
        return;
    }
    dynamicFieldsContainer.innerHTML = ''; // Clear previous fields

    const fields = templateFieldConfigs[templateName];
    fields.forEach(field => {
        const fieldElement = document.createElement('div');

        if (field.type === 'section-title') {
            fieldElement.innerHTML = `<h3 class="section-title">${field.title}</h3>`;
             // Directly append title without form-group wrapper
             dynamicFieldsContainer.appendChild(fieldElement);
             return; // Move to next field
        }

        fieldElement.className = 'form-group'; // Add form-group class here

        const inputId = field.path.replace(/[.\[\]]/g, '-'); // Basic ID generation

        fieldElement.innerHTML += `<label for="${inputId}">${field.label}</label>`;

        if (field.type === 'textarea') {
            fieldElement.innerHTML += `<textarea id="${inputId}" class="form-control" data-path="${field.path}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} rows="3"></textarea>`;
        } else if (field.type === 'dynamic-list') {
            const listContainerId = `${field.listType}-list-${Date.now()}`; // Unique ID for list container
            fieldElement.innerHTML = ''; // Clear label, it's part of the section title typically
            fieldElement.innerHTML += `<div class="dynamic-list" id="${listContainerId}"></div>`;
            fieldElement.innerHTML += `<button type="button" class="add-item-btn" data-list-type="${field.listType}" data-target-list="#${listContainerId}" data-base-path="${field.path}"><span>+</span> Add ${field.listType.replace(/([A-Z])/g, ' $1')}</button>`;

            // Add initial item for usability
            const listContainer = fieldElement.querySelector(`#${listContainerId}`);
             if (listContainer) {
                 const itemFields = dynamicListItemTemplates[field.listType];
                 if(itemFields) {
                     listContainer.appendChild(createListItemHTML(itemFields, field.listType, field.path, 0));
                 } else {
                    console.warn(`No item template found for list type: ${field.listType}`);
                 }
             }

        } else if (field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'url' || field.type === 'month') {
             // Handle nested paths like 'links.linkedin' or 'technicalSkills.languages'
            fieldElement.innerHTML += `<input type="${field.type}" id="${inputId}" class="form-control" data-path="${field.path}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
        } else {
            console.warn("Unsupported field type:", field.type);
        }
         dynamicFieldsContainer.appendChild(fieldElement);
    });
}

// --- Event Listener for Template Selector ---
templateSelector.addEventListener('change', (e) => {
    renderDynamicFormFields(e.target.value);
    // Hide preview and download button when template changes
    document.getElementById('resume-preview-section').style.display = 'none';
    document.getElementById('download-generated-pdf').style.display = 'none';
});

// --- Event Delegation for Adding Dynamic List Items ---
dynamicFieldsContainer.addEventListener('click', function(e) {
    if (e.target && e.target.closest('.add-item-btn')) {
        const button = e.target.closest('.add-item-btn');
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
        }
    }
});


// --- Resume Builder Form Submission (Preview & Prepare for PDF) ---
const builderForm = document.getElementById('resume-builder-form');
const previewSection = document.getElementById('resume-preview-section');
const previewContainer = document.getElementById('resume-preview');
const downloadPdfButton = document.getElementById('download-generated-pdf'); // Get the button
let currentResumeData = null; // Store data for PDF generation

builderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log("Builder form submitted");
    showToast('Generating preview...', 'success');

    try {
        currentResumeData = collectFormData(); // Collect data based on current fields
        if (!currentResumeData) {
             throw new Error("Could not collect form data.");
        }
        console.log("Collected Data for Preview:", currentResumeData);
        generateResumePreview(currentResumeData); // Generate HTML preview
        populateBuilderAnalysis(); // Simulate analysis
        previewSection.style.display = 'block';
        downloadPdfButton.style.display = 'block'; // Show PDF download button
        previewSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Error during builder preview generation:", error);
        showToast(`Error generating preview: ${error.message}`, 'error');
        downloadPdfButton.style.display = 'none';
        currentResumeData = null;
    }
});

// --- Collect Form Data based on Dynamic Fields ---
function collectFormData() {
    const selectedTemplate = templateSelector.value;
    const config = templateFieldConfigs[selectedTemplate];
    if (!config) return null;

    const data = {};

    // Process simple fields and textareas first
    dynamicFieldsContainer.querySelectorAll('input[data-path], textarea[data-path]').forEach(input => {
        const path = input.dataset.path;
        let value = input.value.trim();
         // Handle comma-separated fields -> arrays
        if (path.includes('skills') || path.includes('languages') || path.includes('frameworks') || path.includes('databases') || path.includes('tools') || path.includes('courses') || path.includes('techStack')) {
             if(value) {
                value = value.split(',').map(s => s.trim()).filter(s => s); // Split, trim, filter empty
             } else {
                value = []; // Use empty array if input is empty
             }
        }
        setNestedValue(data, path, value);
    });

    // Process dynamic lists
    config.filter(field => field.type === 'dynamic-list').forEach(listField => {
        const listContainer = dynamicFieldsContainer.querySelector(`.add-item-btn[data-base-path="${listField.path}"]`)?.previousElementSibling;
         if (listContainer) {
             const itemsData = [];
             listContainer.querySelectorAll('.list-item').forEach((item, index) => {
                 const itemData = {};
                 item.querySelectorAll('input[data-path], textarea[data-path]').forEach(input => {
                      const itemPath = input.dataset.path; // e.g., "experience[0].role"
                      // Extract the property name from the full path (e.g., "role" from "experience[0].role")
                      const propNameMatch = itemPath.match(/\.(\w+)$/);
                      if (propNameMatch) {
                          const propName = propNameMatch[1];
                          let value = input.value.trim();
                           // Handle 'points' textarea -> array
                           if (input.matches('textarea') && propName === 'points') {
                                value = value.split('\n').map(p => p.trim()).filter(p => p); // Split by newline, trim, filter empty
                           }
                          itemData[propName] = value;
                      }
                 });
                 // Only add item if it has some data (e.g., at least one non-empty field)
                 if (Object.values(itemData).some(v => (typeof v === 'string' && v !== '') || (Array.isArray(v) && v.length > 0))) {
                     itemsData.push(itemData);
                 }
             });
             // Set the collected array data using the base path (e.g., 'experience')
             setNestedValue(data, listField.path, itemsData);
         }
    });

    return data;
}


// --- Generate Resume Preview HTML (Adapted for Dynamic Data) ---
function generateResumePreview(data) {
    if (!previewContainer || !data) {
         console.error("Preview container or data missing");
         previewContainer.innerHTML = '<p>Error generating preview.</p>';
         return;
    }
    previewContainer.innerHTML = ''; // Clear previous

    const selectedTemplate = templateSelector.value; // Get current template

    // --- Use helper functions to get data safely based on common potential paths ---
    // Adjust these paths based on your template configs if needed
    const getName = () => data.name || 'Name Not Provided';
    const getEmail = () => data.email || '';
    const getPhone = () => data.phone || '';
    const getLinkedIn = () => getNestedValue(data, 'links.linkedin') || '';
    const getGithub = () => getNestedValue(data, 'links.github') || '';
    const getWebsite = () => getNestedValue(data, 'links.website') || '';
    // Simple text fields might exist directly
    const getJobTitle = () => data.jobTitle || ''; // Example: modern/classic might have this top-level
    const getLocation = () => data.location || ''; // Example: modern/classic might have this top-level

    // --- Generic Helpers ---
    const formatDateRange = (start, end, isCurrent = false) => { /* ... (keep existing) ... */
        const options = { month: 'short', year: 'numeric', timeZone: 'UTC' };
        let startDate = ''; let endDate = 'Present';
        try { if (start) startDate = new Date(start + '-02').toLocaleDateString('en-US', options); } catch (e) { console.warn("Invalid start date:", start); }
        if (!isCurrent && end) { try { endDate = new Date(end + '-02').toLocaleDateString('en-US', options); } catch (e) { console.warn("Invalid end date:", end); endDate = '';} } else if (isCurrent) { endDate = 'Present'; } else { endDate = ''; }
        if (startDate && endDate) return `${startDate} - ${endDate}`; if (startDate) return startDate; return '';
    };
    const createLinkHTML = (url, text, cssClass = '') => { /* ... (keep existing) ... */
         if (!url) return ''; let safeUrl = url.trim(); if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && safeUrl.includes('@')) { return `<span><a href="mailto:${safeUrl}" class="${cssClass}">${text || safeUrl}</a></span>`; } if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) { safeUrl = `https://${safeUrl}`; } try { new URL(safeUrl); return `<span><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${cssClass}">${text || url}</a></span>`; } catch (e) { console.warn("Invalid URL:", url); return `<span>${text || url} (invalid link)</span>`; }
     };
    const formatPoints = (points) => {
        if (!Array.isArray(points) || points.length === 0) return '';
        return `<ul style="margin-top: 5px; padding-left: 20px; list-style: disc;">${points.map(p => `<li>${p}</li>`).join('')}</ul>`;
    };


    // --- Generate HTML ---
    let resumeHTML = `<div class="resume-section"><h1 style="font-size: 1.8rem; margin-bottom: 5px;">${getName()}</h1>`;
    if (getJobTitle()) resumeHTML += `<p style="color: var(--primary); font-size: 1.2rem; margin-bottom: 10px;">${getJobTitle()}</p>`;

    // Contact Info (gather all available)
    const contactInfo = [
        createLinkHTML(getEmail(), getEmail()),
        getPhone() ? `<span>${getPhone()}</span>` : '',
        getLocation() ? `<span>${getLocation()}</span>` : '',
        createLinkHTML(getLinkedIn(), 'LinkedIn'),
        createLinkHTML(getGithub(), 'GitHub'),
        createLinkHTML(getWebsite(), 'Portfolio/Website')
    ].filter(Boolean).join(' | '); // Simple join for preview
     resumeHTML += `<div style="display: flex; flex-wrap: wrap; gap: 5px 15px; font-size: 0.9rem; color: var(--gray); margin-bottom: 15px;">${contactInfo}</div></div>`;


    // Summary (if present)
    if(data.summary) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Summary</div><p>${data.summary.replace(/\n/g, '<br>')}</p></div>`;
    }

    // Experience (check common paths)
    const experiences = data.experience || []; // Bhendi, Modern, Classic, Azurill use 'experience' array
    if (experiences.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Work Experience</div>`;
        experiences.forEach(exp => {
            resumeHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${exp.title || exp.role || exp.position || 'Position'}</div>
                    <div class="resume-item-subtitle">${exp.company || 'Company'} ${exp.location ? `(${exp.location})` : ''}</div>
                    <div class="resume-item-date">${exp.duration || formatDateRange(exp.start, exp.end, exp.isCurrent)}</div>
                    ${exp.description ? `<div class="resume-item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                    ${formatPoints(exp.points)}
                </div>`;
        });
        resumeHTML += `</div>`;
    }

    // Education (check common paths)
    const educationItems = data.education?.details || data.education || []; // KD uses details, others use education directly
     if (educationItems.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
        educationItems.forEach(edu => {
             resumeHTML += `
                 <div class="resume-item">
                     <div class="resume-item-title">${edu.degree || 'Degree'}</div>
                     <div class="resume-item-subtitle">${edu.institution || edu.school || 'Institution'} ${edu.location ? `(${edu.location})` : ''}</div>
                     <div class="resume-item-date">${edu.duration || edu.year || formatDateRange(edu.start, edu.end)} ${edu.score ? `- Score: ${edu.score}` : ''}</div>
                      ${edu.description ? `<div class="resume-item-description">${edu.description.replace(/\n/g, '<br>')}</div>` : ''}
                 </div>`;
        });
        resumeHTML += `</div>`;
    }

    // Skills (check common paths)
    let allSkills = [];
    if (Array.isArray(data.skills)) allSkills = data.skills; // Modern, Classic, Azurill
    else if (typeof data.skills === 'string' && data.skills) allSkills = data.skills.split(',').map(s => s.trim()).filter(s => s); // If somehow it's a string

    if (data.technicalSkills) { // Bhendi, KD
        Object.values(data.technicalSkills).forEach(skillCategory => {
             if (Array.isArray(skillCategory)) allSkills.push(...skillCategory);
        });
    }
    allSkills = [...new Set(allSkills)]; // Remove duplicates

    if (allSkills.length > 0) {
        resumeHTML += `
            <div class="resume-section"><div class="resume-section-title">Skills</div>
            <div class="skills-list">${allSkills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}</div></div>`;
    }

     // Projects (check common paths)
    const projects = data.projects || []; // Bhendi, KD use 'projects' array
    if (projects.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Projects</div>`;
        projects.forEach(proj => {
            const tech = Array.isArray(proj.techStack) ? proj.techStack.join(', ') : (proj.tech || '');
            const projLinks = [
                createLinkHTML(getNestedValue(proj, 'links.live'), 'Live Demo'),
                createLinkHTML(getNestedValue(proj, 'links.github'), 'GitHub')
             ].filter(Boolean).join(' | ');

             resumeHTML += `
                 <div class="resume-item">
                     <div class="resume-item-title">${proj.title || proj.name || 'Project Name'}</div>
                     ${tech ? `<div class="resume-item-subtitle">Technologies: ${tech}</div>` : ''}
                     ${projLinks ? `<div class="resume-item-subtitle">${projLinks}</div>` : ''}
                     ${proj.description ? `<div class="resume-item-description">${proj.description.replace(/\n/g, '<br>')}</div>` : ''}
                     ${formatPoints(proj.points)}
                 </div>`;
        });
        resumeHTML += `</div>`;
    }

     // KD Specific Sections
    if (selectedTemplate === 'kd') {
        if(data.courses) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Courses Taken</div>`;
            if(data.courses['CSE & Maths']?.length) resumeHTML += `<p><strong>CSE & Maths:</strong> ${data.courses['CSE & Maths'].join(', ')}</p>`;
            if(data.courses['Other']?.length) resumeHTML += `<p><strong>Other:</strong> ${data.courses['Other'].join(', ')}</p>`;
            resumeHTML += `</div>`;
        }
        if(data.positions?.length) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Positions of Responsibility</div>`;
            data.positions.forEach(pos => {
                resumeHTML += `<div class="resume-item">
                    <div class="resume-item-title">${pos.title}, ${pos.org}</div>
                    <div class="resume-item-date">${pos.duration}</div>
                    ${pos.desc ? `<div class="resume-item-description">${pos.desc.replace(/\n/g, '<br>')}</div>` : ''}
                 </div>`;
            });
            resumeHTML += `</div>`;
        }
         if(data.misc?.length) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Miscellaneous</div>`;
             data.misc.forEach(item => {
                resumeHTML += `<div class="resume-item">
                    <div class="resume-item-title">${item.title}</div>
                     ${item.desc ? `<div class="resume-item-subtitle">${item.desc} (${item.year || ''})</div>` : ''}
                 </div>`;
            });
            resumeHTML += `</div>`;
        }
    }

    previewContainer.innerHTML = resumeHTML;
}


// --- Populate Builder Analysis (Simulated - Keep as is) ---
function populateBuilderAnalysis() {
    const suggestionsContainer = document.getElementById('builder-ai-suggestions');
    if (!suggestionsContainer) return;
    suggestionsContainer.innerHTML = '';
    const suggestions = [ { type: 'positive', text: 'Clear contact information.' }, { type: 'suggestion', text: 'Quantify achievements in experience section (e.g., "Increased X by Y%").' }, { type: 'suggestion', text: 'Consider adding a dedicated awards or certifications section if applicable.' } ];
    suggestions.forEach(suggestion => {
        const { className, symbol } = getSuggestionIconClassAndSymbol(suggestion.type, suggestion.text);
        suggestionsContainer.innerHTML += `<div class="analysis-item"><div class="analysis-item-icon ${className}">${symbol}</div><div class="analysis-item-text">${suggestion.text}</div></div>`;
    });

    const score = Math.floor(Math.random() * 26) + 70; // 70-95
    const scoreCircle = document.getElementById('builder-score-circle');
    const scoreText = document.getElementById('builder-score-text');
    if (scoreCircle) scoreCircle.textContent = score;
    if (scoreCircle) scoreCircle.className = `score-circle ${getScoreClass(score)}`;
    if (scoreText) scoreText.innerHTML = score >= 85 ? '<p>Strong foundation! Review suggestions for minor improvements.</p>' : '<p>Good start! Consider the suggestions to enhance your resume.</p>';
}

// --- PDF Download Button Action (Builder Section) ---
downloadPdfButton.addEventListener('click', async () => { // Make the listener async
    if (!currentResumeData) {
        showToast('Please generate the preview first using "Generate Resume Preview".', 'error');
        return;
    }
    const selectedTemplate = templateSelector.value;
    if (!selectedTemplate) {
        showToast('Please select a template.', 'error');
        return;
    }

    showToast('Generating PDF...', 'success');
    downloadPdfButton.disabled = true;
    downloadPdfButton.textContent = 'Generating...';

    try {
        console.log("Sending data to backend for PDF generation:", { template: selectedTemplate, data: currentResumeData });

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
                // Try to get more specific error from backend response
                const errorData = await response.json();
                console.error("Backend error response:", errorData);
                errorMsg = errorData.message || errorMsg;
            } catch (e) {
                // If response is not JSON, use the status text
                 errorMsg = `${errorMsg}: ${response.statusText || 'Server error'}`;
                console.error("Could not parse error response as JSON.");
            }
            throw new Error(errorMsg);
        }

        // --- Handle the PDF Blob ---
        const blob = await response.blob();
        if (blob.type !== 'application/pdf') {
            throw new Error('Server did not return a PDF file.');
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // --- Create filename ---
        // Use user's name from data if available, otherwise fallback
        const username = currentResumeData?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume';
        const filename = `${username}_${selectedTemplate}.pdf`;
        a.download = filename;

        document.body.appendChild(a);
        a.click();

        // --- Cleanup ---
        window.URL.revokeObjectURL(url);
        a.remove();

        showToast('PDF downloaded successfully!', 'success');

    } catch (error) {
        console.error('Error generating or downloading PDF:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        // --- Reset button state ---
        downloadPdfButton.disabled = false;
        downloadPdfButton.textContent = 'Download PDF';
    }
});


// --- Resume Analyzer Logic ---

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('resume-file');
const uploadButton = document.getElementById('upload-btn');
const jobDescriptionInput = document.getElementById('job-description');
const loadingIndicator = document.getElementById('analysis-loading');
const resultsSection = document.getElementById('analysis-results-section');

if (uploadButton) {
    uploadButton.addEventListener('click', () => fileInput.click());
}
if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragging'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragging'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragging');
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (isValidFileType(file)) { fileInput.files = e.dataTransfer.files; handleFileUpload(file); }
            else { showToast('Invalid file type. Please upload a PDF.', 'error'); }
        }
    });
}
if(fileInput) {
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
             const file = fileInput.files[0];
             if (isValidFileType(file)) { handleFileUpload(file); }
             else { showToast('Invalid file type. Please upload a PDF.', 'error'); fileInput.value = ''; }
        }
    });
}

function isValidFileType(file) { return file && file.type === 'application/pdf'; }

// Handle File Upload and API Call (Analyzer)
async function handleFileUpload(file) {
    const jobDescription = jobDescriptionInput.value.trim();
    if (!jobDescription) { showToast('Please paste the Job Description first.', 'error'); jobDescriptionInput.focus(); return; }
    if (!file) { showToast('Please select a resume file to upload.', 'error'); return; }

    // Update UI: Show loading, hide upload/results
    if (uploadArea) uploadArea.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    const formData = new FormData();
    formData.append('resume', file); // Key must match backend multer setup
    formData.append('jobDescription', jobDescription);

    try {
        console.log("Sending analysis request to backend...");
        const response = await fetch(`${backendUrl}/api/resume/analyze`, { method: 'POST', body: formData });
        console.log("Received response from backend. Status:", response.status);

        if (!response.ok) {
            let errorMsg = `Analysis failed (${response.status})`;
            try {
                const errorData = await response.json();
                console.error("Backend error response:", errorData);
                errorMsg = errorData.message || errorMsg;
            } catch (e) { console.error("Could not parse error response as JSON."); }
            throw new Error(errorMsg);
        }

        // --- Parse JSON Response ---
        let analysisData;
        try {
            console.log("Attempting to parse response JSON...");
            analysisData = await response.json();
            console.log("Successfully parsed JSON:", analysisData); // Log the actual data
        } catch (jsonError) {
            console.error("Failed to parse JSON response from backend:", jsonError);
            showToast('Received an invalid format from the server.', 'error');
            throw new Error("Invalid JSON received");
        }

        // --- Render results ---
        if (analysisData) {
            console.log("Rendering analysis results...");
            renderAnalysisResults(analysisData);
            console.log("Rendering resume preview...");
            renderUploadedResumePreview(analysisData);
            if (resultsSection) resultsSection.style.display = 'block';
            if (resultsSection) resultsSection.scrollIntoView({ behavior: 'smooth' });
            showToast('Resume analyzed successfully!', 'success');
        } else {
             throw new Error("Parsed analysis data is empty."); // Should not happen if parsing succeeds, but good practice
        }

    } catch (err) { // Catch network errors or errors thrown above
        console.error("Error in handleFileUpload:", err);
        showToast(`Analysis Error: ${err.message}`, 'error');
        if (uploadArea) uploadArea.style.display = 'block'; // Show upload area again on error
        if (fileInput) fileInput.value = ''; // Reset file input
    } finally {
        // Ensure loading indicator is always hidden afterwards
         if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// --- Render Analysis Results (Right Side - Analyzer) ---
function renderAnalysisResults(analysisData) {
     console.log("Inside renderAnalysisResults");
    if (!analysisData) return; // Safety check

    try {
        // Score
        const scoreCircle = document.getElementById('analyzer-score-circle');
        const scoreText = document.getElementById('analyzer-score-text');
        const score = analysisData.score || 0;
        if (scoreCircle) scoreCircle.textContent = score;
        if (scoreCircle) scoreCircle.className = `score-circle ${getScoreClass(score)}`;
        if (scoreText) scoreText.innerHTML = `<p>${analysisData.summaryFeedback || 'Analysis complete. See suggestions.'}</p>`;

        // Keywords
        const keywordsContainer = document.getElementById('analyzer-keyword-matches');
        if (keywordsContainer) {
            keywordsContainer.innerHTML = '<p style="margin-bottom: 10px; font-size: 0.9rem;">Job Keyword Matches:</p>';
            const foundKeywords = analysisData.keywordMatches?.found || [];
            const missingKeywords = analysisData.keywordMatches?.missing || [];
            foundKeywords.forEach(k => { keywordsContainer.innerHTML += `<div class="keyword-item"><span class="keyword-name">${k}</span><span class="keyword-status found">Found</span></div>`; });
            missingKeywords.forEach(k => { keywordsContainer.innerHTML += `<div class="keyword-item"><span class="keyword-name">${k}</span><span class="keyword-status missing">Missing</span></div>`; });
            if (!foundKeywords.length && !missingKeywords.length) { keywordsContainer.innerHTML += '<p>No keyword analysis available.</p>'; }
        }

        // Section Strength
        const strengthContainer = document.getElementById('analyzer-section-strength');
         if (strengthContainer) {
            strengthContainer.innerHTML = '';
            const sectionScores = analysisData.sectionAnalysis || {};
            // Use a flexible approach: render any section found in sectionAnalysis
             const sectionOrder = ['workExperience', 'skills', 'education', 'summary', 'projects']; // Preferred order
             let analysisRendered = false;
             const renderedKeys = new Set();

             // Render in preferred order first
             sectionOrder.forEach(key => {
                if (sectionScores.hasOwnProperty(key) && sectionScores[key] !== null && sectionScores[key] !== undefined) {
                     renderStrengthBar(strengthContainer, key, sectionScores[key]);
                     renderedKeys.add(key);
                     analysisRendered = true;
                 }
             });

             // Render any remaining keys not in the preferred order
             Object.keys(sectionScores).forEach(key => {
                 if (!renderedKeys.has(key) && sectionScores[key] !== null && sectionScores[key] !== undefined) {
                     renderStrengthBar(strengthContainer, key, sectionScores[key]);
                     analysisRendered = true;
                 }
             });


            if (!analysisRendered) { strengthContainer.innerHTML = '<p>Section analysis unavailable.</p>'; }
        }

        // Suggestions
        const suggestionsContainer = document.getElementById('analyzer-ai-suggestions');
         if (suggestionsContainer) {
            suggestionsContainer.innerHTML = '';
            const suggestions = analysisData.suggestions || [];
            if (suggestions.length > 0) {
                suggestions.forEach(text => {
                    const { className, symbol } = getSuggestionIconClassAndSymbol(null, text);
                    suggestionsContainer.innerHTML += `
                        <div class="analysis-item">
                            <div class="analysis-item-icon ${className}">${symbol}</div>
                            <div class="analysis-item-text">${text}</div>
                        </div>`;
                });
            } else { suggestionsContainer.innerHTML = '<p>No specific suggestions provided.</p>'; }
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
        <div style="margin-bottom: 15px;">
            <p style="margin-bottom: 5px; font-size: 0.9rem;">${displayName}</p>
            <div class="progress-container"><div class="progress-bar" style="width: ${scoreValue}%;"></div></div>
            <div class="progress-label"><span>${label}</span><span>${scoreValue}%</span></div>
        </div>`;
}


// --- Render Resume Preview from Analysis (Left Side - Analyzer) ---
function renderUploadedResumePreview(analysisData) {
    console.log("Inside renderUploadedResumePreview");
    const previewContainer = document.getElementById('analyzer-resume-preview');
    if (!previewContainer) return; // Safety check
    previewContainer.innerHTML = ''; // Clear previous content

    if (!analysisData) {
        previewContainer.innerHTML = '<p>Error: No analysis data received for preview.</p>';
        return;
    }

    try {
        const userInfo = analysisData.userInfo || {};
        const summary = analysisData.summary || '';
        const skills = analysisData.skills || [];
        const experiences = analysisData.experienceDetails || [];
        // Ensure projects is always an array, even if null/undefined in response
        const projects = Array.isArray(analysisData.projects) ? analysisData.projects : [];
        const generalLinks = Array.isArray(analysisData.links) ? analysisData.links : [];
        // Assume education might be nested or flat - check common structures
        let educationItems = [];
        if (Array.isArray(analysisData.educationDetails)) {
             educationItems = analysisData.educationDetails;
        } else if (analysisData.education && Array.isArray(analysisData.education.details)) { // KD structure
             educationItems = analysisData.education.details;
        } else if (Array.isArray(analysisData.education)) { // Simpler structure
             educationItems = analysisData.education;
        }


        let resumeHTML = '';

        // Helper function to safely create links (re-defined locally for clarity)
        const createLink = (url, text, cssClass = '') => {
             if (!url) return '';
             let safeUrl = url.trim();
             if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && safeUrl.includes('@')) { return `<span><a href="mailto:${safeUrl}" class="${cssClass}">${text || safeUrl}</a></span>`; }
             if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) { safeUrl = `https://${safeUrl}`; }
             try { new URL(safeUrl); return `<span><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${cssClass}">${text || url}</a></span>`; }
             catch (e) { return `<span>${text || url} (invalid link)</span>`; }
        };
         // Helper to format points from analysis data (which might be a single string)
        const formatAnalysisPoints = (description) => {
            if (!description || typeof description !== 'string') return '';
            // Assume bullet points might start with *, -, or •, followed by a space
            const points = description.split('\n').map(p => p.trim()).filter(p => p);
            if (points.length <= 1 && !points[0]?.match(/^[\*\-\•]\s/)) {
                 // Not obviously a list, return as paragraph(s)
                 return `<div class="resume-item-description">${description.replace(/\n/g, '<br>')}</div>`;
            }
            // Likely a list
            return `<ul style="margin-top: 5px; padding-left: 20px; list-style: disc;">${points.map(p => `<li>${p.replace(/^[\*\-\•]\s*/, '')}</li>`).join('')}</ul>`;
        };


        // --- User Info / Header ---
        resumeHTML += `
            <div class="resume-section">
                <h1 style="font-size: 1.8rem; margin-bottom: 5px;">${userInfo.name || 'Name Not Found'}</h1>
                ${experiences.length > 0 && experiences[0].jobTitle ? `<p style="color: var(--primary); font-size: 1.2rem; margin-bottom: 10px;">${experiences[0].jobTitle}</p>` : ''}
                <div style="display: flex; flex-wrap: wrap; gap: 5px 15px; font-size: 0.9rem; color: var(--gray);">
                    ${createLink(userInfo.email, userInfo.email)}
                    ${userInfo.phone ? `<span>${userInfo.phone}</span>` : ''}
                    ${userInfo.address ? `<span>${userInfo.address}</span>` : ''}
                    ${generalLinks.map(link => createLink(link.url || link, link.type || 'Link')).join('')}
                </div>
            </div>
        `;

        // --- Summary ---
        if (summary) { resumeHTML += `<div class="resume-section"><div class="resume-section-title">Summary</div><p>${summary.replace(/\n/g, '<br>')}</p></div>`; }

        // --- Experience ---
        const validExperiences = experiences.filter(exp => exp.jobTitle || exp.description);
        if (validExperiences.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Work Experience</div>`;
            validExperiences.forEach(exp => {
                resumeHTML += `<div class="resume-item">
                                 ${exp.jobTitle ? `<div class="resume-item-title">${exp.jobTitle}</div>` : ''}
                                 ${exp.company ? `<div class="resume-item-subtitle">${exp.company}</div>` : ''}
                                 ${exp.duration ? `<div class="resume-item-date">${exp.duration}</div>` : ''}
                                 ${formatAnalysisPoints(exp.description)}
                               </div>`; });
            resumeHTML += `</div>`;
        }

        // --- Education ---
        const validEducation = educationItems.filter(edu => edu.degree || edu.institution || edu.school);
         if (validEducation.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
            validEducation.forEach(edu => {
                 resumeHTML += `<div class="resume-item">
                                  ${edu.degree ? `<div class="resume-item-title">${edu.degree}</div>` : ''}
                                  ${edu.institution || edu.school ? `<div class="resume-item-subtitle">${edu.institution || edu.school}</div>` : ''}
                                  ${edu.duration || edu.year ? `<div class="resume-item-date">${edu.duration || edu.year}</div>` : ''}
                                  ${formatAnalysisPoints(edu.description)}
                              </div>`; });
            resumeHTML += `</div>`;
        }

        // --- Skills ---
        if (skills.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Skills</div>
                           <div class="skills-list">${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}</div></div>`;
        }

        // --- Projects ---
        const validProjects = projects.filter(proj => proj.projectName || proj.projectDescription);
        if (validProjects.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Projects</div>`;
            validProjects.forEach(project => {
                const tools = Array.isArray(project.toolsUsed) ? project.toolsUsed.join(', ') : '';
                const projectLinks = Array.isArray(project.links) ? project.links : [];
                resumeHTML += `
                     <div class="resume-item">
                         ${project.projectName ? `<div class="resume-item-title">${project.projectName}</div>` : ''}
                         ${tools ? `<div class="resume-item-subtitle">Technologies: ${tools}</div>` : ''}
                         ${project.date ? `<div class="resume-item-date">${project.date}</div>` : ''}
                         ${formatAnalysisPoints(project.projectDescription)}
                         ${projectLinks.length > 0 ? `<div class="resume-item-links" style="margin-top: 5px;">${projectLinks.map(link => createLink(link, 'Project Link', 'resume-project-link')).join(' | ')}</div>` : ''}
                     </div>`;
            });
            resumeHTML += `</div>`;
        }

        // --- Fallback if no content ---
         if (!userInfo.name && !summary && skills.length === 0 && validExperiences.length === 0 && validProjects.length === 0 && validEducation.length === 0) {
             resumeHTML = `<div style="padding: 20px; text-align: center; color: var(--gray);"><p>Could not parse sufficient resume content for preview.</p><p>Please check the analysis results.</p></div>`;
         }

        previewContainer.innerHTML = resumeHTML;

    } catch (error) {
        console.error("Error rendering uploaded resume preview:", error);
        previewContainer.innerHTML = '<p>Error displaying resume preview.</p>';
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
    let symbol = '•'; let className = 'suggestion'; // Default to suggestion
    const lowerText = text ? text.toLowerCase() : '';
    // Explicit types first if available (though analysis data doesn't seem to provide them)
    if (type === 'positive') { symbol = '✓'; className = 'positive'; }
    else if (type === 'negative') { symbol = '❌'; className = 'negative'; }
    else if (type === 'suggestion') { symbol = '💡'; className = 'suggestion'; }
    // Infer from text content as fallback
    else if (lowerText) {
         if (lowerText.includes('excellent') || lowerText.includes('strong') || lowerText.includes('well done') || lowerText.includes('clear') || lowerText.includes('good job')) { symbol = '✓'; className = 'positive'; }
         else if (lowerText.includes('missing') || lowerText.includes('lack') || lowerText.includes('unclear') || lowerText.includes('vague') || lowerText.includes('weak') || lowerText.includes('generic') || lowerText.includes('too short') || lowerText.includes('too long') || lowerText.includes('consider removing')) { symbol = '❌'; className = 'negative'; }
         else if (lowerText.includes('consider') || lowerText.includes('add') || lowerText.includes('quantify') || lowerText.includes('improve') || lowerText.includes('expand') || lowerText.includes('tailor') || lowerText.includes('suggest') || lowerText.includes('recommend')) { symbol = '💡'; className = 'suggestion'; }
    }
    return { className, symbol };
}

// --- Button Actions ---
// PDF Download for Analysis Tab
document.getElementById('download-analysis')?.addEventListener('click', () => {
    console.log("Download Analysis button clicked.");
    const elementToCapture = document.getElementById('analysis-results-section'); // Capture the whole results section
    const previewElement = document.getElementById('analyzer-resume-preview'); // Also capture preview

    if (!elementToCapture || elementToCapture.style.display === 'none' || !previewElement ) { // Preview doesn't need to be displayed, just needs content
        showToast('No analysis results or preview content to download.', 'error'); return;
    }
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        console.error("jsPDF or html2canvas library not loaded!");
        showToast('Error preparing download. Libraries not found.', 'error'); return;
    }
    const { jsPDF } = jspdf;
    showToast('Preparing download...', 'success');

    // A4 Dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let yOffset = margin; // Start with top margin

    const addContentToPdf = async (element, title) => {
        const options = { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: -window.scrollY, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight };
        try {
            const canvas = await html2canvas(element, options);
            const imgData = canvas.toDataURL('image/png');
            const imgProps= pdf.getImageProperties(imgData);
            const imgWidth = contentWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = yOffset; // Position for the current image chunk

            // Add Title
            pdf.setFontSize(14);
            pdf.setTextColor(40, 40, 40); // Dark grey
            pdf.text(title, margin, position);
            position += 10; // Space after title
            heightLeft += 10; // Account for title space

            // Check if content fits on the current page, considering title space
            if (position + imgHeight > pdfHeight - margin) {
                 // Doesn't fit, add new page if not the first element
                 if (yOffset > margin) {
                     pdf.addPage();
                     position = margin; // Reset position to top margin
                     // Add Title again on new page
                     pdf.setFontSize(14);
                     pdf.text(title, margin, position);
                     position += 10;
                     heightLeft = imgHeight + 10; // Reset heightLeft for the new page
                 } else {
                    // If the first element itself is too tall, let jsPDF handle splitting (though it might cut mid-element)
                    console.warn("PDF Generation: Initial element might be too tall for one page.");
                 }
            }

            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - position - margin); // Usable height remaining on the current page

            // Add subsequent pages if needed
            while (heightLeft > 0) {
                 position = margin - heightLeft; // Calculate position for the next chunk (negative offset from top)
                 pdf.addPage();
                 pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                 heightLeft -= (pdfHeight - margin*2); // Reduce heightLeft by full page height
             }

            return position + imgHeight + 10; // Return the Y position for the *start* of the next element (add spacing)

        } catch (error) {
            console.error(`Error processing element for PDF: ${title}`, error);
            throw new Error(`Failed to capture ${title} for PDF.`); // Re-throw to be caught by outer catch
        }
    };

    // Chain the promises to add elements sequentially
    addContentToPdf(previewElement, "Resume Preview")
        .then(nextY => {
             // Ensure next element starts below the previous one, even if it spanned pages
            yOffset = pdf.internal.getNumberOfPages() > 1 ? margin : nextY; // Start on new page or after previous element + margin
             if (pdf.internal.getNumberOfPages() > 1 && nextY < margin + 5) { // Check if we are already on a new page
                 yOffset = margin; // Ensure we start at the top margin of the new page
             } else if (nextY > pdfHeight - margin - 20) { // If near bottom, force new page
                 pdf.addPage();
                 yOffset = margin;
             }
            console.log("Next Y offset after preview:", yOffset);
            // Capture just the .analysis-results div within the results section
            const analysisResultsElement = elementToCapture.querySelector('.analysis-results');
            if (!analysisResultsElement) throw new Error("Analysis results container not found.");
            return addContentToPdf(analysisResultsElement, "Analysis Details");
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


// Builder Edit Button
document.getElementById('edit-resume')?.addEventListener('click', () => {
     previewSection.style.display = 'none';
     downloadPdfButton.style.display = 'none'; // Hide download button too
     currentResumeData = null; // Clear data
     builderForm.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to top of form
});

// Analyzer Improve Button Placeholder
document.getElementById('improve-resume')?.addEventListener('click', () => { showToast('Improvement function not implemented.', 'error'); });


// --- Toast Notification ---
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    if (toastMessage) toastMessage.textContent = message;
    toast.className = `toast toast-${type}`; // Ensure correct class
    if (toastIcon) toastIcon.textContent = type === 'success' ? '✓' : '✕';

    toast.classList.add('show');
    // Automatically hide after 3 seconds
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}
// Allow closing toast manually
document.querySelector('.toast-close')?.addEventListener('click', () => {
    document.getElementById('toast')?.classList.remove('show');
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Render fields for the initially selected template
    renderDynamicFormFields(templateSelector.value);

    // Add jsPDF/html2canvas check for Analyzer download button
    const downloadAnalysisBtn = document.getElementById('download-analysis');
     if (downloadAnalysisBtn && (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined')) {
         console.warn("jsPDF or html2canvas not found. Analysis download disabled.");
         downloadAnalysisBtn.disabled = true;
         downloadAnalysisBtn.title = "PDF download libraries not loaded.";
         downloadAnalysisBtn.style.cursor = 'not-allowed';
         downloadAnalysisBtn.style.opacity = '0.6';
    }

});


// --- END OF FILE script.js ---
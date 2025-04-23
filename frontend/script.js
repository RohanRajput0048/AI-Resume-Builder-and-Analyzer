// --- START OF FILE script.js ---

// --- Tab Switching ---
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

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

// --- Resume Builder: Dynamic Lists ---
function createEducationItem() {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <button type="button" class="remove-item">×</button>
        <div class="two-columns">
            <div class="form-group"><label>School/University</label><input type="text" class="form-control education-school" placeholder="University Name"></div>
            <div class="form-group"><label>Degree</label><input type="text" class="form-control education-degree" placeholder="B.Sc. Computer Science"></div>
        </div>
        <div class="two-columns">
            <div class="form-group"><label>Start Date</label><input type="month" class="form-control education-start"></div>
            <div class="form-group"><label>End Date (or Expected)</label><input type="month" class="form-control education-end"></div>
        </div>
        <div class="form-group"><label>Description (Optional)</label><textarea class="form-control education-description" placeholder="Relevant coursework, GPA, honors..."></textarea></div>`;
    item.querySelector('.remove-item').addEventListener('click', () => item.remove());
    return item;
}

function createExperienceItem() {
    const item = document.createElement('div');
    item.className = 'list-item';
    const checkboxId = `current-job-${Date.now()}`; // Unique ID for label association
    item.innerHTML = `
        <button type="button" class="remove-item">×</button>
        <div class="two-columns">
            <div class="form-group"><label>Company</label><input type="text" class="form-control experience-company" placeholder="Company Name"></div>
            <div class="form-group"><label>Position</label><input type="text" class="form-control experience-position" placeholder="Job Title"></div>
        </div>
        <div class="two-columns">
            <div class="form-group"><label>Start Date</label><input type="month" class="form-control experience-start"></div>
            <div class="form-group"><label>End Date (or Current)</label><input type="month" class="form-control experience-end"><div style="margin-top: 5px;"><input type="checkbox" id="${checkboxId}" class="experience-current"><label for="${checkboxId}" style="display: inline; margin-left: 5px; font-weight: normal; color: var(--gray);">I currently work here</label></div></div>
        </div>
        <div class="form-group"><label>Responsibilities & Achievements</label><textarea class="form-control experience-description" placeholder="Describe your role and accomplishments (use bullet points)..."></textarea></div>`;
    item.querySelector('.remove-item').addEventListener('click', () => item.remove());
    const currentCheckbox = item.querySelector('.experience-current');
    const endDateInput = item.querySelector('.experience-end');
    currentCheckbox.addEventListener('change', () => {
        endDateInput.disabled = currentCheckbox.checked;
        if (currentCheckbox.checked) endDateInput.value = '';
    });
    // Ensure end date is enabled initially if checkbox is not checked
    endDateInput.disabled = currentCheckbox.checked;
    return item;
}

function createProjectItem() {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <button type="button" class="remove-item">×</button>
        <div class="two-columns">
            <div class="form-group"><label>Project Name</label><input type="text" class="form-control project-name" placeholder="Project Title"></div>
            <div class="form-group"><label>Technologies Used</label><input type="text" class="form-control project-tech" placeholder="React, Node.js, CSS"></div>
        </div>
        <div class="form-group"><label>Project URL (Optional)</label><input type="url" class="form-control project-url" placeholder="https://github.com/your/project or live demo URL"></div>
        <div class="form-group"><label>Description</label><textarea class="form-control project-description" placeholder="Describe the project, your contributions, and key features..."></textarea></div>`;
    item.querySelector('.remove-item').addEventListener('click', () => item.remove());
    return item;
}

// Add Item Buttons (Builder)
document.getElementById('add-education').addEventListener('click', () => { document.getElementById('education-list').appendChild(createEducationItem()); });
document.getElementById('add-experience').addEventListener('click', () => { document.getElementById('experience-list').appendChild(createExperienceItem()); });
document.getElementById('add-project').addEventListener('click', () => { document.getElementById('project-list').appendChild(createProjectItem()); });

// Initialize builder with one item each for usability
document.getElementById('education-list').appendChild(createEducationItem());
document.getElementById('experience-list').appendChild(createExperienceItem());

// --- Resume Builder Submission & Preview ---
document.getElementById('resume-builder-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Generating your resume...', 'success');
    // Simulate processing delay for visual feedback
    setTimeout(() => {
        try {
            generateResumePreview(); // Generates HTML for the preview pane
            populateBuilderAnalysis(); // Generates simulated analysis for the right pane
            document.getElementById('resume-preview-section').style.display = 'block'; // Show the preview section
            document.getElementById('resume-preview-section').scrollIntoView({ behavior: 'smooth' }); // Scroll to it
        } catch (error) {
            console.error("Error during builder preview generation:", error);
            showToast('Error generating preview.', 'error');
        }
    }, 500); // Shorter delay
});

// Generate Resume Preview HTML (Builder)
function generateResumePreview() {
    const previewElement = document.getElementById('resume-preview');
    if (!previewElement) return;
    previewElement.innerHTML = ''; // Clear previous

    // --- Helper to format dates ---
    const formatDateRange = (start, end, isCurrent = false) => {
        const options = { month: 'short', year: 'numeric', timeZone: 'UTC' }; // Add timeZone UTC to avoid off-by-one day issues
        let startDate = '';
        let endDate = 'Present';
        try {
            if (start) startDate = new Date(start + '-02').toLocaleDateString('en-US', options); // Add day to ensure correct month parsing
        } catch (e) { console.warn("Invalid start date:", start); }
        if (!isCurrent && end) {
            try {
                 endDate = new Date(end + '-02').toLocaleDateString('en-US', options);
            } catch (e) { console.warn("Invalid end date:", end); endDate = '';}
        } else if (isCurrent) {
            endDate = 'Present';
        } else {
            endDate = ''; // No end date and not current
        }
        if (startDate && endDate) return `${startDate} - ${endDate}`;
        if (startDate) return startDate;
        return ''; // Return empty if no dates
    };

    // --- Helper to safely create links ---
    const createLinkHTML = (url, text, cssClass = '') => {
        if (!url) return '';
        let safeUrl = url.trim();
        if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && safeUrl.includes('@')) {
             return `<span><a href="mailto:${safeUrl}" class="${cssClass}">${text || safeUrl}</a></span>`; // Mail link
        }
        if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) {
            safeUrl = `https://${safeUrl}`; // Assume https if no protocol
        }
        try {
            new URL(safeUrl); // Validate URL structure
            return `<span><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${cssClass}">${text || url}</a></span>`;
        } catch (e) {
            console.warn("Invalid URL:", url);
            return `<span>${text || url} (invalid link)</span>`; // Indicate invalid link
        }
    };

    // --- Get Form Data ---
    const fullName = document.getElementById('fullName').value || 'John Doe';
    const jobTitle = document.getElementById('jobTitle').value || 'Professional Title';
    const email = document.getElementById('email').value || '';
    const phone = document.getElementById('phone').value || '';
    const location = document.getElementById('location').value || '';
    const linkedin = document.getElementById('linkedin').value || '';
    const summary = document.getElementById('summary').value.replace(/\n/g, '<br>') || 'Professional summary not provided.';
    const skillsInput = document.getElementById('skills').value;
    const skills = skillsInput ? skillsInput.split(',').map(skill => skill.trim()).filter(s => s) : []; // Filter empty strings

    const educationItems = Array.from(document.querySelectorAll('#education-list .list-item')).map(item => ({ school: item.querySelector('.education-school').value, degree: item.querySelector('.education-degree').value, start: item.querySelector('.education-start').value, end: item.querySelector('.education-end').value, description: item.querySelector('.education-description').value.replace(/\n/g, '<br>'), })).filter(edu => edu.school || edu.degree);
    const experienceItems = Array.from(document.querySelectorAll('#experience-list .list-item')).map(item => ({ company: item.querySelector('.experience-company').value, position: item.querySelector('.experience-position').value, start: item.querySelector('.experience-start').value, isCurrent: item.querySelector('.experience-current').checked, end: item.querySelector('.experience-end').value, description: item.querySelector('.experience-description').value.replace(/\n/g, '<br>'), })).filter(exp => exp.company || exp.position);
    const projectItems = Array.from(document.querySelectorAll('#project-list .list-item')).map(item => ({ name: item.querySelector('.project-name')?.value, tech: item.querySelector('.project-tech')?.value, url: item.querySelector('.project-url')?.value, description: item.querySelector('.project-description')?.value.replace(/\n/g, '<br>'), })).filter(proj => proj.name || proj.description);

    // --- Generate HTML ---
    let resumeHTML = `
        <div class="resume-section">
            <h1 style="font-size: 1.8rem; margin-bottom: 5px;">${fullName}</h1>
            <p style="color: var(--primary); font-size: 1.2rem; margin-bottom: 10px;">${jobTitle}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 5px 15px; font-size: 0.9rem; color: var(--gray);">
                ${createLinkHTML(email, email)}
                ${phone ? `<span>${phone}</span>` : ''}
                ${location ? `<span>${location}</span>` : ''}
                ${createLinkHTML(linkedin, 'LinkedIn')}
            </div>
        </div>
        <div class="resume-section"><div class="resume-section-title">Summary</div><p>${summary}</p></div>`;

    if (experienceItems.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Work Experience</div>`;
        experienceItems.forEach(exp => {
            resumeHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${exp.position || 'Position'}</div>
                    <div class="resume-item-subtitle">${exp.company || 'Company'}</div>
                    <div class="resume-item-date">${formatDateRange(exp.start, exp.end, exp.isCurrent)}</div>
                    ${exp.description ? `<div class="resume-item-description">${exp.description}</div>` : ''}
                </div>`;
        });
        resumeHTML += `</div>`;
    }

    if (educationItems.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
        educationItems.forEach(edu => {
             resumeHTML += `
                 <div class="resume-item">
                     <div class="resume-item-title">${edu.degree || 'Degree'}</div>
                     <div class="resume-item-subtitle">${edu.school || 'School'}</div>
                     <div class="resume-item-date">${formatDateRange(edu.start, edu.end)}</div>
                     ${edu.description ? `<div class="resume-item-description">${edu.description}</div>` : ''}
                 </div>`;
        });
        resumeHTML += `</div>`;
    }

    if (skills.length > 0) {
        resumeHTML += `
            <div class="resume-section"><div class="resume-section-title">Skills</div>
            <div class="skills-list">${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}</div></div>`;
    }

    if (projectItems.length > 0) {
        resumeHTML += `<div class="resume-section"><div class="resume-section-title">Projects</div>`;
        projectItems.forEach(proj => {
             resumeHTML += `
                 <div class="resume-item">
                     <div class="resume-item-title">${proj.name || 'Project Name'}</div>
                     ${proj.tech ? `<div class="resume-item-subtitle">Technologies: ${proj.tech}</div>` : ''}
                     ${createLinkHTML(proj.url, proj.url, 'resume-item-subtitle')}
                     ${proj.description ? `<div class="resume-item-description">${proj.description}</div>` : ''}
                 </div>`;
        });
        resumeHTML += `</div>`;
    }
    previewElement.innerHTML = resumeHTML;
}

// Populate Builder Analysis (Simulated)
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

// Handle File Upload and API Call
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
        const response = await fetch('http://localhost:8080/api/resume/analyze', { method: 'POST', body: formData });
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

// --- Render Analysis Results (Right Side) ---
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
            const sectionOrder = ['workExperience', 'skills', 'education', 'summary', 'projects']; // Include projects
            let analysisRendered = false;
            sectionOrder.forEach(key => {
                if (sectionScores.hasOwnProperty(key) && sectionScores[key] !== null && sectionScores[key] !== undefined) {
                    analysisRendered = true;
                    const scoreValue = sectionScores[key] || 0;
                    const label = getSectionStrengthLabel(scoreValue);
                    const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    strengthContainer.innerHTML += `
                        <div style="margin-bottom: 15px;">
                            <p style="margin-bottom: 5px; font-size: 0.9rem;">${displayName}</p>
                            <div class="progress-container"><div class="progress-bar" style="width: ${scoreValue}%;"></div></div>
                            <div class="progress-label"><span>${label}</span><span>${scoreValue}%</span></div>
                        </div>`;
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

// --- Render Resume Preview from Analysis (Left Side) ---
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
        const projects = Array.isArray(analysisData.projects) ? analysisData.projects : []; // Ensure it's an array
        const generalLinks = Array.isArray(analysisData.links) ? analysisData.links : [];
        const educationItems = Array.isArray(analysisData.educationDetails) ? analysisData.educationDetails : []; // Assume 'educationDetails' key

        let resumeHTML = '';

        // Helper function to safely create links (same as in builder preview)
        const createLink = (url, text, cssClass = '') => {
             if (!url) return '';
             let safeUrl = url.trim();
             if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://') && safeUrl.includes('@')) { return `<span><a href="mailto:${safeUrl}" class="${cssClass}">${text || safeUrl}</a></span>`; }
             if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) { safeUrl = `https://${safeUrl}`; }
             try { new URL(safeUrl); return `<span><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="${cssClass}">${text || url}</a></span>`; }
             catch (e) { return `<span>${text || url} (invalid link)</span>`; }
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
                    ${generalLinks.map(link => createLink(link.url, link.type || 'Link')).join('')}
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
                                 ${exp.duration ? `<div class="resume-item-date">${exp.duration}</div>` : ''}
                                 ${exp.description ? `<div class="resume-item-description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
                               </div>`; });
            resumeHTML += `</div>`;
        }

        // --- Education ---
        const validEducation = educationItems.filter(edu => edu.degree || edu.school);
         if (validEducation.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
            validEducation.forEach(edu => {
                 resumeHTML += `<div class="resume-item">
                                  ${edu.degree ? `<div class="resume-item-title">${edu.degree}</div>` : ''}
                                  ${edu.school ? `<div class="resume-item-subtitle">${edu.school}</div>` : ''}
                                  ${edu.duration ? `<div class="resume-item-date">${edu.duration}</div>` : ''}
                                  ${edu.description ? `<div class="resume-item-description">${edu.description.replace(/\n/g, '<br>')}</div>` : ''}
                              </div>`; });
            resumeHTML += `</div>`;
        }

        // --- Skills ---
        if (skills.length > 0) {
            resumeHTML += `<div class="resume-section"><div class="resume-section-title">Skills</div>
                           <div class="skills-list">${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}</div></div>`;
        }

        // --- Projects (Loop through array) ---
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
                         ${project.projectDescription ? `<div class="resume-item-description">${project.projectDescription.replace(/\n/g, '<br>')}</div>` : ''}
                         ${projectLinks.length > 0 ? `<div class="resume-item-links" style="margin-top: 5px;">${projectLinks.map(link => createLink(link, 'Project Link', 'resume-project-link')).join('')}</div>` : ''}
                     </div>`;
            });
            resumeHTML += `</div>`;
        }

        // --- Fallback if no content ---
         if (!userInfo.name && !summary && skills.length === 0 && validExperiences.length === 0 && validProjects.length === 0) {
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
    let symbol = '•'; let className = 'suggestion';
    const lowerText = text ? text.toLowerCase() : '';
    if (type === 'positive') { symbol = '✓'; className = 'positive'; }
    else if (type === 'negative') { symbol = '❌'; className = 'negative'; }
    else if (type === 'suggestion') { symbol = '💡'; className = 'suggestion'; }
    else if (lowerText) {
        if (lowerText.includes('good') || lowerText.includes('strong') || lowerText.includes('well done') || lowerText.includes('excellent')) { symbol = '✓'; className = 'positive'; }
        else if (lowerText.includes('consider') || lowerText.includes('add') || lowerText.includes('quantify') || lowerText.includes('improve') || lowerText.includes('expand') || lowerText.includes('tailor')) { symbol = '💡'; className = 'suggestion'; }
        else if (lowerText.includes('generic') || lowerText.includes('missing') || lowerText.includes('lack') || lowerText.includes('unclear') || lowerText.includes('vague') || lowerText.includes('too ')) { symbol = '❌'; className = 'negative'; }
    }
    return { className, symbol };
}

// --- Button Actions ---
// PDF Download Functionality
document.getElementById('download-analysis')?.addEventListener('click', () => {
    console.log("Download Analysis button clicked.");
    const elementToCapture = document.getElementById('analysis-results-section');
    if (!elementToCapture || elementToCapture.style.display === 'none') {
        showToast('No analysis results to download.', 'error'); return;
    }
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        console.error("jsPDF or html2canvas library not loaded!");
        showToast('Error preparing download. Libraries not found.', 'error'); return;
    }
    const { jsPDF } = jspdf;
    showToast('Preparing download...', 'success');
    const options = { scale: 2, useCORS: true, logging: false, scrollX: 0, scrollY: -window.scrollY, windowWidth: elementToCapture.scrollWidth, windowHeight: elementToCapture.scrollHeight };

    html2canvas(elementToCapture, options).then(canvas => {
        console.log("html2canvas capture successful.");
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = 210; // A4 width mm
        const pageHeight = 297; // A4 height mm
        const margin = 10; // 10mm margin
        const imgRenderWidth = pdfWidth - margin * 2;
        const imgRenderHeight = canvas.height * imgRenderWidth / canvas.width;
        let heightLeft = imgRenderHeight;
        let position = margin; // Initial top margin

        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', margin, position, imgRenderWidth, imgRenderHeight);
        heightLeft -= (pageHeight - margin * 2); // Subtract usable page height

        while (heightLeft > 0) {
            position = heightLeft - imgRenderHeight - margin; // Calculate position for next page (negative)
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, imgRenderWidth, imgRenderHeight);
            heightLeft -= (pageHeight - margin); // Subtract full page height for subsequent pages
            console.log("Added PDF page.");
        }
        pdf.save('ResumeAnalysis.pdf');
        console.log("PDF generated and download initiated.");
        showToast('Analysis downloaded!', 'success');
    }).catch(error => {
        console.error("Error generating PDF:", error);
        showToast('Failed to generate PDF analysis.', 'error');
    });
});

// Other button placeholders
document.getElementById('download-resume')?.addEventListener('click', () => { showToast('Builder download not implemented.', 'error'); });
document.getElementById('edit-resume')?.addEventListener('click', () => { document.getElementById('resume-preview-section').style.display = 'none'; window.scrollTo({ top: 0, behavior: 'smooth' }); });
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

// --- END OF FILE script.js ---
// Tab Switching
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to current tab and content
        tab.classList.add('active');
        document.getElementById(`${tabId}-content`).classList.add('active');
    });
});

// Dynamic Lists (Education, Experience, Projects)
function createEducationItem() {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <button type="button" class="remove-item">&times;</button>
        <div class="two-columns">
            <div class="form-group">
                <label>School/University</label>
                <input type="text" class="form-control education-school" placeholder="Harvard University">
            </div>
            <div class="form-group">
                <label>Degree</label>
                <input type="text" class="form-control education-degree" placeholder="Bachelor of Science in Computer Science">
            </div>
        </div>
        <div class="two-columns">
            <div class="form-group">
                <label>Start Date</label>
                <input type="month" class="form-control education-start">
            </div>
            <div class="form-group">
                <label>End Date (or Expected)</label>
                <input type="month" class="form-control education-end">
            </div>
        </div>
        <div class="form-group">
            <label>Description (Optional)</label>
            <textarea class="form-control education-description" placeholder="Relevant coursework, achievements, or activities..."></textarea>
        </div>
    `;
    
    // Add remove functionality
    item.querySelector('.remove-item').addEventListener('click', () => {
        item.remove();
    });
    
    return item;
}

function createExperienceItem() {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <button type="button" class="remove-item">&times;</button>
        <div class="two-columns">
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="form-control experience-company" placeholder="Google">
            </div>
            <div class="form-group">
                <label>Position</label>
                <input type="text" class="form-control experience-position" placeholder="Senior Software Engineer">
            </div>
        </div>
        <div class="two-columns">
            <div class="form-group">
                <label>Start Date</label>
                <input type="month" class="form-control experience-start">
            </div>
            <div class="form-group">
                <label>End Date (or Current)</label>
                <input type="month" class="form-control experience-end">
                <div style="margin-top: 5px;">
                    <input type="checkbox" id="current-job-${Date.now()}" class="experience-current">
                    <label for="current-job-${Date.now()}" style="display: inline; margin-left: 5px;">I currently work here</label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <label>Responsibilities & Achievements</label>
            <textarea class="form-control experience-description" placeholder="Describe your key responsibilities and achievements..."></textarea>
        </div>
    `;
    
    // Add remove functionality
    item.querySelector('.remove-item').addEventListener('click', () => {
        item.remove();
    });
    
    // Handle current job checkbox
    const currentCheckbox = item.querySelector('.experience-current');
    const endDateInput = item.querySelector('.experience-end');
    
    currentCheckbox.addEventListener('change', () => {
        endDateInput.disabled = currentCheckbox.checked;
        if (currentCheckbox.checked) {
            endDateInput.value = '';
        }
    });
    
    return item;
}

function createProjectItem() {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <button type="button" class="remove-item">&times;</button>
        <div class="two-columns">
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" class="form-control project-name" placeholder="E-commerce Website">
            </div>
            <div class="form-group">
                <label>Technologies Used</label>
                <input type="text" class="form-control project-tech" placeholder="React, Node.js, MongoDB">
            </div>
        </div>
        <div class="form-group">
            <label>Project URL (Optional)</label>
            <input type="url" class="form-control project-url" placeholder="https://github.com/yourusername/project">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="form-control project-description" placeholder="Describe the project, your role, and key achievements..."></textarea>
        </div>
    `;
    
    // Add remove functionality
    item.querySelector('.remove-item').addEventListener('click', () => {
        item.remove();
    });
    
    return item;
}

// Add item buttons
document.getElementById('add-education').addEventListener('click', () => {
    const educationList = document.getElementById('education-list');
    educationList.appendChild(createEducationItem());
});

document.getElementById('add-experience').addEventListener('click', () => {
    const experienceList = document.getElementById('experience-list');
    experienceList.appendChild(createExperienceItem());
});

document.getElementById('add-project').addEventListener('click', () => {
    const projectList = document.getElementById('project-list');
    projectList.appendChild(createProjectItem());
});

// Add one item of each by default
document.getElementById('education-list').appendChild(createEducationItem());
document.getElementById('experience-list').appendChild(createExperienceItem());

// Resume Builder Form Submission
document.getElementById('resume-builder-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    showToast('Generating your resume...', 'success');
    
    // Simulate processing delay
    setTimeout(() => {
        generateResumePreview();
        document.getElementById('resume-preview-section').style.display = 'block';
        
        // Scroll to preview
        document.getElementById('resume-preview-section').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
});

// Generate Resume Preview
function generateResumePreview() {
    const fullName = document.getElementById('fullName').value || 'John Doe';
    const jobTitle = document.getElementById('jobTitle').value || 'Software Engineer';
    const email = document.getElementById('email').value || 'john.doe@example.com';
    const phone = document.getElementById('phone').value || '+1 (123) 456-7890';
    const location = document.getElementById('location').value || 'New York, NY';
    const linkedin = document.getElementById('linkedin').value || '';
    const summary = document.getElementById('summary').value || 'Experienced software engineer with a passion for developing innovative solutions...';
    
    // Get skills
    const skillsInput = document.getElementById('skills').value;
    const skills = skillsInput ? skillsInput.split(',').map(skill => skill.trim()) : ['JavaScript', 'React', 'Node.js'];
    
    // Get education items
    const educationItems = [];
    document.querySelectorAll('#education-list .list-item').forEach(item => {
        const school = item.querySelector('.education-school').value;
        const degree = item.querySelector('.education-degree').value;
        const start = item.querySelector('.education-start').value;
        const end = item.querySelector('.education-end').value;
        const description = item.querySelector('.education-description').value;
        
        if (school && degree) {
            educationItems.push({ school, degree, start, end, description });
        }
    });
    
    // Get experience items
    const experienceItems = [];
    document.querySelectorAll('#experience-list .list-item').forEach(item => {
        const company = item.querySelector('.experience-company').value;
        const position = item.querySelector('.experience-position').value;
        const start = item.querySelector('.experience-start').value;
        const end = item.querySelector('.experience-current').checked ? 'Present' : item.querySelector('.experience-end').value;
        const description = item.querySelector('.experience-description').value;
        
        if (company && position) {
            experienceItems.push({ company, position, start, end, description });
        }
    });
    
    // Get project items
    const projectItems = [];
    document.querySelectorAll('#project-list .list-item').forEach(item => {
        const name = item.querySelector('.project-name')?.value;
        const tech = item.querySelector('.project-tech')?.value;
        const url = item.querySelector('.project-url')?.value;
        const description = item.querySelector('.project-description')?.value;
        
        if (name && description) {
            projectItems.push({ name, tech, url, description });
        }
    });
    
    // Generate HTML for resume preview
    let resumeHTML = `
        <div class="resume-section">
            <h1 style="font-size: 1.8rem; margin-bottom: 5px;">${fullName}</h1>
            <p style="color: var(--primary); font-size: 1.2rem; margin-bottom: 10px;">${jobTitle}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 0.9rem; color: var(--gray);">
                <span>${email}</span>
                <span>${phone}</span>
                <span>${location}</span>
                ${linkedin ? `<span>${linkedin}</span>` : ''}
            </div>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Summary</div>
            <p>${summary}</p>
        </div>
    `;
    
    // Add experience section
    if (experienceItems.length > 0) {
        resumeHTML += `
            <div class="resume-section">
                <div class="resume-section-title">Work Experience</div>
        `;
        
        experienceItems.forEach(exp => {
            const startDate = exp.start ? new Date(exp.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
            const endDate = exp.end === 'Present' ? 'Present' : (exp.end ? new Date(exp.end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '');
            const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
            
            resumeHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${exp.position}</div>
                    <div class="resume-item-subtitle">${exp.company}</div>
                    <div class="resume-item-date">${dateRange}</div>
                    <div class="resume-item-description">${exp.description}</div>
                </div>
            `;
        });
        
        resumeHTML += `</div>`;
    }
    
    // Add education section
    if (educationItems.length > 0) {
        resumeHTML += `
            <div class="resume-section">
                <div class="resume-section-title">Education</div>
        `;
        
        educationItems.forEach(edu => {
            const startDate = edu.start ? new Date(edu.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
            const endDate = edu.end ? new Date(edu.end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
            const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : '';
            
            resumeHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${edu.degree}</div>
                    <div class="resume-item-subtitle">${edu.school}</div>
                    <div class="resume-item-date">${dateRange}</div>
                    ${edu.description ? `<div class="resume-item-description">${edu.description}</div>` : ''}
                </div>
            `;
        });
        
        resumeHTML += `</div>`;
    }
    
    // Add skills section
    resumeHTML += `
        <div class="resume-section">
            <div class="resume-section-title">Skills</div>
            <div class="skills-list">
                ${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
            </div>
        </div>
    `;
    
    // Add projects section if any
    if (projectItems.length > 0) {
        resumeHTML += `
            <div class="resume-section">
                <div class="resume-section-title">Projects</div>
        `;
        
        projectItems.forEach(proj => {
            resumeHTML += `
                <div class="resume-item">
                    <div class="resume-item-title">${proj.name}</div>
                    ${proj.tech ? `<div class="resume-item-subtitle">Technologies: ${proj.tech}</div>` : ''}
                    ${proj.url ? `<div class="resume-item-subtitle"><a href="${proj.url}" target="_blank" style="color: var(--primary);">${proj.url}</a></div>` : ''}
                    <div class="resume-item-description">${proj.description}</div>
                </div>
            `;
        });
        
        resumeHTML += `</div>`;
    }
    
    // Set the HTML to the preview element
    document.getElementById('resume-preview').innerHTML = resumeHTML;
    
    // Generate AI suggestions
    generateAISuggestions();
}

// Generate AI Suggestions
function generateAISuggestions() {
    // This would normally be done with actual AI analysis
    // Here we're just simulating some suggestions
    const suggestions = [
        {
            type: 'positive',
            text: 'Your resume has a clear structure and good organization.'
        },
        {
            type: 'suggestion',
            text: 'Consider adding more quantifiable achievements to your work experience.'
        },
        {
            type: 'suggestion',
            text: 'Your summary could be more specific about your unique value proposition.'
        },
        {
            type: 'negative',
            text: 'Some of your job descriptions are too generic. Add more specific responsibilities and achievements.'
        }
    ];
    
    const suggestionsContainer = document.getElementById('ai-suggestions');
    suggestionsContainer.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'analysis-item';
        
        let icon = '✓';
        let iconClass = 'positive';
        
        if (suggestion.type === 'suggestion') {
            icon = '💡';
            iconClass = 'suggestion';
        } else if (suggestion.type === 'negative') {
            icon = '❌';
            iconClass = 'negative';
        }
        
        item.innerHTML = `
            <div class="analysis-item-icon ${iconClass}">${icon}</div>
            <div class="analysis-item-text">${suggestion.text}</div>
        `;
        
        suggestionsContainer.appendChild(item);
    });
    
    // Set a random score between 65 and 95
    const score = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
    const scoreElement = document.getElementById('resume-score');
    scoreElement.textContent = score;
    
    if (score >= 85) {
        scoreElement.className = 'score-circle high-score';
    } else if (score >= 70) {
        scoreElement.className = 'score-circle medium-score';
    } else {
        scoreElement.className = 'score-circle low-score';
    }
}

// Resume Analyzer Upload
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('resume-file');

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--light-gray)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--light-gray)';
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileUpload(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        handleFileUpload(fileInput.files[0]);
    }
});

function handleFileUpload(file) {
    // Check file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
        showToast('Please upload a PDF, DOCX, or TXT file.', 'error');
        return;
    }
    
    // Show loading
    uploadArea.style.display = 'none';
    document.getElementById('analysis-loading').style.display = 'block';
    
    // Simulate file processing and analysis
    setTimeout(() => {
        document.getElementById('analysis-loading').style.display = 'none';
        document.getElementById('analysis-results-section').style.display = 'block';
        
        // Display uploaded resume (this would normally parse the actual file)
        displayUploadedResume(file.name);
        
        // Scroll to results
        document.getElementById('analysis-results-section').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}

function displayUploadedResume(fileName) {
    // This would normally parse and display the actual resume
    // Here we're just showing a placeholder with the file name
    const previewContainer = document.getElementById('uploaded-resume-preview');
    
    previewContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
            <h3>${fileName}</h3>
            <p style="color: var(--gray); margin-top: 10px;">Resume content would be displayed here</p>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">John Smith</div>
            <p style="color: var(--primary);">Senior Frontend Developer</p>
            <p>john.smith@example.com | (555) 123-4567 | San Francisco, CA</p>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Summary</div>
            <p>Frontend developer with 5 years of experience building responsive web applications.</p>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Experience</div>
            <div class="resume-item">
                <div class="resume-item-title">Frontend Developer</div>
                <div class="resume-item-subtitle">TechCorp Inc.</div>
                <div class="resume-item-date">Jan 2020 - Present</div>
                <div class="resume-item-description">
                    Developed user interfaces using React and JavaScript.
                    Collaborated with designers to implement responsive designs.
                    Worked with backend team to integrate APIs.
                </div>
            </div>
        </div>
        
        <div class="resume-section">
            <div class="resume-section-title">Skills</div>
            <div class="skills-list">
                <div class="skill-tag">JavaScript</div>
                <div class="skill-tag">React</div>
                <div class="skill-tag">HTML/CSS</div>
                <div class="skill-tag">Node.js</div>
            </div>
        </div>
    `;
}

// Button Actions
document.getElementById('download-resume').addEventListener('click', () => {
    showToast('Resume downloaded successfully!', 'success');
});

document.getElementById('edit-resume').addEventListener('click', () => {
    document.getElementById('resume-preview-section').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('improve-resume').addEventListener('click', () => {
    showToast('Generating improved resume...', 'success');
});

document.getElementById('download-analysis').addEventListener('click', () => {
    showToast('Analysis report downloaded!', 'success');
});

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    // Set message and icon
    toastMessage.textContent = message;
    
    if (type === 'success') {
        toast.className = 'toast toast-success';
        toastIcon.textContent = '✓';
    } else {
        toast.className = 'toast toast-error';
        toastIcon.textContent = '✕';
    }
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }, 100);
}

// Close toast on click
document.querySelector('.toast-close').addEventListener('click', () => {
    document.getElementById('toast').classList.remove('show');
});
// --- START OF FILE pdfGenerator.js ---

import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

// Convert stream to buffer
const generatePDFBuffer = async (doc) => {
  const stream = new PassThrough();
  doc.pipe(stream);
  doc.end();
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

// Normalize data structure (Focuses on ensuring top-level sections are arrays if expected)
const normalizeData = (data) => {
  const normalizeArray = (field) => {
    // Ensure the field exists and is an array, otherwise return empty array
    return (data && Array.isArray(data[field])) ? data[field] : [];
  };

  // Normalize specific nested structures if needed (like KD's education details)
  let educationDetails = [];
  if (data && data.education) {
      if(Array.isArray(data.education.details)) {
          educationDetails = data.education.details;
      } else if (Array.isArray(data.education)) {
          // If top-level education is array but no details, use it (for other templates)
          // This part might need adjustment based on how KD data is strictly sent
          educationDetails = data.education;
      }
  }


  return {
    ...data, // Keep original data
    // Ensure these common sections are arrays, default to empty if not present or not array
    education: normalizeArray("education"),
    experience: normalizeArray("experience"),
    projects: normalizeArray("projects"),
    positions: normalizeArray("positions"), // For KD
    misc: normalizeArray("misc"), // For KD
    // Handle nested KD education structure more explicitly if needed
    // This example keeps top-level 'education' potentially normalized for other templates
    // and relies on the KD generator to check 'data.education.details'
  };
};

// Modern template
const generatePDFModern = async (data) => {
  data = normalizeData(data); // Basic normalization
  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(24).fillColor('#2E86C1').text(data.name || 'Name Missing', { align: 'center' });
  doc.moveDown().fontSize(12).fillColor('black').text(`Email: ${data.email || ''}`);
  doc.text(`Phone: ${data.phone || ''}`);
  doc.moveDown();

  if (data.education.length > 0) {
      doc.fontSize(16).text('Education', { underline: true });
      data.education.forEach(ed => {
          doc.fontSize(12).text(`${ed.degree || ''} - ${ed.institution || ''} (${ed.year || ed.duration || ''})`);
      });
  }

  if (data.experience.length > 0) {
      doc.moveDown().fontSize(16).text('Experience', { underline: true });
      data.experience.forEach(exp => {
          doc.fontSize(12).text(`${exp.role || ''} at ${exp.company || ''} (${exp.duration || ''})`);
      });
  }

  if (data.skills && data.skills.length > 0) {
      doc.moveDown().fontSize(16).text('Skills', { underline: true });
      // Ensure skills is an array before joining
      const skillsText = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || '');
      doc.fontSize(12).text(skillsText);
  }

  return await generatePDFBuffer(doc);
};

// Classic template
const generatePDFClassic = async (data) => {
  data = normalizeData(data); // Basic normalization
  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(18).fillColor('black').text(data.name || 'Name Missing', { align: 'left' });
  doc.moveDown().fontSize(11).text(`Email: ${data.email || ''}`);
  doc.text(`Phone: ${data.phone || ''}`);
  doc.moveDown();

  if (data.education.length > 0) {
      doc.fontSize(14).text('Education:');
      data.education.forEach(ed => {
          doc.text(`${ed.degree || ''} at ${ed.institution || ''}, ${ed.year || ed.duration || ''}`);
      });
  }

  if (data.experience.length > 0) {
      doc.moveDown().fontSize(14).text('Experience:');
      data.experience.forEach(exp => {
          doc.text(`${exp.role || ''} at ${exp.company || ''}, ${exp.duration || ''}`);
      });
  }

  if (data.skills && data.skills.length > 0) {
      doc.moveDown().fontSize(14).text('Skills:');
      // Ensure skills is an array before joining
      const skillsText = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || '');
      doc.text(skillsText);
  }

  return await generatePDFBuffer(doc);
};

// Azurill template
const generatePDFAzurill = async (data) => {
  data = normalizeData(data); // Basic normalization
  const doc = new PDFDocument({ margin: 0 });

  doc.rect(0, 0, 150, doc.page.height).fill('#4B0082'); // Use page height

  doc.fillColor('white')
    .fontSize(18)
    .text(data.name || 'Name Missing', 20, 40, { width: 110, align: 'center' });

  doc.fontSize(10)
    .text(data.email || '', 20, 80, { width: 110, align: 'center' })
    .text(data.phone || '', 20, 95, { width: 110, align: 'center' });

  let x = 170;
  let y = 40;
  const contentWidth = doc.page.width - x - 40; // Calculate available width

  if (data.education.length > 0) {
      doc.fontSize(14).fillColor('#4B0082').text('🎓 Education', x, y);
      y += 25;
      data.education.forEach(ed => {
          doc.fontSize(11).fillColor('black')
              .text(`${ed.degree || ''}`, x, y, { width: contentWidth })
              .text(`${ed.institution || ''} (${ed.year || ed.duration || ''})`, x + 10, doc.y + 2, { width: contentWidth - 10}); // Use doc.y for positioning after text
          y = doc.y + 15; // Update y based on content height + spacing
          if (y > doc.page.height - 50) { // Basic page break check
              doc.addPage();
              doc.rect(0, 0, 150, doc.page.height).fill('#4B0082'); // Redraw sidebar
              y = 40; // Reset y
          }
      });
      y+= 10; // Extra space after section
  }


  if (data.experience.length > 0) {
      doc.fontSize(14).fillColor('#4B0082').text('💼 Experience', x, y);
      y += 25;
      data.experience.forEach(exp => {
          doc.fontSize(11).fillColor('black')
              .text(`${exp.role || ''}`, x, y, { width: contentWidth })
              .text(`${exp.company || ''} (${exp.duration || ''})`, x + 10, doc.y + 2, { width: contentWidth - 10 });
           y = doc.y + 15;
           if (y > doc.page.height - 50) {
              doc.addPage();
              doc.rect(0, 0, 150, doc.page.height).fill('#4B0082');
              y = 40;
          }
      });
       y+= 10;
  }


  if (data.skills && data.skills.length > 0) {
      doc.fontSize(14).fillColor('#4B0082').text('🛠️ Skills', x, y);
      y += 20;
      // Ensure skills is an array before joining
      const skillsText = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || '');
      doc.fontSize(11).fillColor('black').text(skillsText, x, y, { width: contentWidth });
      y = doc.y + 15;
       if (y > doc.page.height - 50) {
          doc.addPage();
          doc.rect(0, 0, 150, doc.page.height).fill('#4B0082');
          y = 40;
      }
  }


  return await generatePDFBuffer(doc);
};

// Bhendi template - WITH ROBUST CHECKS
const generatePDFBhendi = async (data) => {
  data = normalizeData(data); // Basic normalization first
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(20).font("Times-Bold").text(data.name || 'Name Missing', { align: 'center' });

  const contactLinks = [ // Renamed variable for clarity
    data.phone,
    data.email,
    // Ensure links object exists before accessing properties
    (data.links && data.links.linkedin) ? data.links.linkedin : null,
    (data.links && data.links.github) ? data.links.github : null
  ].filter(Boolean).join(' | '); // filter(Boolean) removes null/undefined/empty strings
  doc.fontSize(10).font("Times-Roman").text(contactLinks, { align: 'center' });

  const sectionTitle = (title) => {
    // Add space before title if not the first element
    if (doc.y > 70) { // Avoid adding space at the very top
        doc.moveDown(1.5);
    }
    doc.fontSize(12).font("Times-Bold").text(title.toUpperCase(), { underline: true });
    doc.moveDown(0.5); // Space after title
  };

  sectionTitle("Technical Skills");
  const skills = data.technicalSkills || {}; // Default to empty object if null/undefined
  // Ensure skill categories are arrays before joining, default to empty string if not
  const languages = Array.isArray(skills.languages) ? skills.languages.join(', ') : '';
  const frameworks = Array.isArray(skills.frameworks) ? skills.frameworks.join(', ') : '';
  const databases = Array.isArray(skills.databases) ? skills.databases.join(', ') : '';
  const tools = Array.isArray(skills.tools) ? skills.tools.join(', ') : '';

  const skillText = [
    languages ? `Languages: ${languages}` : null, // Only add if non-empty
    frameworks ? `Frameworks and Libraries: ${frameworks}` : null,
    databases ? `Databases: ${databases}` : null,
    tools ? `Tools and Technologies: ${tools}` : null
  ].filter(Boolean); // Remove null entries

  if (skillText.length > 0) {
      skillText.forEach(line => doc.fontSize(10).font("Times-Roman").text(line));
  } else {
      doc.fontSize(10).font("Times-Roman").text("Skills not specified.");
  }


  sectionTitle("Experience");
  // Ensure experience is an array and has items
  if (data.experience.length > 0) {
      data.experience.forEach(exp => {
        // Combine title and company safely
        const titleCompany = [exp.title, exp.company].filter(Boolean).join(' - ');
        doc.font("Times-Bold").fontSize(10).text(titleCompany || 'Experience Item', { continued: true })
           .font("Times-Roman").text(` (${exp.duration || ''})`, { align: 'right' });

        // Add location only if it exists
        if (exp.location) {
            doc.font("Times-Italic").fontSize(9).text(`${exp.location}`); // Slightly smaller font for location
        } else {
            // Add a small space if no location to maintain alignment
            doc.moveDown(0.1);
        }

        // Ensure points is an array
        const points = Array.isArray(exp.points) ? exp.points : [];
        if (points.length > 0) {
            points.forEach(point => doc.font("Times-Roman").fontSize(10).text(`• ${point}`, { indent: 10 }));
        }
        doc.moveDown(0.5); // Space between experience items
      });
  } else {
       doc.fontSize(10).font("Times-Roman").text("No experience listed.");
  }


  sectionTitle("Projects");
  // Ensure projects is an array and has items
  if (data.projects.length > 0) {
      data.projects.forEach(proj => {
          // Safely handle techStack - ensure it's an array before joining
          const techStackText = Array.isArray(proj.techStack) ? proj.techStack.join(', ') : '';
          const titleText = `${proj.title || 'Project Title'}${techStackText ? ` | ${techStackText}` : ''}`;
          doc.font("Times-Bold").fontSize(10).text(titleText);

          // Ensure points is an array
          const points = Array.isArray(proj.points) ? proj.points : [];
           if (points.length > 0) {
                points.forEach(point => doc.font("Times-Roman").fontSize(10).text(`• ${point}`, { indent: 10 }));
           }

          // Ensure links is an object before trying to get values, filter out empty links
          const projectLinks = (proj.links && typeof proj.links === 'object')
                             ? Object.values(proj.links).filter(Boolean).join(' | ')
                             : '';
          if (projectLinks) {
              doc.font("Times-Italic").fontSize(9).text(`Links: ${projectLinks}`);
          }
          doc.moveDown(0.5); // Space between projects
      });
  } else {
       doc.fontSize(10).font("Times-Roman").text("No projects listed.");
  }

  sectionTitle("Education");
   // Ensure education is an array and has items
  if (data.education.length > 0) {
      data.education.forEach(edu => {
        doc.font("Times-Bold").fontSize(10).text(`${edu.institution || 'Institution'}`, { continued: true })
           .font("Times-Roman").text(` (${edu.duration || ''})`, { align: 'right' });
        doc.text(`${edu.degree || 'Degree'}`);
        if (edu.location) {
            doc.font("Times-Roman").fontSize(9).text(`${edu.location}`);
        }
         doc.moveDown(0.3); // Less space between education items
      });
  } else {
       doc.fontSize(10).font("Times-Roman").text("No education listed.");
  }


  return await generatePDFBuffer(doc);
};

// KD template - WITH ROBUST CHECKS
const generatePDFkd = async (data) => {
  // Use the raw data first, normalization might interfere with nested 'details' structure
  // data = normalizeData(data);
  const doc = new PDFDocument({ margin: 40 });

  // Header
  doc.fontSize(18).font('Helvetica-Bold').text(data.name || 'Name Missing', { align: 'left' });
   const contactInfo = [
    data.email,
    data.phone,
    // Check for links object
    (data.links && data.links.github) ? data.links.github : null,
    (data.links && data.links.website) ? data.links.website : null,
    (data.links && data.links.linkedin) ? data.links.linkedin : null,
  ].filter(Boolean).join(' | ');
  doc.fontSize(10).font('Helvetica').text(contactInfo);
  doc.moveDown();

  const section = (title) => {
    doc.moveDown().fontSize(12).font('Helvetica-Bold').text(title.toUpperCase());
    // Draw line slightly below text
    doc.moveTo(doc.x, doc.y + 1).lineTo(doc.page.width - doc.options.margin, doc.y + 1).strokeColor('black').lineWidth(0.5).stroke();
    doc.moveDown(0.7); // Space after line
  };

  // Education Section
  // Check specific nested path for KD
  const eduDetails = (data.education && Array.isArray(data.education.details)) ? data.education.details : [];
  if (eduDetails.length > 0) {
      section("Education");
      eduDetails.forEach(ed => {
          const eduLine = [
              ed.degree,
              ed.institution ? `${ed.institution}${ed.year ? `, ${ed.year}` : ''}` : null, // Combine inst and year
              ed.score
          ].filter(Boolean).join('  |  '); // Join with separators
          doc.font('Helvetica-Bold').fontSize(10).text(eduLine);
          doc.moveDown(0.3);
      });
  }

  // Projects Section
  const projects = Array.isArray(data.projects) ? data.projects : [];
  if (projects.length > 0) {
      section("Projects");
      projects.forEach(proj => {
          const techStackText = Array.isArray(proj.techStack) ? proj.techStack.join(', ') : '';
          const titleText = `${proj.title || 'Project Title'}${techStackText ? ` | ${techStackText}` : ''}`;
          doc.font('Helvetica-Bold').fontSize(10).text(titleText);

          const points = Array.isArray(proj.points) ? proj.points : [];
          if (points.length > 0) {
              points.forEach(point => doc.font('Helvetica').fontSize(10).text(`• ${point}`, { indent: 10 }));
          }

          const projectLinks = (proj.links && typeof proj.links === 'object')
                             ? Object.values(proj.links).filter(Boolean).join(' | ')
                             : '';
          if (projectLinks) {
            doc.font('Helvetica-Oblique').fontSize(9).text(projectLinks);
          }
          doc.moveDown(0.5);
      });
  }


  // Technical Skills Section
  const skills = data.technicalSkills || {};
  const skillLines = [
      (Array.isArray(skills.languages) && skills.languages.length > 0) ? `Programming Languages: ${skills.languages.join(', ')}` : null,
      (Array.isArray(skills.frameworks) && skills.frameworks.length > 0) ? `Frameworks/Libraries: ${skills.frameworks.join(', ')}` : null,
      (Array.isArray(skills.databases) && skills.databases.length > 0) ? `Databases: ${skills.databases.join(', ')}` : null,
      (Array.isArray(skills.tools) && skills.tools.length > 0) ? `Tools & Editing: ${skills.tools.join(', ')}` : null,
  ].filter(Boolean); // Filter out null/empty lines

  if (skillLines.length > 0) {
      section("Technical Skills");
      skillLines.forEach(line => doc.font('Helvetica').fontSize(10).text(line));
  }

  // Courses Taken Section
  const courses = data.courses || {};
  const courseLines = [
      // Handle potentially quoted key "CSE & Maths"
      (Array.isArray(courses["CSE & Maths"]) && courses["CSE & Maths"].length > 0) ? `CSE & Maths: ${courses["CSE & Maths"].join(', ')}` : null,
      (Array.isArray(courses.Other) && courses.Other.length > 0) ? `Other: ${courses.Other.join(', ')}` : null,
  ].filter(Boolean);

  if (courseLines.length > 0) {
      section("Courses Taken");
      courseLines.forEach(line => doc.font('Helvetica').fontSize(10).text(line));
  }


  // Positions of Responsibility
  const positions = Array.isArray(data.positions) ? data.positions : [];
  if (positions.length > 0) {
    section("Positions of Responsibility");
    positions.forEach(pos => {
        const titleOrg = [pos.title, pos.org].filter(Boolean).join(', ');
        doc.font('Helvetica-Bold').fontSize(10).text(titleOrg, { continued: true })
           .font('Helvetica').text(`  (${pos.duration || ''})`);
        if (pos.desc) {
            // Treat desc as potential points
             const descPoints = pos.desc.split('\n').map(p => p.trim()).filter(p => p);
             if (descPoints.length > 1 || descPoints[0]?.startsWith('•')) {
                 descPoints.forEach(point => doc.font('Helvetica').fontSize(10).text(`• ${point.replace(/^•\s*/, '')}`, { indent: 10 }));
             } else {
                 doc.font('Helvetica').fontSize(10).text(`• ${pos.desc}`, { indent: 10 }); // Single line description
             }
        }
      doc.moveDown(0.5);
    });
  }

  // Miscellaneous Section
  const miscItems = Array.isArray(data.misc) ? data.misc : [];
  if (miscItems.length > 0) {
    section("Miscellaneous");
    miscItems.forEach(item => {
        const miscLine = [
            item.title,
            item.desc ? `${item.desc}${item.year ? ` (${item.year})` : ''}`: null
        ].filter(Boolean).join(' - ');
      doc.font('Helvetica-Bold').fontSize(10).text(miscLine);
      doc.moveDown(0.3);
    });
  }

  return await generatePDFBuffer(doc);
};


export {
  generatePDFModern,
  generatePDFClassic,
  generatePDFAzurill,
  generatePDFBhendi,
  generatePDFkd
};

// --- END OF FILE pdfGenerator.js ---
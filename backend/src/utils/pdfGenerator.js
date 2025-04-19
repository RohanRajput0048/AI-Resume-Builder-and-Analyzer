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

// Normalize data structure
const normalizeData = (data) => {
  const normalizeArray = (field) => {
    if (!data[field]) return [];
    return Array.isArray(data[field]) ? data[field] : [data[field]];
  };

  return {
    ...data,
    education: normalizeArray("education"),
    experience: normalizeArray("experience"),
    projects: normalizeArray("projects"),
    positions: normalizeArray("positions"),
    misc: normalizeArray("misc")
  };
};

// Modern template
const generatePDFModern = async (data) => {
  data = normalizeData(data);
  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(24).fillColor('#2E86C1').text(data.name || '', { align: 'center' });
  doc.moveDown().fontSize(12).fillColor('black').text(`Email: ${data.email || ''}`);
  doc.text(`Phone: ${data.phone || ''}`);
  doc.moveDown();

  doc.fontSize(16).text('Education', { underline: true });
  data.education.forEach(ed => {
    doc.fontSize(12).text(`${ed.degree || ''} - ${ed.institution || ''} (${ed.year || ed.duration || ''})`);
  });

  doc.moveDown().fontSize(16).text('Experience', { underline: true });
  data.experience.forEach(exp => {
    doc.fontSize(12).text(`${exp.role || ''} at ${exp.company || ''} (${exp.duration || ''})`);
  });

  doc.moveDown().fontSize(16).text('Skills', { underline: true });
  doc.fontSize(12).text((data.skills || []).join(', '));

  return await generatePDFBuffer(doc);
};

// Classic template
const generatePDFClassic = async (data) => {
  data = normalizeData(data);
  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(18).fillColor('black').text(data.name || '', { align: 'left' });
  doc.moveDown().fontSize(11).text(`Email: ${data.email || ''}`);
  doc.text(`Phone: ${data.phone || ''}`);
  doc.moveDown();

  doc.fontSize(14).text('Education:');
  data.education.forEach(ed => {
    doc.text(`${ed.degree || ''} at ${ed.institution || ''}, ${ed.year || ed.duration || ''}`);
  });

  doc.moveDown().fontSize(14).text('Experience:');
  data.experience.forEach(exp => {
    doc.text(`${exp.role || ''} at ${exp.company || ''}, ${exp.duration || ''}`);
  });

  doc.moveDown().fontSize(14).text('Skills:');
  doc.text((data.skills || []).join(', '));

  return await generatePDFBuffer(doc);
};

// Azurill template
const generatePDFAzurill = async (data) => {
  data = normalizeData(data);
  const doc = new PDFDocument({ margin: 0 });

  doc.rect(0, 0, 150, 1000).fill('#4B0082');

  doc.fillColor('white')
    .fontSize(18)
    .text(data.name || '', 20, 40, { width: 110, align: 'center' });

  doc.fontSize(10)
    .text(data.email || '', 20, 80, { width: 110, align: 'center' })
    .text(data.phone || '', 20, 95, { width: 110, align: 'center' });

  let x = 170;
  let y = 40;

  doc.fontSize(14).fillColor('#4B0082').text('🎓 Education', x, y);
  y += 25;
  data.education.forEach(ed => {
    doc.fontSize(11).fillColor('black')
      .text(`${ed.degree || ''}`, x, y)
      .text(`${ed.institution || ''} (${ed.year || ed.duration || ''})`, x + 10, y + 15);
    y += 45;
  });

  doc.fontSize(14).fillColor('#4B0082').text('💼 Experience', x, y);
  y += 25;
  data.experience.forEach(exp => {
    doc.fontSize(11).fillColor('black')
      .text(`${exp.role || ''}`, x, y)
      .text(`${exp.company || ''} (${exp.duration || ''})`, x + 10, y + 15);
    y += 45;
  });

  doc.fontSize(14).fillColor('#4B0082').text('🛠️ Skills', x, y);
  y += 20;
  doc.fontSize(11).fillColor('black').text((data.skills || []).join(', '), x, y, { width: 400 });

  return await generatePDFBuffer(doc);
};

// Bhendi template
const generatePDFBhendi = async (data) => {
  data = normalizeData(data);
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(20).font("Times-Bold").text(data.name, { align: 'center' });

  const links = [
    data.phone,
    data.email,
    data.links?.linkedin,
    data.links?.github
  ].filter(Boolean).join(' | ');
  doc.fontSize(10).font("Times-Roman").text(links, { align: 'center' });

  const sectionTitle = (title) => {
    doc.moveDown(1.5).fontSize(12).font("Times-Bold").text(title.toUpperCase(), { underline: true });
  };

  sectionTitle("Technical Skills");
  const skills = data.technicalSkills || {};
  const skillText = [
    `Languages: ${(skills.languages || []).join(', ')}`,
    `Frameworks and Libraries: ${(skills.frameworks || []).join(', ')}`,
    `Databases: ${(skills.databases || []).join(', ')}`,
    `Tools and Technologies: ${(skills.tools || []).join(', ')}`
  ];
  skillText.forEach(line => doc.fontSize(10).font("Times-Roman").text(line));

  sectionTitle("Experience");
  data.experience.forEach(exp => {
    doc.font("Times-Bold").fontSize(10).text(`${exp.title} - ${exp.company}`, { continued: true }).font("Times-Roman").text(` (${exp.duration})`, { align: 'right' });
    doc.font("Times-Italic").text(`${exp.location}`);
    (exp.points || []).forEach(point => doc.font("Times-Roman").text(`• ${point}`));
    doc.moveDown(0.5);
  });

  sectionTitle("Projects");
  data.projects.forEach(proj => {
    doc.font("Times-Bold").fontSize(10).text(`${proj.title} | ${(proj.techStack || []).join(', ')}`);
    (proj.points || []).forEach(point => doc.font("Times-Roman").text(`• ${point}`));
    const projectLinks = proj.links ? Object.values(proj.links).join(' | ') : '';
    if (projectLinks) doc.font("Times-Italic").text(`Links: ${projectLinks}`);
    doc.moveDown(0.5);
  });

  sectionTitle("Education");
  data.education.forEach(edu => {
    doc.font("Times-Bold").fontSize(10).text(`${edu.institution}`, { continued: true }).font("Times-Roman").text(` (${edu.duration})`, { align: 'right' });
    doc.text(`${edu.degree}`);
    if (edu.location) doc.text(`${edu.location}`);
  });

  return await generatePDFBuffer(doc);
};

// KD template
const generatePDFkd = async (data) => {
  data = normalizeData(data);
  const doc = new PDFDocument({ margin: 40 });

  // Header
  doc.fontSize(18).font('Helvetica-Bold').text(data.name, { align: 'left' });
  doc.fontSize(10).font('Helvetica').text(
    `${data.email} | ${data.phone} | ${data.links?.github || ''} | ${data.links?.website || ''} | ${data.links?.linkedin || ''}`
  );
  doc.moveDown();

  const section = (title) => {
    doc.moveDown().fontSize(12).font('Helvetica-Bold').text(title.toUpperCase());
    doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.options.margin, doc.y).stroke();
    doc.moveDown(0.5);
  };

  // Education Section
  section("Education");
  const details = data.education.details || [];
  details.forEach(ed => {
    doc.font('Helvetica-Bold').text(`${ed.degree}`, { continued: true })
      .font('Helvetica').text(`  |  ${ed.institution}, ${ed.year}  |  ${ed.score}`);
  });

  // Projects Section
  section("Projects");
  data.projects.forEach(proj => {
    doc.font('Helvetica-Bold').text(`${proj.title} | ${(proj.techStack || []).join(', ')}`);
    (proj.points || []).forEach(point => doc.font('Helvetica').text(`• ${point}`));
    if (proj.links) {
      const links = Object.values(proj.links).join(' | ');
      doc.font('Helvetica-Oblique').text(links);
    }
    doc.moveDown(0.5);
  });

  // Technical Skills Section
  section("Technical Skills");
  const skills = data.technicalSkills || {};
  if (skills.languages) doc.text(`Programming Languages: ${skills.languages.join(', ')}`);
  if (skills.frameworks) doc.text(`Frameworks/Libraries: ${skills.frameworks.join(', ')}`);
  if (skills.databases && skills.databases.length > 0) doc.text(`Databases: ${skills.databases.join(', ')}`);
  if (skills.tools) doc.text(`Tools & Editing: ${skills.tools.join(', ')}`);

  // Courses Taken Section
  section("Courses Taken");
  const courses = data.courses || {};
  if (courses["CSE & Maths"]) doc.text(`CSE & Maths: ${courses["CSE & Maths"].join(', ')}`);
  if (courses.Other) doc.text(`Other: ${courses.Other.join(', ')}`);

  // Positions of Responsibility
  if (data.positions && data.positions.length) {
    section("Positions of Responsibility");
    data.positions.forEach(pos => {
      doc.font('Helvetica-Bold').text(`${pos.title}, ${pos.org}`, { continued: true })
        .font('Helvetica').text(`  (${pos.duration})`);
      doc.font('Helvetica').text(`• ${pos.desc}`);
      doc.moveDown(0.5);
    });
  }

  // Miscellaneous Section
  if (data.misc && data.misc.length) {
    section("Miscellaneous");
    data.misc.forEach(item => {
      doc.font('Helvetica-Bold').text(`${item.title}`, { continued: true })
        .font('Helvetica').text(` - ${item.desc} (${item.year})`);
      doc.moveDown(0.5);
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

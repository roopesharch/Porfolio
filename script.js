async function buildPortfolio() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        // 1. Hero Content
        document.getElementById('user-name').textContent = data.about.name;
        document.getElementById('user-roles').textContent = data.about.roles.join(' • ');
        document.getElementById('user-objective').textContent = data.about.objective;
        
        // 2. Contact Modal Logic
        const rawPhone = data.contact.phone;
        const cleanPhone = rawPhone.replace(/\s+/g, ''); // "+919972572790" for Dialer
        const waPhone = rawPhone.replace(/\D/g, '');    // "919972572790" for WhatsApp
        
        const modalActions = document.getElementById('modal-actions');
        modalActions.innerHTML = `
            <a href="https://wa.me/${waPhone}" target="_blank" class="contact-tile">
                <div class="tile-icon" style="color:#25D366"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.84.5 3.55 1.39 5.04L2.06 22l5.09-1.33c1.42.77 3.03 1.21 4.7 1.21 5.54 0 10.04-4.5 10.04-10.04C21.89 6.5 17.39 2 12.04 2m5.81 14.21c-.24.69-1.39 1.25-1.91 1.33-.46.07-.9.12-3.04-.77-2.58-1.07-4.24-3.69-4.37-3.86-.12-.17-1.03-1.38-1.03-2.63 0-1.25.65-1.86.88-2.11.23-.25.5-.31.67-.31h.43c.14 0 .32 0 .49.4.18.43.6 1.47.65 1.58.05.11.08.23 0 .4-.08.17-.12.28-.24.43-.13.15-.26.34-.38.45-.14.13-.28.27-.12.54.16.27.7 1.15 1.5 1.86.8.71 1.48.93 1.75 1.07.27.13.43.11.59-.08.16-.18.69-.8.87-1.08.18-.27.35-.23.59-.14.24.09 1.5.71 1.76.84.26.12.43.19.5.3.06.12.06.69-.18 1.38Z"/></svg></div>
                <div class="tile-info"><span class="tile-label">WhatsApp</span><span class="tile-value">Direct Chat</span></div>
            </a>
            <a href="tel:${cleanPhone}" class="contact-tile">
                <div class="tile-icon" style="color:var(--primary)"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg></div>
                <div class="tile-info"><span class="tile-label">Phone</span><span class="tile-value">Direct Call</span></div>
            </a>
            <a href="mailto:${data.contact.email}" class="contact-tile">
                <div class="tile-icon" style="color:#6366f1"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" /></svg></div>
                <div class="tile-info"><span class="tile-label">Email</span><span class="tile-value">Send Proposal</span></div>
            </a>
        `;

        // 3. Skills Categories (Dropdowns)
        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = ''; 
        for (const [mainCatName, subGroups] of Object.entries(data.skills)) {
            const catHeader = document.createElement('h3');
            catHeader.style.cssText = "font-size: 1rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin: 40px 0 20px; border-left: 3px solid var(--primary); padding-left: 15px;";
            catHeader.textContent = mainCatName.replace(/_/g, ' ');
            skillsContainer.appendChild(catHeader);
            const grid = document.createElement('div');
            grid.className = 'subskill-grid-5';
            for (const [name, list] of Object.entries(subGroups)) {
                const wrapper = document.createElement('div');
                wrapper.className = 'skill-dropdown-wrapper';
                wrapper.innerHTML = `
                    <div class="dropdown-trigger"><span>${name.replace(/_/g, ' ')}</span> <span class="arrow">▼</span></div>
                    <div class="dropdown-content collapsed">${list.map(s => `<span class="tag">${s}</span>`).join('')}</div>
                `;
                const trigger = wrapper.querySelector('.dropdown-trigger');
                const content = wrapper.querySelector('.dropdown-content');
                const arrow = trigger.querySelector('.arrow');
                trigger.onclick = (e) => {
                    e.stopPropagation();
                    const isCollapsed = content.classList.toggle('collapsed');
                    arrow.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
                };
                wrapper.onmouseleave = () => {
                    if (!document.getElementById('global-skill-toggle').checked) {
                        content.classList.add('collapsed');
                        arrow.style.transform = 'rotate(0deg)';
                    }
                };
                grid.appendChild(wrapper);
            }
            skillsContainer.appendChild(grid);
        }

        // 4. Experience Rendering
        const expContainer = document.getElementById('experience-container');
        expContainer.innerHTML = `<div class="skills-header-flex"><h2 class="main-section-title">Professional Experience</h2></div>` + 
        data.experience.map((exp, i) => `
            <div class="experience-box" id="exp-box-${i}">
                <h4 style="font-weight:800; margin:0;">${exp.role}</h4>
                <div style="color:var(--primary); font-weight:600; font-size:0.8rem; margin-bottom:10px;">${exp.company} • ${exp.tenure}</div>
                <p style="font-family:var(--font-accent); color:var(--text-muted); margin:0;">${exp.one_liner}</p>
                <ul class="responsibilities-list" id="resp-list-${i}">${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
                <div id="toggle-text-${i}" style="margin-top:15px; font-size:0.7rem; color:var(--primary); font-weight:700; text-transform:uppercase; letter-spacing:1px; opacity: 0.6;">Click to toggle details</div>
            </div>
        `).join('');

        data.experience.forEach((_, i) => {
            document.getElementById(`exp-box-${i}`).onclick = function() {
                const list = document.getElementById(`resp-list-${i}`);
                const label = document.getElementById(`toggle-text-${i}`);
                const isActive = list.classList.toggle('active');
                label.textContent = isActive ? "Click to hide details" : "Click to toggle details";
                label.style.opacity = isActive ? "1" : "0.6";
            };
        });

        // 5. Projects
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = data.projects.map(proj => `
            <div class="experience-box" style="cursor: default; border-left: 4px solid var(--primary);">
                <h4 style="font-weight: 800; margin-bottom: 5px;">${proj.title}</h4>
                <p style="font-family: var(--font-accent); color: var(--text-main); margin-bottom: 20px;">${proj.description}</p>
                <a href="${proj.link}" target="_blank" class="nav-pill">View Case Study →</a>
            </div>
        `).join('');

        document.getElementById('toggle-projects-btn').onclick = function() {
            const isHidden = window.getComputedStyle(projectsContainer).display === 'none';
            projectsContainer.style.display = isHidden ? 'flex' : 'none';
            this.textContent = isHidden ? 'Hide Projects' : 'Show Projects';
        };

        // 6. Certifications
        const certsContainer = document.getElementById('certs-container');
        certsContainer.innerHTML = data.certifications.map(cert => `
            <div class="experience-box" style="cursor: default; padding: 25px 45px; border-left: 4px solid #10b981;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                    <div>
                        <h4 style="font-weight: 800; margin: 0;">${cert.name}</h4>
                        <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 5px;">${cert.provider} • ${cert.year}</div>
                    </div>
                    <a href="${cert.link}" target="_blank" class="nav-pill" style="color: #10b981; border-color: #10b981;">Verify</a>
                </div>
            </div>
        `).join('');

        document.getElementById('toggle-certs-btn').onclick = function() {
            const isHidden = window.getComputedStyle(certsContainer).display === 'none';
            certsContainer.style.display = isHidden ? 'flex' : 'none';
            this.textContent = isHidden ? 'Hide Certifications' : 'Show Certifications';
        };

        // 7. Languages 
        if (data.languages) {
            const langContainer = document.getElementById('languages-container');
            langContainer.innerHTML = Object.entries(data.languages).map(([category, list]) => `
                <div class="lang-card-new">
                    <span class="lang-label-new">${category}</span>
                    <div class="lang-pill-container-new">
                        ${list.map(lang => `<span class="lang-pill-item-new">${lang}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        document.getElementById('toggle-langs-btn').onclick = function() {
            const langContainer = document.getElementById('languages-container');
            const isHidden = window.getComputedStyle(langContainer).display === 'none';
            langContainer.style.display = isHidden ? 'grid' : 'none';
            this.textContent = isHidden ? 'Hide Languages' : 'Show Languages';
        };

        // 8. Global Expand Toggle
        document.getElementById('global-skill-toggle').addEventListener('change', function() {
            const allContents = document.querySelectorAll('.dropdown-content');
            const allArrows = document.querySelectorAll('.arrow');
            allContents.forEach(c => this.checked ? c.classList.remove('collapsed') : c.classList.add('collapsed'));
            allArrows.forEach(a => a.style.transform = this.checked ? 'rotate(180deg)' : 'rotate(0deg)');
        });

        // 9. Modal UI Controls
        const modal = document.getElementById('contact-modal');
        document.getElementById('open-contact').onclick = () => modal.classList.add('active');
        document.querySelector('.close-modal').onclick = () => modal.classList.remove('active');
        window.onclick = (e) => { if(e.target == modal) modal.classList.remove('active'); };

        // 10. Final Contact Section Logic
        const contactGrid = document.getElementById('final-contact-grid');
        contactGrid.innerHTML = `
            <a href="https://wa.me/${waPhone}" target="_blank" class="footer-contact-card">
                <div class="f-icon" style="background:#25D366"><svg viewBox="0 0 24 24"><path fill="white" d="M12.04 2C6.5 2 2 6.5 2 12.04c0 1.84.5 3.55 1.39 5.04L2.06 22l5.09-1.33c1.42.77 3.03 1.21 4.7 1.21 5.54 0 10.04-4.5 10.04-10.04C21.89 6.5 17.39 2 12.04 2m5.81 14.21c-.24.69-1.39 1.25-1.91 1.33-.46.07-.9.12-3.04-.77-2.58-1.07-4.24-3.69-4.37-3.86-.12-.17-1.03-1.38-1.03-2.63 0-1.25.65-1.86.88-2.11.23-.25.5-.31.67-.31h.43c.14 0 .32 0 .49.4.18.43.6 1.47.65 1.58.05.11.08.23 0 .4-.08.17-.12.28-.24.43-.13.15-.26.34-.38.45-.14.13-.28.27-.12.54.16.27.7 1.15 1.5 1.86.8.71 1.48.93 1.75 1.07.27.13.43.11.59-.08.16-.18.69-.8.87-1.08.18-.27.35-.23.59-.14.24.09 1.5.71 1.76.84.26.12.43.19.5.3.06.12.06.69-.18 1.38Z"/></svg></div>
                <div class="f-label">WhatsApp</div>
            </a>
            <a href="tel:${cleanPhone}" class="footer-contact-card">
                <div class="f-icon" style="background:var(--primary)"><svg viewBox="0 0 24 24"><path fill="white" d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg></div>
                <div class="f-label">Call Now</div>
            </a>
            <a href="mailto:${data.contact.email}" class="footer-contact-card">
                <div class="f-icon" style="background:#ea4335"><svg viewBox="0 0 24 24"><path fill="white" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg></div>
                <div class="f-label">Email Me</div>
            </a>
            ${data.contact.socials.map(s => `
                <a href="${s.url}" target="_blank" class="footer-contact-card">
                    <div class="f-icon" style="background:${s.platform === 'linkedin' ? '#0077b5' : '#333'}">
                        ${s.platform === 'linkedin' ? 
                            '<svg viewBox="0 0 24 24"><path fill="white" d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"/></svg>' : 
                            '<svg viewBox="0 0 24 24"><path fill="white" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21.03C9.5,20.82 9.5,20.24 9.5,19.41C6.73,20.03 6.14,18.1 6.14,18.1C5.69,16.96 5.05,16.65 5.05,16.65C4.14,16.03 5.12,16.05 5.12,16.05C6.12,16.12 6.65,17.09 6.65,17.09C7.53,18.62 9,18.18 9.56,17.91C9.65,17.27 9.91,16.84 10.2,16.59C7.97,16.34 5.63,15.47 5.63,11.64C5.63,10.54 6,9.64 6.63,8.93C6.53,8.68 6.18,7.65 6.73,6.28C6.73,6.28 7.57,6.02 9.47,7.3C10.27,7.08 11.12,6.97 12,6.97C12.88,6.97 13.73,7.08 14.53,7.3C16.43,6.02 17.27,6.28 17.27,6.28C17.82,7.65 17.47,8.68 17.37,8.93C18,9.64 18.37,10.54 18.37,11.64C18.37,15.48 16.03,16.34 13.8,16.59C14.15,16.9 14.47,17.5 14.47,18.44C14.47,19.79 14.46,20.88 14.46,21.2C14.46,21.46 14.63,21.77 15.13,21.67C19.1,20.33 22,16.58 22,12A10,10 0 0,0 12,2Z"/></svg>'
                        }
                    </div>
                    <div class="f-label">${s.platform}</div>
                </a>
            `).join('')}
        `;

    } catch (err) { console.error(err); }
}
document.addEventListener('DOMContentLoaded', buildPortfolio);
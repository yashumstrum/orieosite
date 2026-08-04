/* ==========================================================================
   TEKRON 2026 Portal - Interactions & Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initOrientationLoader();
    initStarsBackground();
    initModalControls();
    initCountdownTimer();
    initPocDirectory();
    initFacultyDirectory();
    initCampusMapInteractions();
    initCultureGallery();
    initSoundToggle();
});

/* ==========================================================================
   0. Orientation Loading Screen Timer
   ========================================================================== */
function initOrientationLoader() {
    const loader = document.getElementById('orientation-loader');
    const bar = document.getElementById('loader-bar');
    const percentEl = document.getElementById('loader-percent');
    const statusTextEl = document.getElementById('loader-status-text');
    
    if (!loader || !bar || !percentEl || !statusTextEl) return;
    
    let progress = 0;
    const duration = 1800; // 1.8 seconds duration
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);
    
    const interval = setInterval(() => {
        progress += increment;
        if (progress > 100) progress = 100;
        
        bar.style.width = `${progress}%`;
        percentEl.textContent = `${Math.floor(progress)}%`;
        
        if (progress < 30) {
            statusTextEl.textContent = "GENERATING MINECRAFT WORLD...";
        } else if (progress < 65) {
            statusTextEl.textContent = "BUILDING ADYPU CAMPUS...";
        } else if (progress < 95) {
            statusTextEl.textContent = "LOADING ORIENTATION MAP...";
        } else {
            statusTextEl.textContent = "WELCOME TO NST ORIENTATION 2026!";
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 300);
        }
    }, intervalTime);
}

/* ==========================================================================
   0b. Minecraft OG Background Music Toggle (C418 - Sweden)
   ========================================================================== */
function initSoundToggle() {
    const btn = document.getElementById('sound-toggle-btn');
    const icon = document.getElementById('sound-icon');
    const label = document.getElementById('sound-label');
    if (!btn) return;

    const bgm = new Audio('assets/minecraft_bgm.mp3');
    bgm.loop = true;
    bgm.volume = 0.55;
    let isPlaying = false;
    let fadeInterval = null;

    function fadeIn() {
        clearInterval(fadeInterval);
        bgm.volume = 0;
        bgm.play().catch(err => console.log('Audio playback interaction needed:', err));
        fadeInterval = setInterval(() => {
            if (bgm.volume < 0.55) {
                bgm.volume = Math.min(0.55, bgm.volume + 0.04);
            } else {
                clearInterval(fadeInterval);
            }
        }, 80);
    }

    function fadeOut() {
        clearInterval(fadeInterval);
        fadeInterval = setInterval(() => {
            if (bgm.volume > 0.04) {
                bgm.volume = Math.max(0, bgm.volume - 0.04);
            } else {
                bgm.pause();
                bgm.volume = 0.55;
                clearInterval(fadeInterval);
            }
        }, 80);
    }

    btn.addEventListener('click', () => {
        if (isPlaying) {
            fadeOut();
            isPlaying = false;
            btn.classList.remove('playing');
            icon.textContent = '♪';
            label.textContent = 'MUSIC';
            btn.title = 'Play OG Minecraft Music';
        } else {
            fadeIn();
            isPlaying = true;
            btn.classList.add('playing');
            icon.textContent = '♫';
            label.textContent = 'MUTE';
            btn.title = 'Mute OG Minecraft Music';
        }
    });
}

/* ==========================================================================
   1. Animated Space Background (Canvas Stars)
   ========================================================================== */
function initStarsBackground() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    const starCount = 150; // Increased count for better cosmic density
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Class representing a single star
    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.04;
            this.speedY = (Math.random() - 0.5) * 0.04;
            this.alpha = Math.random();
            this.fadeSpeed = Math.random() * 0.01 + 0.003;
            this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Warp coordinates if they drift offscreen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // Twinkle animation
            this.alpha += this.fadeSpeed * this.fadeDirection;
            if (this.alpha >= 1) {
                this.alpha = 1;
                this.fadeDirection = -1;
            } else if (this.alpha <= 0.1) {
                this.alpha = 0.1;
                this.fadeDirection = 1;
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Instantiate stars
    for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* ==========================================================================
   2. Modal Open/Close Controls
   ========================================================================== */
function initModalControls() {
    const buildingNodes = document.querySelectorAll('.island-wrapper.active-island');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    
    buildingNodes.forEach(bld => {
        bld.addEventListener('click', (e) => {
            const modalId = bld.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            
            if (bld.classList.contains('locked-bld')) {
                // Play shaking animation on locked island
                bld.classList.add('shake-animation');
                
                // Clear the class after animation completes so it can be retriggered
                bld.addEventListener('animationend', () => {
                    bld.classList.remove('shake-animation');
                }, { once: true });
            }
            
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock window scrolling
            }
        });
    });
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Click outside modal content to close
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });
    
    // ESC key to close modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
    
    function closeAllModals() {
        modals.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = ''; // Unlock scrolling
    }
}

/* ==========================================================================
   3. Locked Events Countdown Decryption Timer
   ========================================================================== */
function initCountdownTimer() {
    // Set locked decryption target to exactly 4 days, 6 hours from current date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);
    targetDate.setHours(targetDate.getHours() + 6);
    
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            clearInterval(timerInterval);
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    const timerInterval = setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   4. POC & OC Directory Rendering and Filtering (CONTACT modal)
   ========================================================================== */
const pocData = [
    {
        name: "Aryan Sharma",
        role: "OC PRESIDENT",
        dept: "oc-head",
        desc: "Oversees all orientation logistics and student integration. Reach out for major concerns.",
        avatar: "fa-user-tie",
        phone: "+919876543210",
        email: "aryan.sharma@newtonschool.co"
    },
    {
        name: "Diya Kapoor",
        role: "HOSPITALITY LEAD",
        dept: "hospitality",
        desc: "Handles hostel allotments, dining operations, and campus tours. Direct any room issues here.",
        avatar: "fa-hotel",
        phone: "+919876543211",
        email: "diya.k@newtonschool.co"
    },
    {
        name: "Kabir Verma",
        role: "TECHNICAL DIRECTOR",
        dept: "tech",
        desc: "Organizer for the Induction Hackathon and platform manager. Contact for lab access.",
        avatar: "fa-laptop-code",
        phone: "+919876543212",
        email: "kabir.v@newtonschool.co"
    },
    {
        name: "Sneha Patel",
        role: "LOGISTICS COORDINATOR",
        dept: "logistics",
        desc: "Manages event materials, transport coordination, and schedule adjustments.",
        avatar: "fa-truck-ramp-box",
        phone: "+919876543213",
        email: "sneha.patel@newtonschool.co"
    },
    {
        name: "Rohan Malhotra",
        role: "SAFETY & EMERGENCY HEAD",
        dept: "logistics",
        desc: "Medical liaison and security coordinator. Contact for wellness clinic or safety details.",
        avatar: "fa-shield-halved",
        phone: "+919876543214",
        email: "rohan.m@newtonschool.co"
    },
    {
        name: "Kiara Sen",
        role: "CULTURAL COORDINATOR",
        dept: "hospitality",
        desc: "Arranges the food carnival, student panels, and night performances.",
        avatar: "fa-guitar",
        phone: "+919876543215",
        email: "kiara.sen@newtonschool.co"
    }
];

function initPocDirectory() {
    const grid = document.getElementById('poc-grid-container');
    const searchInput = document.getElementById('poc-search-input');
    const filterButtons = document.querySelectorAll('#poc-filters .filter-btn');
    
    if (!grid) return;
    
    function renderPocs(data) {
        grid.innerHTML = '';
        if (data.length === 0) {
            grid.innerHTML = `
                <div class="no-results-msg" style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 2rem;">
                    <i class="fa-solid fa-user-slash" style="font-size: 2.5rem; margin-bottom: 0.5rem; display: block; color: var(--color-purple);"></i>
                    No contact match found. Try searching another term.
                </div>
            `;
            return;
        }
        
        data.forEach(poc => {
            const card = document.createElement('div');
            card.className = 'poc-card glass-card';
            card.setAttribute('data-dept', poc.dept);
            card.innerHTML = `
                <div class="poc-avatar">
                    <i class="fa-solid ${poc.avatar}"></i>
                </div>
                <div class="poc-info">
                    <span class="poc-role-badge">${poc.role}</span>
                    <h3 class="poc-name">${poc.name}</h3>
                    <p class="poc-desc">${poc.desc}</p>
                    <div class="poc-contacts">
                        <a href="tel:${poc.phone}" class="contact-link phone" title="Call ${poc.name}"><i class="fa-solid fa-phone"></i></a>
                        <a href="https://wa.me/${poc.phone.replace('+', '')}?text=Hi%20${encodeURIComponent(poc.name)},%20I%20am%20a%20junior%20joining%20NST..." target="_blank" class="contact-link whatsapp" title="WhatsApp ${poc.name}"><i class="fa-brands fa-whatsapp"></i></a>
                        <a href="mailto:${poc.email}" class="contact-link email" title="Email ${poc.name}"><i class="fa-solid fa-envelope"></i></a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    
    // Initial Render
    renderPocs(pocData);
    
    // Filter and Search Logic
    function handleFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilterBtn = document.querySelector('#poc-filters .filter-btn.active');
        const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        const filtered = pocData.filter(poc => {
            const matchesSearch = poc.name.toLowerCase().includes(searchTerm) || 
                                  poc.role.toLowerCase().includes(searchTerm) ||
                                  poc.desc.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || poc.dept === activeCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        renderPocs(filtered);
    }
    
    // Listeners
    if (searchInput) searchInput.addEventListener('input', handleFilters);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            handleFilters();
        });
    });
}

/* ==========================================================================
   5. Faculty Directory Rendering and Filtering (ABOUT modal)
   ========================================================================== */
const facultyData = [
    {
        name: "Dr. Amit Mukerjee",
        title: "HEAD OF COMPUTER SCIENCE",
        dept: "cs",
        subject: "Core Programming & Data Structures",
        bio: "Former researcher in Distributed Systems. Amit oversees curriculum paths and mentors coding thesis papers.",
        avatar: "fa-user-gear",
        funFact: "Favorite Keyboard",
        funFactText: "He owns a collection of 15 mechanical keyboards, including a rare IBM Model M from 1985!"
    },
    {
        name: "Prof. Sarah D'Souza",
        title: "FOUNDATIONS LEAD",
        dept: "math",
        subject: "Discrete Mathematics & Linear Algebra",
        bio: "Passionate about discrete structures, logic models, and applying pure math to deep learning neural networks.",
        avatar: "fa-calculator",
        funFact: "Mental Calculator",
        funFactText: "She can calculate the day of the week for any historical calendar date in under 3 seconds!"
    },
    {
        name: "Dr. Rajesh Kulkarni",
        title: "SYSTEM ARCHITECT PROFESSOR",
        dept: "cs",
        subject: "Web Engineering & Software Design",
        bio: "Industry veteran who built early commercial ISP databases. Specializes in cloud computing and scalable backends.",
        avatar: "fa-server",
        funFact: "Web Pioneer",
        funFactText: "He launched Pune's first local internet bulletin board system (BBS) back in 1993."
    },
    {
        name: "Prof. Ananya Iyer",
        title: "DESIGN THEORY MENTOR",
        dept: "humanity",
        subject: "Human-Centered UI/UX & Communication",
        bio: "Expert in interface aesthetics, cognitive psychology, and building empathy-driven design frameworks.",
        avatar: "fa-palette",
        funFact: "Multilingual Explorer",
        funFactText: "Ananya speaks 6 languages and has visited over 30 countries to document traditional design styles."
    },
    {
        name: "Prof. Vikram Rathore",
        title: "AI INSTRUCTOR",
        dept: "math",
        subject: "Algorithms & Machine Learning Foundations",
 bio: "Specializes in algorithmic complexity, competitive programming algorithms, and reinforcement learning agent architectures.",
        avatar: "fa-brain",
        funFact: "Chess Challenge",
        funFactText: "He will offer an automatic 'A' grade on code optimizations if you can beat him in a game of speed chess."
    }
];

function initFacultyDirectory() {
    const grid = document.getElementById('faculty-grid-container');
    const searchInput = document.getElementById('faculty-search-input');
    const filterButtons = document.querySelectorAll('#faculty-filters .filter-btn');
    
    if (!grid) return;
    
    function renderFaculty(data) {
        grid.innerHTML = '';
        if (data.length === 0) {
            grid.innerHTML = `
                <div class="no-results-msg" style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 2rem;">
                    <i class="fa-solid fa-graduation-cap" style="font-size: 2.5rem; margin-bottom: 0.5rem; display: block; color: var(--color-green);"></i>
                    No faculty found. Try searching another specialty.
                </div>
            `;
            return;
        }
        
        data.forEach(fac => {
            const card = document.createElement('div');
            card.className = 'faculty-card glass-card';
            card.setAttribute('data-dept', fac.dept);
            card.innerHTML = `
                <div class="fac-header-info">
                    <div class="fac-avatar">
                        <i class="fa-solid ${fac.avatar}"></i>
                    </div>
                    <div class="fac-names">
                        <span class="fac-title">${fac.title}</span>
                        <h3 class="fac-name">${fac.name}</h3>
                    </div>
                </div>
                <div class="fac-desc-box">
                    <div class="fac-subject"><i class="fa-solid fa-book"></i> ${fac.subject}</div>
                    <p class="fac-bio">${fac.bio}</p>
                </div>
                <div class="fac-fun-fact">
                    <strong><i class="fa-solid fa-lightbulb"></i> Fun Fact: ${fac.funFact}</strong>
                    <span>${fac.funFactText}</span>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    
    // Initial Render
    renderFaculty(facultyData);
    
    // Filtering Logic
    function handleFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilterBtn = document.querySelector('#faculty-filters .filter-btn.active');
        const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        const filtered = facultyData.filter(fac => {
            const matchesSearch = fac.name.toLowerCase().includes(searchTerm) || 
                                  fac.subject.toLowerCase().includes(searchTerm) ||
                                  fac.bio.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || fac.dept === activeCategory;
            
            return matchesSearch && matchesCategory;
        });
        
        renderFaculty(filtered);
    }
    
    if (searchInput) searchInput.addEventListener('input', handleFilters);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            handleFilters();
        });
    });
}

/* ==========================================================================
   6. Campus Map Interactions (Inside HOME modal)
   ========================================================================== */
const landmarkDetails = {
    "lm-admin": {
        title: "ADYPU Central Admin Block",
        body: "The administrative heart of DY Patil Knowledge City. Houses the admissions registry, security office, and student services counters.",
        details: "<strong>Orientation Activity:</strong> Document verification and ID card collection center. Day 1 registration happens in the main lobby."
    },
    "lm-academic": {
        title: "NST Academic Lecture Block",
        body: "Houses modular engineering labs, high-tech classrooms, coding hubs, and faculty cabins.",
        details: "<strong>Orientation Activity:</strong> Day 2 Tech Curriculum Deep-dive and daily academic panel talks."
    },
    "lm-library": {
        title: "ADYPU Knowledge Resource Centre (Library)",
        body: "A multi-level library facility featuring quiet study zones, engineering archives, and collab hubs.",
        details: "<strong>Orientation Activity:</strong> Day 4 Innovation Hackathon planning sessions and team workspace bookings."
    },
    "lm-auditorium": {
        title: "Central University Auditorium",
        body: "A spacious theater auditorium featuring advanced acoustics, stadium seating, and video projections.",
        details: "<strong>Orientation Activity:</strong> Day 1 Induction Ceremony keynote, and Day 6 Hackathon pitching finals."
    },
    "lm-cafeteria": {
        title: "ADYPU Cafeteria & Mess Complex",
        body: "The central dining hub serving a rotating menu of Indian and continental cuisine. Outdoor garden benches are perfect for socialising.",
        details: "<strong>Orientation Activity:</strong> Day 5 Food Carnival and senior-junior networking dinner."
    },
    "lm-sports": {
        title: "ADYPU Arena & Sports Plaza",
        body: "Sports complex featuring outdoor courts (tennis, basketball), indoor table tennis hubs, and grass fields.",
        details: "<strong>Orientation Activity:</strong> Day 3 Team Building matches and recreational sports icebreakers."
    },
    "lm-hostel": {
        title: "NST Residential Hostel Blocks",
        body: "Modern residential housing for student scholars. Equipped with study spaces, Wi-Fi hubs, laundry services, and common lounge rooms.",
        details: "<strong>Orientation Activity:</strong> Day 7 checkout check-in updates and settling."
    }
};

function initCampusMapInteractions() {
    const landmarks = document.querySelectorAll('.map-landmark');
    const infoDisplay = document.getElementById('landmark-info-display');
    const tabSched = document.getElementById('btn-tab-sched');
    const tabMap = document.getElementById('btn-tab-map');
    const tabSchedList = document.getElementById('tab-schedule-list');
    const tabCampusMap = document.getElementById('tab-campus-map');
    
    if (!infoDisplay) return;
    
    function showLandmarkInfo(landmarkId) {
        const data = landmarkDetails[landmarkId];
        if (!data) return;
        
        infoDisplay.innerHTML = `
            <h3 class="info-title" style="color: var(--color-cyan)">${data.title}</h3>
            <p class="info-body">${data.body}</p>
            <div class="info-details-box">
                ${data.details}
            </div>
        `;
        
        // Highlight active landmark
        landmarks.forEach(lm => lm.classList.remove('highlighted'));
        const targetNode = document.getElementById(landmarkId);
        if (targetNode) {
            targetNode.classList.add('highlighted');
        }
    }
    
    landmarks.forEach(lm => {
        lm.addEventListener('click', () => {
            const id = lm.getAttribute('id');
            showLandmarkInfo(id);
        });
    });
    
    // Timeline Highlight triggers
    const highlightTriggers = document.querySelectorAll('.highlight-trigger');
    highlightTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering timeline panel click
            const venue = trigger.getAttribute('data-target-venue');
            const landmarkId = `lm-${venue}`;
            
            // Switch tabs to Campus Map
            if (tabSched && tabMap && tabSchedList && tabCampusMap) {
                tabSched.classList.remove('active');
                tabMap.classList.add('active');
                tabSchedList.classList.remove('active');
                tabCampusMap.classList.add('active');
            }
            
            // Show corresponding landmark info & highlight on map
            setTimeout(() => {
                showLandmarkInfo(landmarkId);
            }, 50);
        });
    });
    
    // Setup tabs logic manually inside Schedule Modal
    if (tabSched && tabMap) {
        tabSched.addEventListener('click', () => {
            tabSched.classList.add('active');
            tabMap.classList.remove('active');
            tabSchedList.classList.add('active');
            tabCampusMap.classList.remove('active');
        });
        tabMap.addEventListener('click', () => {
            tabMap.classList.add('active');
            tabSched.classList.remove('active');
            tabCampusMap.classList.add('active');
            tabSchedList.classList.remove('active');
        });
    }
}

/* ==========================================================================
   7. Guidelines Accordion logic (HOSPITALITY modal)
   ========================================================================== */
const accHeaders = document.querySelectorAll('.accordion-header');
accHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close other panels
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });
        
        // Toggle current panel
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

/* ==========================================================================
   8. Culture Photo Gallery & Lightbox (GALLERY modal)
   ========================================================================== */
function initCultureGallery() {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption-text');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery-img');
            const caption = item.querySelector('.gallery-caption');
            
            if (img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption ? caption.textContent : '';
                lightbox.classList.add('active');
            }
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}

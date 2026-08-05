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
    initIslandXPOrbs();
});

/* ==========================================================================
   0. Orientation Loading Screen Timer
   ========================================================================== */
function initOrientationLoader() {
    const loader = document.getElementById('orientation-loader');
    const bar = document.getElementById('loader-bar');
    const percentEl = document.getElementById('loader-percent');
    const statusTextEl = document.getElementById('loader-status-text');
    const tipTextEl = document.getElementById('loader-tip-text');

    if (!loader || !bar || !percentEl || !statusTextEl) return;

    const minecraftTips = [
        "Check the Schedule island for ADYPU campus events!",
        "Diamonds are rare. So is this orientation — enjoy every moment.",
        "The POC island has all your Point of Contact info. Don't get lost!",
        "Sleep through the night by attending ALL orientation sessions.",
        "Pro tip: The Guidelines island keeps you on track!",
        "Respawn point set ✅ — Newton School of Technology, ADYPU Pune.",
        "Culture island = where legends are made. Check it out!",
        "Remember: In Minecraft and at NST, teamwork makes the dream work."
    ];

    let tipIndex = 0;
    if (tipTextEl) {
        tipTextEl.textContent = minecraftTips[0];
        setInterval(() => {
            tipIndex = (tipIndex + 1) % minecraftTips.length;
            tipTextEl.style.opacity = '0';
            setTimeout(() => {
                tipTextEl.textContent = minecraftTips[tipIndex];
                tipTextEl.style.opacity = '1';
            }, 200);
        }, 2000);
        tipTextEl.style.transition = 'opacity 0.2s ease';
    }

    let progress = 0;
    const duration = 2200; // 2.2 seconds duration
    const intervalTime = 20;
    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
        progress += increment;
        if (progress > 100) progress = 100;

        bar.style.width = `${progress}%`;
        percentEl.textContent = `${Math.floor(progress)}%`;

        if (progress < 25) {
            statusTextEl.textContent = "GENERATING MINECRAFT WORLD...";
        } else if (progress < 55) {
            statusTextEl.textContent = "BUILDING ADYPU CAMPUS...";
        } else if (progress < 85) {
            statusTextEl.textContent = "PLACING ORIENTATION ISLANDS...";
        } else {
            statusTextEl.textContent = "WELCOME TO NST, BATCH OF 2030!";
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('fade-out');
                triggerWorldEntranceAnimation();
            }, 350);
        }
    }, intervalTime);
}

/* ==========================================================================
   0a. Majestic Cloud Parting & Staggered Island Entrance Animation
   ========================================================================== */
function triggerWorldEntranceAnimation() {
    const canvas = document.getElementById('cloud-warp-canvas');
    const universe = document.getElementById('main-universe-section');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Camera zoom-out entrance
    if (universe) {
        universe.classList.add('zoom-entrance');
        setTimeout(() => universe.classList.remove('zoom-entrance'), 1500);
    }

    // 2. Generate 35 puffy Minecraft cloud clusters floating outwards
    const clouds = [];
    for (let i = 0; i < 35; i++) {
        clouds.push({
            x: (Math.random() - 0.5) * width * 1.8,
            y: (Math.random() - 0.5) * height * 1.8,
            z: Math.random() * 600 + 150,
            w: 180 + Math.random() * 220,
            h: 55 + Math.random() * 65,
            speed: 4 + Math.random() * 4, // Slow, majestic cloud drift
            driftX: (Math.random() - 0.5) * 2.5
        });
    }

    const startTime = performance.now();
    const duration = 3200; // 3.2 seconds majestic cloud reveal

    function animateClouds(now) {
        const elapsed = now - startTime;
        ctx.clearRect(0, 0, width, height);

        clouds.forEach(c => {
            c.z -= c.speed;
            c.x += c.driftX;
            if (c.z < 10) return;

            const scale = 400 / c.z;
            const screenX = width / 2 + c.x * (scale * 0.45);
            const screenY = height / 2 + c.y * (scale * 0.45);
            const cloudW = c.w * (scale * 0.45);
            const cloudH = c.h * (scale * 0.45);

            // Smooth cloud fade in and fade out
            const fade = Math.min(1, elapsed / 300) * Math.min(1, (3200 - elapsed) / 800);
            if (fade > 0.01 && cloudW < width * 1.5) {
                const r = 18 * Math.max(0.4, scale * 0.45);
                ctx.fillStyle = `rgba(255, 255, 255, ${fade * 0.92})`;
                ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
                ctx.shadowBlur = 20;

                ctx.beginPath();
                // Main cloud body
                ctx.roundRect(screenX - cloudW / 2, screenY - cloudH / 2, cloudW, cloudH, r);
                // Top puff lobe
                ctx.roundRect(screenX - cloudW * 0.25, screenY - cloudH * 0.75, cloudW * 0.5, cloudH * 0.6, r);
                ctx.fill();

                // Lower subtle cloud shadow
                ctx.fillStyle = `rgba(220, 235, 252, ${fade * 0.5})`;
                ctx.beginPath();
                ctx.roundRect(screenX - cloudW * 0.4, screenY + cloudH * 0.1, cloudW * 0.8, cloudH * 0.35, r);
                ctx.fill();
            }
        });

        if (elapsed < duration) {
            requestAnimationFrame(animateClouds);
        } else {
            canvas.classList.add('fade-out');
            setTimeout(() => (canvas.style.display = 'none'), 800);
        }
    }

    requestAnimationFrame(animateClouds);

    // 3. Staggered 3D Float-Up Entrance for the 6 Islands
    const revealOrder = [
        'island-schedule',
        'island-poc',
        'island-guidelines',
        'island-culture',
        'island-events',
        'island-faculty'
    ];

    revealOrder.forEach((id, idx) => {
        const islandEl = document.getElementById(id);
        if (islandEl) {
            setTimeout(() => {
                islandEl.classList.add('revealed');
            }, 600 + idx * 320); // 320ms majestic spacing between islands
        }
    });
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
   4. Orientation Leads Directory Rendering and Filtering (LEADS modal)
   ========================================================================== */
const pocData = [
    {
        name: "Vanshika Soni",
        role: "OC LEAD",
        dept: "coordination",
        desc: "Overall Orientation Committee Lead. Reach out for major escalations, schedule coordination, and team management.",
        avatar: "fa-user-gear",
        image: "assets/vanshika_soni.jpg",
        phone: "+919867915727",
        email: "vanshika.soni@newtonschool.co"
    },
    {
        name: "Suraj Patil",
        role: "DOCUMENTATION LEAD",
        dept: "coordination",
        desc: "Leads orientation documentation, schedules, verification slips, and records.",
        avatar: "fa-file-lines",
        phone: "+918010999488",
        email: "suraj.patil@newtonschool.co"
    },
    {
        name: "Prithviraj Ghorpade",
        role: "DOCUMENTATION LEAD",
        dept: "coordination",
        desc: "Co-leads student documentation, registration logs, and official notices.",
        avatar: "fa-clipboard-check",
        phone: "+919368804152",
        email: "prithviraj.g@newtonschool.co"
    },
    {
        name: "Avkash Singh",
        role: "INCAMPUS HOSTEL LEAD",
        dept: "hostel",
        desc: "Incharge of incampus hostel allotments, room desk, and boy's hostel queries.",
        avatar: "fa-building-user",
        phone: "+918604651504",
        email: "avkash.singh@newtonschool.co"
    },
    {
        name: "Sunny Pandey",
        role: "TRIBE HOSTEL LEAD",
        dept: "hostel",
        desc: "Manages Tribe hostel facilities, shuttle integration, and residential support.",
        avatar: "fa-hotel",
        phone: "+916307217313",
        email: "sunny.pandey@newtonschool.co"
    },
    {
        name: "Rishi",
        role: "YS 1 HOSTEL LEAD",
        dept: "hostel",
        desc: "Incharge of YS 1 hostel accommodations, check-ins, and student comfort.",
        avatar: "fa-bed",
        phone: "+918815704939",
        email: "rishi@newtonschool.co"
    },
    {
        name: "Aastha Musale",
        role: "INCAMPUS GIRLS HOSTEL LEAD",
        dept: "hostel",
        desc: "Lead for incampus girls hostel facilities, safety, and residential assistance.",
        avatar: "fa-person-shelter",
        phone: "+917387662975",
        email: "aastha.musale@newtonschool.co"
    },
    {
        name: "Ekta Sachdev",
        role: "COORDINATION LEAD",
        dept: "coordination",
        desc: "Oversees team coordination, event execution, and inter-departmental support.",
        avatar: "fa-people-roof",
        phone: "+917024893381",
        email: "ekta.sachdev@newtonschool.co"
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
            grid.innerHTML = '<p class="no-results">No team leads found matching your search.</p>';
            return;
        }
        
        data.forEach(poc => {
            const card = document.createElement('div');
            card.className = 'poc-card glass-card';
            card.setAttribute('data-dept', poc.dept);
            const avatarContent = poc.image 
                ? `<img src="${poc.image}" alt="${poc.name}" class="poc-img-avatar">` 
                : `<i class="fa-solid ${poc.avatar}"></i>`;
            card.innerHTML = `
                <div class="poc-avatar">
                    ${avatarContent}
                </div>
                <div class="poc-info">
                    <span class="poc-role-badge">${poc.role}</span>
                    <h3 class="poc-name">${poc.name}</h3>
                    <div class="poc-contacts">
                        <a href="tel:${poc.phone}" class="contact-link phone" title="Call ${poc.name}"><i class="fa-solid fa-phone"></i></a>
                        <a href="https://wa.me/${poc.phone.replace('+', '')}?text=Hi%20${encodeURIComponent(poc.name)},%20I%20am%20a%20junior%20joining%20NST..." target="_blank" class="contact-link whatsapp" title="WhatsApp ${poc.name}"><i class="fa-brands fa-whatsapp"></i></a>
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

/* ==========================================================================
   10. Minecraft XP Orbs (Particle FX on Island Hover)
   ========================================================================== */
function initIslandXPOrbs() {
    document.querySelectorAll('.island-wrapper').forEach(island => {
        island.addEventListener('mouseenter', () => {
            for (let i = 0; i < 6; i++) {
                const orb = document.createElement('div');
                orb.className = 'xp-orb';
                const startX = 20 + Math.random() * 180;
                const startY = 30 + Math.random() * 120;
                const dx = (Math.random() - 0.5) * 80 + 'px';
                const dy = -(Math.random() * 70 + 40) + 'px';

                orb.style.left = `${startX}px`;
                orb.style.top = `${startY}px`;
                orb.style.setProperty('--dx', dx);
                orb.style.setProperty('--dy', dy);

                island.appendChild(orb);
                setTimeout(() => orb.remove(), 1100);
            }
        });
    });
}

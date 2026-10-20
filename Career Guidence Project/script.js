/**
 * CareerPath - Career Guidance Website
 * Main JavaScript File
 */

// ==================== Career Data ====================
const careerData = {
    science: [
        {
            name: "Software Engineer",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400", 
            shortDesc: "Build applications and software systems that power the digital world.",
            description: "Software Engineers design, develop, and maintain software applications. They work on everything from mobile apps to enterprise systems.",
            study: "B.Tech/B.E. in Computer Science, BCA, or MCA",
            courses: ["Data Structures & Algorithms", "Programming Languages", "Database Management", "Web Development", "Cloud Computing"],
            skills: ["Problem Solving", "Logical Thinking", "Programming", "Teamwork", "Continuous Learning"],
            scope: "Extremely high demand globally. Opportunities in startups, MNCs, freelancing, and entrepreneurship.",
            whoShouldChoose: "If you love coding, solving puzzles, and building things from scratch, this is for you!"
        },
        {
            name: "Doctor (MBBS)",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
            shortDesc: "Diagnose and treat patients, saving lives every day.",
            description: "Doctors examine patients, diagnose diseases, prescribe treatments, and help people maintain good health.",
            study: "MBBS followed by MD/MS specialization",
            courses: ["Anatomy", "Physiology", "Biochemistry", "Pathology", "Medicine", "Surgery"],
            skills: ["Empathy", "Attention to Detail", "Decision Making", "Communication", "Patience"],
            scope: "Always in demand. Work in hospitals, clinics, or start your own practice.",
            whoShouldChoose: "If you have compassion for helping sick people and can handle pressure, medicine is your calling!"
        },
        {
            name: "Data Scientist",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
            shortDesc: "Extract insights from data to drive business decisions.",
            description: "Data Scientists analyze complex data sets using statistics and machine learning to solve business problems.",
            study: "B.Tech in CS/IT, B.Sc in Statistics/Mathematics, or specialized Data Science degrees",
            courses: ["Statistics", "Machine Learning", "Python/R Programming", "SQL", "Data Visualization"],
            skills: ["Analytical Thinking", "Statistics", "Programming", "Business Acumen", "Communication"],
            scope: "One of the fastest-growing careers. Every industry needs data scientists today.",
            whoShouldChoose: "If you love numbers, patterns, and deriving meaningful insights from chaos, this is perfect!"
        },
        {
            name: "Civil Engineer",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400",
            shortDesc: "Design and build infrastructure that shapes cities.",
            description: "Civil Engineers plan, design, and oversee construction of buildings, roads, bridges, and other infrastructure.",
            study: "B.Tech/B.E. in Civil Engineering",
            courses: ["Structural Engineering", "Geotechnical Engineering", "Transportation", "Environmental Engineering"],
            skills: ["Technical Drawing", "Project Management", "Mathematics", "Problem Solving", "Leadership"],
            scope: "Growing demand with urbanization. Government jobs, private firms, and consulting opportunities.",
            whoShouldChoose: "If you want to build things that last for generations and love seeing physical results of your work!"
        },
        {
            name: "Pharmacist",
            image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
            shortDesc: "Bridge between medicine and patients with pharmaceutical expertise.",
            description: "Pharmacists dispense medications, advise on drug use, and ensure safe medication practices.",
            study: "B.Pharm or Pharm.D (Doctor of Pharmacy)",
            courses: ["Pharmacology", "Medicinal Chemistry", "Pharmaceutical Analysis", "Hospital Pharmacy"],
            skills: ["Attention to Detail", "Chemistry Knowledge", "Communication", "Ethics", "Memory"],
            scope: "Work in hospitals, retail pharmacies, pharmaceutical companies, or research labs.",
            whoShouldChoose: "If you love chemistry and want to help people without the intensity of direct medical practice!"
        },
        {
            name: "Aerospace Engineer",
            image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400",
            shortDesc: "Design aircraft and spacecraft that defy gravity.",
            description: "Aerospace Engineers design, develop, and test aircraft, spacecraft, satellites, and missiles.",
            study: "B.Tech/B.E. in Aerospace Engineering",
            courses: ["Aerodynamics", "Propulsion", "Flight Mechanics", "Structures", "Avionics"],
            skills: ["Advanced Mathematics", "Physics", "CAD Software", "Innovation", "Research Skills"],
            scope: "Work with ISRO, NASA, defense organizations, or private space companies like SpaceX.",
            whoShouldChoose: "If you dream of reaching the stars and love the physics of flight!"
        }
    ],
    commerce: [
        {
            name: "Chartered Accountant (CA)",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
            shortDesc: "Master of finance, audit, and taxation.",
            description: "CAs handle financial records, audits, tax planning, and business advisory services.",
            study: "CA Foundation, Intermediate, and Final from ICAI",
            courses: ["Accounting", "Auditing", "Taxation", "Corporate Law", "Financial Management"],
            skills: ["Numerical Ability", "Analytical Skills", "Integrity", "Time Management", "Communication"],
            scope: "High earning potential. Work in Big 4 firms, corporations, or start your own practice.",
            whoShouldChoose: "If you love numbers and want a prestigious career in finance!"
        },
        {
            name: "Investment Banker",
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
            shortDesc: "Handle big money deals and corporate finance.",
            description: "Investment Bankers help companies raise capital, manage mergers & acquisitions, and provide financial advisory.",
            study: "B.Com/BBA followed by MBA in Finance",
            courses: ["Corporate Finance", "Valuation", "Financial Modeling", "M&A", "Securities"],
            skills: ["Financial Analysis", "Negotiation", "Presentation", "Networking", "Work Under Pressure"],
            scope: "Very high salaries but demanding work. Jobs in investment banks, PE firms.",
            whoShouldChoose: "If you thrive under pressure and dream of handling million-dollar deals!"
        },
        {
            name: "Marketing Manager",
            image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400",
            shortDesc: "Create strategies that make brands unforgettable.",
            description: "Marketing Managers develop and implement marketing strategies to promote products and services.",
            study: "BBA/B.Com followed by MBA in Marketing",
            courses: ["Consumer Behavior", "Digital Marketing", "Brand Management", "Market Research", "Advertising"],
            skills: ["Creativity", "Communication", "Analytics", "Strategic Thinking", "Leadership"],
            scope: "Every company needs marketing. Opportunities in FMCG, tech, startups, and agencies.",
            whoShouldChoose: "If you love understanding people and creating compelling brand stories!"
        },
        {
            name: "Company Secretary (CS)",
            image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400",
            shortDesc: "Ensure corporate compliance and governance.",
            description: "Company Secretaries handle legal and regulatory compliance, corporate governance, and board matters.",
            study: "CS Foundation, Executive, and Professional from ICSI",
            courses: ["Company Law", "Securities Law", "Corporate Governance", "Compliance", "Secretarial Practice"],
            skills: ["Legal Knowledge", "Attention to Detail", "Communication", "Integrity", "Organization"],
            scope: "Mandatory position in large companies. Good demand in corporate sector.",
            whoShouldChoose: "If you like law, compliance, and working at the board level of corporations!"
        },
        {
            name: "Entrepreneur",
            image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400",
            shortDesc: "Build your own business empire.",
            description: "Entrepreneurs identify opportunities, take risks, and build businesses from the ground up.",
            study: "BBA/B.Com/Any degree + practical experience",
            courses: ["Business Planning", "Finance", "Marketing", "Operations", "Leadership"],
            skills: ["Risk Taking", "Vision", "Resilience", "Networking", "Decision Making"],
            scope: "Unlimited potential. Create jobs, solve problems, and be your own boss.",
            whoShouldChoose: "If you hate working for others and have ideas that can change the world!"
        },
        {
            name: "Human Resource Manager",
            image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400",
            shortDesc: "Manage the most valuable asset - people.",
            description: "HR Managers handle recruitment, employee relations, training, and organizational development.",
            study: "BBA/B.Com followed by MBA in HR",
            courses: ["Organizational Behavior", "Recruitment", "Compensation", "Labor Laws", "Training & Development"],
            skills: ["People Skills", "Empathy", "Conflict Resolution", "Communication", "Strategic Thinking"],
            scope: "Every organization needs HR. Growing focus on employee experience.",
            whoShouldChoose: "If you love working with people and building great workplace cultures!"
        }
    ],
    arts: [
        {
            name: "Journalist",
            image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400",
            shortDesc: "Uncover truth and inform the world.",
            description: "Journalists research, investigate, and report news stories across various media platforms.",
            study: "BA in Journalism/Mass Communication",
            courses: ["News Writing", "Broadcast Journalism", "Digital Media", "Ethics", "Investigative Journalism"],
            skills: ["Writing", "Research", "Interviewing", "Critical Thinking", "Storytelling"],
            scope: "Work in newspapers, TV, digital media, or as independent journalists.",
            whoShouldChoose: "If you are curious about the world and want to make truth accessible to everyone!"
        },
        {
            name: "Psychologist",
            image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400",
            shortDesc: "Understand minds and heal hearts.",
            description: "Psychologists study human behavior and mental processes, providing therapy and counseling.",
            study: "BA/B.Sc in Psychology followed by MA/M.Sc and RCI registration",
            courses: ["Clinical Psychology", "Counseling", "Cognitive Psychology", "Research Methods", "Psychotherapy"],
            skills: ["Empathy", "Active Listening", "Patience", "Analytical Thinking", "Confidentiality"],
            scope: "Growing mental health awareness. Work in hospitals, schools, clinics, or private practice.",
            whoShouldChoose: "If you want to understand the human mind and help people overcome their struggles!"
        },
        {
            name: "Graphic Designer",
            image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
            shortDesc: "Create visual stories that captivate.",
            description: "Graphic Designers create visual content for branding, advertising, websites, and print media.",
            study: "B.Des/BFA in Graphic Design or Diploma courses",
            courses: ["Typography", "Color Theory", "Adobe Suite", "UI/UX Design", "Branding"],
            skills: ["Creativity", "Visual Communication", "Software Skills", "Attention to Detail", "Time Management"],
            scope: "High demand in digital age. Freelance, agencies, or in-house design teams.",
            whoShouldChoose: "If you think in colors and shapes, and love making things look beautiful!"
        },
        {
            name: "Lawyer",
            image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400",
            shortDesc: "Defend rights and uphold justice.",
            description: "Lawyers represent clients in legal matters, provide legal advice, and argue cases in court.",
            study: "5-year integrated LLB or 3-year LLB after graduation",
            courses: ["Constitutional Law", "Criminal Law", "Civil Law", "Corporate Law", "Legal Writing"],
            skills: ["Argumentation", "Research", "Critical Thinking", "Public Speaking", "Ethics"],
            scope: "Work in courts, law firms, corporate legal teams, or government.",
            whoShouldChoose: "If you love debates, have strong convictions, and want to fight for justice!"
        },
        {
            name: "Civil Services (IAS/IPS)",
            image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400",
            shortDesc: "Serve the nation and shape policies.",
            description: "Civil servants work in government administration, policy making, and public service delivery.",
            study: "Any graduation + UPSC examination",
            courses: ["Indian Polity", "History", "Geography", "Economics", "Current Affairs", "Ethics"],
            skills: ["Leadership", "Decision Making", "Integrity", "Communication", "Management"],
            scope: "Prestigious career serving 1.4 billion people. Power to create real change.",
            whoShouldChoose: "If you dream of serving the nation and have the dedication to clear tough exams!"
        },
        {
            name: "Content Writer",
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
            shortDesc: "Craft words that inform and inspire.",
            description: "Content Writers create written content for websites, blogs, social media, and marketing materials.",
            study: "BA in English/Journalism/Mass Communication",
            courses: ["Creative Writing", "SEO Writing", "Copywriting", "Content Strategy", "Editing"],
            skills: ["Writing", "Research", "SEO Knowledge", "Creativity", "Deadline Management"],
            scope: "Huge demand in digital marketing. Work for companies, agencies, or as freelancer.",
            whoShouldChoose: "If words flow naturally from your mind and you love expressing ideas through writing!"
        }
    ]
};

// ==================== Career Suggestion Logic ====================
const careerSuggestions = {
    "Science-Coding": {
        career: "Software Engineer / Data Scientist",
        description: "Your combination of Science background and love for coding makes you perfect for tech careers. You can build software, analyze data, or create AI solutions."
    },
    "Science-Helping People": {
        career: "Doctor / Pharmacist / Healthcare Professional",
        description: "With Science and a passion for helping others, medical careers are ideal. You can directly impact lives through healthcare."
    },
    "Science-Research": {
        career: "Research Scientist / Aerospace Engineer",
        description: "Your analytical mind and curiosity make you perfect for research and engineering careers where you can discover new things."
    },
    "Science-Business": {
        career: "Biotech Entrepreneur / Tech Startup Founder",
        description: "Combine your science knowledge with business acumen to create innovative companies in healthcare or technology."
    },
    "Commerce-Business": {
        career: "Entrepreneur / Investment Banker",
        description: "Your commerce background and business interest align perfectly with entrepreneurship or high-finance careers."
    },
    "Commerce-Coding": {
        career: "Fintech Professional / Business Analyst",
        description: "Blend commerce with technology to work in the rapidly growing fintech sector or as a business analyst."
    },
    "Commerce-Helping People": {
        career: "Human Resource Manager / Financial Advisor",
        description: "Help people grow in organizations or manage their finances. Perfect blend of commerce and people skills."
    },
    "Commerce-Communication": {
        career: "Marketing Manager / Public Relations",
        description: "Your communication skills combined with business knowledge make marketing and PR ideal choices."
    },
    "Arts-Creative Arts": {
        career: "Graphic Designer / UX Designer",
        description: "Channel your creativity into design careers where you can create visual experiences that impact millions."
    },
    "Arts-Communication": {
        career: "Journalist / Content Writer",
        description: "Your communication skills and creative thinking make you perfect for media and content creation roles."
    },
    "Arts-Helping People": {
        career: "Psychologist / Social Worker / Teacher",
        description: "Help people overcome challenges and grow. Your empathy and arts background are perfect for these roles."
    },
    "Arts-Research": {
        career: "Civil Services (IAS/IPS) / Policy Researcher",
        description: "Your research interest can lead to policy-making roles where you analyze and solve national problems."
    }
};

// ==================== DOM Elements ====================
const streamButtons = document.querySelectorAll('.stream-btn');
const careerGrid = document.getElementById('career-grid');
const modal = document.getElementById('career-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');
const careerForm = document.getElementById('career-form');
const careerResult = document.getElementById('career-result');
const resultContent = document.getElementById('result-content');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    // Load default stream (Science)
    displayCareers('science');
    
    // Setup event listeners
    setupStreamButtons();
    setupModal();
    setupForm();
    setupMobileMenu();
    setupSmoothScroll();
});

// ==================== Stream Selection ====================
function setupStreamButtons() {
    streamButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            streamButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Display careers for selected stream
            const stream = btn.dataset.stream;
            displayCareers(stream);
        });
    });
}

function displayCareers(stream) {
    const careers = careerData[stream];
    careerGrid.innerHTML = '';
    
    careers.forEach((career, index) => {
        const card = document.createElement('div');
        card.className = 'career-card fade-in';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="career-card-image" style="background-image: url('${career.image}')"></div>
            <div class="career-card-body">
                <h3>${career.name}</h3>
                <p>${career.shortDesc}</p>
                <div class="career-card-footer">
                    <span class="career-tag">${stream.charAt(0).toUpperCase() + stream.slice(1)}</span>
                    <span class="view-more">View Details →</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openCareerModal(career));
        careerGrid.appendChild(card);
    });
}

// ==================== Modal ====================
function setupModal() {
    closeModal.addEventListener('click', closeCareerModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCareerModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCareerModal();
        }
    });
}

function openCareerModal(career) {
    modalBody.innerHTML = `
        <div class="modal-header">
            <h2>${career.name}</h2>
            <p>${career.shortDesc}</p>
        </div>
        <div class="modal-body-content">
            <div class="modal-section">
                <h4><i class="fas fa-info-circle"></i> About This Career</h4>
                <p>${career.description}</p>
            </div>
            
            <div class="modal-section">
                <h4><i class="fas fa-graduation-cap"></i> What to Study After 12th</h4>
                <p>${career.study}</p>
            </div>
            
            <div class="modal-section">
                <h4><i class="fas fa-book"></i> Key Courses</h4>
                <ul>
                    ${career.courses.map(course => `<li>${course}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h4><i class="fas fa-tools"></i> Required Skills</h4>
                <ul>
                    ${career.skills.map(skill => `<li>${skill}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h4><i class="fas fa-chart-line"></i> Future Scope</h4>
                <p>${career.scope}</p>
            </div>
            
            <div class="modal-section">
                <h4><i class="fas fa-user-check"></i> Who Should Choose This?</h4>
                <p>${career.whoShouldChoose}</p>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCareerModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== Career Form ====================
function setupForm() {
    careerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(careerForm);
        const name = formData.get('name');
        const email = formData.get('email') || '';
        const stream = formData.get('stream');
        
        // Get selected interests
        const interests = [];
        document.querySelectorAll('input[name="interest"]:checked').forEach(cb => {
            interests.push(cb.value);
        });
        
        if (!stream || interests.length === 0) {
            alert('Please select a stream and at least one interest!');
            return;
        }
        
        // Find best career match
        const primaryInterest = interests[0];
        const key = `${stream}-${primaryInterest}`;
        const suggestion = careerSuggestions[key] || {
            career: "Explore More Options",
            description: "Based on your interests, we recommend exploring multiple career paths. Visit our career sections above for detailed information!"
        };
        
        // Display result
        resultContent.innerHTML = `
            <h4>${suggestion.career}</h4>
            <p>${suggestion.description}</p>
            <p style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                Based on: ${stream} + ${interests.join(', ')}
            </p>
        `;
        careerResult.classList.remove('hidden');
        
        // Scroll to result
        careerResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Save to database
        try {
            const response = await fetch('save_data.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    stream: stream,
                    interest: interests.join(', '),
                    suggested_career: suggestion.career
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('Data saved successfully!', data);
            } else {
                console.error('Error saving data:', data.message);
            }
        } catch (error) {
            console.error('Network error:', error);
            // Don't show error to user - form still works offline
        }
    });
}

// ==================== Mobile Menu ====================
function setupMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ==================== Smooth Scroll ====================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== Navbar Scroll Effect ====================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = 'var(--shadow)';
    }
    
    lastScroll = currentScroll;
});

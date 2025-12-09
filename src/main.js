import './style.css';
import Lenis from 'lenis';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 1.5 Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // 2. Mobile Menu Logic
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.menu-card, .feature-card, .gallery-item, .review-card, .section-header');

    // Add initial class
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is consistently visible
    });

    revealElements.forEach(el => observer.observe(el));

    // 4. Parallax Effect for Hero & Floating Elements
    const hero = document.querySelector('.hero');
    const floaters = document.querySelectorAll('.floating-element');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (scrolled < window.innerHeight) {
            // Hero Background
            const rate = scrolled * 0.5;
            hero.style.backgroundPositionY = `${rate}px`;

            // Floating Elements Parallax
            floaters.forEach((floater, index) => {
                const speed = (index + 1) * 0.15;
                const yPos = scrolled * speed;
                floater.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
            });
        }
    });

    // 5. Navbar Glass Effect refinement
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(15, 15, 15, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        } else {
            header.style.backgroundColor = 'rgba(15, 15, 15, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // 6. Scrollytelling Dynamic Theme
    // Define colors for each theme
    const themes = {
        default: '#0f0f0f',
        espresso: '#1a100a',
        cappuccino: '#2a1f1a',
        coldbrew: '#10151a',
        caramel: '#2a1a0f',
        mocha: '#1f1515',
        matcha: '#0f1a12'
    };

    const menuCards = document.querySelectorAll('.menu-card');
    const body = document.body;

    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const theme = entry.target.dataset.theme;
                if (theme && themes[theme]) {
                    // Smoothly change background color
                    body.style.transition = 'background-color 1s ease';
                    body.style.backgroundColor = themes[theme];
                }
            }
        });
    }, {
        threshold: 0.6, // Trigger when card is mostly visible
        margin: "0px"
    });

    menuCards.forEach(card => themeObserver.observe(card));

    // Reset to default when leaving menu section
    const menuSection = document.querySelector('#menu');
    const resetObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                body.style.backgroundColor = themes.default;
            }
        });
    }, { threshold: 0.1 });

    if (menuSection) resetObserver.observe(menuSection);

    // 7. Gamified Rewards Animation
    const rewardsSection = document.querySelector('.rewards-section');
    const liquid = document.querySelector('.liquid');
    const pointsValue = document.querySelector('.points-value');

    if (rewardsSection && liquid && pointsValue) {
        const rewardsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate Liquid
                    setTimeout(() => {
                        liquid.style.height = '85%';
                    }, 500);

                    // Animate Numbers
                    let start = 0;
                    const end = 85;
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateNumber(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out

                        const current = Math.floor(start + (end - start) * ease);
                        pointsValue.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateNumber);
                        }
                    }
                    requestAnimationFrame(updateNumber);

                    // Disconnect after animation starts to prevent re-triggering
                    rewardsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        rewardsObserver.observe(rewardsSection);
    }
});

console.log('JavaScript file loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    const startButton = document.getElementById('start-button');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');

    console.log('Start button:', startButton);
    console.log('Intro screen:', introScreen);
    console.log('Main content:', mainContent);

    if (startButton) {
        startButton.addEventListener('click', function() {
            console.log('Start button clicked');

            if (introScreen) {
                // Add fade-out class for smooth transition
                introScreen.classList.add('fade-out');
                console.log('Fade-out class added to intro screen');

                // Listen for the end of the transition
                introScreen.addEventListener('transitionend', function() {
                    introScreen.style.display = 'none';
                    console.log('Intro screen hidden');

                    if (mainContent) {
                        mainContent.classList.remove('hidden');
                        console.log('Main content revealed');
                        initHeaderAnimation();
                    } else {
                        console.error('Main content not found');
                    }
                }, { once: true });
            } else {
                console.error('Intro screen not found');
            }
        });
    } else {
        console.error('Start button not found');
    }

    // Initialize header animation if no intro screen is present
    if (!document.getElementById('intro-screen')) {
        initHeaderAnimation();
    }

    const sections = ['#mission', '#about'];
    
    function animateSection(sectionId) {
        const elements = document.querySelectorAll(`${sectionId} p`);
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }

    // Trigger animation when sections come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSection(`#${entry.target.id}`);
                observer.unobserve(entry.target);
            }
        });
    });

    sections.forEach(section => {
        const element = document.querySelector(section);
        if (element) observer.observe(element);
    });

    const platformItems = document.querySelectorAll('.platform-item');
    
    const platformObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    platformItems.forEach(item => {
        platformObserver.observe(item);
    });
});

/**
 * Initializes the animated triangles in the header.
 */
function initHeaderAnimation() {
    console.log('Initializing header animation');

    const canvas = document.getElementById('headerCanvas');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fit the header
    function resizeCanvas() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Define Triangle class
    class Triangle {
        constructor(x, y, size, speed, direction) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
            this.direction = direction; // angle in radians
            this.vx = Math.cos(this.direction) * this.speed;
            this.vy = Math.sin(this.direction) * this.speed;
            this.color = `rgba(${this.randomInt(0,255)}, ${this.randomInt(0,255)}, ${this.randomInt(0,255)}, 0.7)`;
        }

        randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off the edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x + this.size / 2, this.y - this.size);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create multiple triangles
    const triangles = [];
    const numTriangles = 50;

    for (let i = 0; i < numTriangles; i++) {
        const size = (Math.random() * 20 + 10) * 0.5; // Reduced size by 50%
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speed = Math.random() * 1.5 + 0.5;
        const direction = Math.random() * Math.PI * 2;
        triangles.push(new Triangle(x, y, size, speed, direction));
    }

    // Optimized animation loop with frame rate limiter
    let lastFrameTime = 0;
    const fps = 60; // Desired frames per second
    const interval = 1000 / fps;

    function animate(currentTime) {
        requestAnimationFrame(animate);
        const deltaTime = currentTime - lastFrameTime;

        if (deltaTime > interval) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            triangles.forEach(triangle => {
                triangle.update();
                triangle.draw(ctx);
            });

            lastFrameTime = currentTime - (deltaTime % interval);
        }
    }

    requestAnimationFrame(animate);
}
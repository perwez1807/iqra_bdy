document.addEventListener('DOMContentLoaded', () => {
    // --- Utility Functions ---

    const resetCakeStageImages = () => {
        const imageIds = ['table-img', 'light-img', 'blow-img', 'cut-cake-img'];
        imageIds.forEach(id => {
            document.getElementById(id).classList.remove('visible');
        });
    };

    const updateButtonVisibility = (nextBtnContainerId, currentBtnContainerId) => {
        const nextBtnContainer = document.getElementById(nextBtnContainerId);
        const currentBtnContainer = currentBtnContainerId ? document.getElementById(currentBtnContainerId) : null;

        if (currentBtnContainer) {
            currentBtnContainer.classList.remove('visible');
        }

        if (nextBtnContainer) {
            setTimeout(() => {
                nextBtnContainer.classList.add('visible');
            }, 500);
        }
    };

    const placeFixedBalloons = () => {
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        const colors = ['blue', 'red', 'yellow'];
        const container = document.getElementById('balloons-container');
        
        container.innerHTML = ''; 

        for (let i = 0; i < 4; i++) {
            const balloon = document.createElement('img');
            const color = colors[i % colors.length];
            const positionClass = `balloon-${positions[i]}`;
            
            balloon.src = `balloon_${color}.png`;
            balloon.alt = `${color} balloon`;
            
            balloon.classList.add('balloon', positionClass, 'visible', 'large-balloon', 'balloon-entry'); 
            
            setTimeout(() => {
                balloon.classList.remove('balloon-entry');
            }, 600);
            
            container.appendChild(balloon);
        }
    };

    // --- Confetti & Floating Balloon Logic (Canvas API & Dynamic Creation) ---
    const confettiCanvas = document.getElementById("confettiCanvas");
    const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
    const floatingBalloons = document.getElementById("floatingBalloons");

    let confettiParticles = [];
    let animationFrameId;

    if (confettiCanvas) {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        });
    }

    function launchConfetti() {
        confettiParticles = [];
        if (!confettiCtx) return;

        for (let i = 0; i < 200; i++) { 
            confettiParticles.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height - confettiCanvas.height, 
                w: Math.random() * 10 + 4,
                h: Math.random() * 20 + 8,
                color: `hsl(${Math.random() * 360}, 100%, 60%)`, 
                dy: Math.random() * 3 + 2, 
                dx: (Math.random() - 0.5) * 2, 
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
            });
        }
        animateConfetti();
    }

    function animateConfetti() {
        if (!confettiCtx) return;

        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles.forEach((p) => {
            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate((p.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(0, 0, p.w, p.h);
            confettiCtx.restore();

            p.y += p.dy;
            p.x += p.dx;
            p.rotation += p.rotationSpeed * 0.1; 

            if (p.y > confettiCanvas.height) p.y = -p.h; 
            if (p.x > confettiCanvas.width) p.x = 0;
            if (p.x < 0) p.x = confettiCanvas.width;
        });

        animationFrameId = requestAnimationFrame(animateConfetti); 
    }

    function setupFloatingBalloons() {
        if (!floatingBalloons) return;
        floatingBalloons.innerHTML = '';
        const balloonImageColors = ['blue', 'red', 'yellow', 'pink', 'green'];
        
        for (let i = 0; i < 15; i++) { 
            const balloon = document.createElement('img');
            const color = balloonImageColors[i % balloonImageColors.length];
            
            balloon.src = `balloon_${color}.png`; 
            balloon.alt = `${color} balloon`;
            
            balloon.classList.add('multiple-balloon', 'large-balloon'); 
            balloon.style.left = `${Math.random() * 100}%`;
            balloon.style.animationDelay = `${Math.random() * 7}s`; 
            
            floatingBalloons.appendChild(balloon);
        }
    }


    // --- Story Flow Control ---
    const surpriseVideo = document.getElementById('surprise-video');
    const videoScreen = document.getElementById('video-screen');
    const mainContentScreen = document.getElementById('main-content-screen');

    const greetingScreen = document.getElementById('greeting-screen');
    const greetingText = document.getElementById('greeting-text');
    
    greetingText.style.opacity = 1; 

    setTimeout(() => {
        greetingScreen.style.opacity = 0;
        
        setTimeout(() => {
            greetingScreen.classList.remove('active');
            mainContentScreen.classList.add('active');
            
            document.getElementById('envelope-img').classList.add('visible');
            document.getElementById('stage-2-buttons').classList.add('visible');
        }, 500); 
    }, 1500); 

    document.getElementById('open-envelope-btn').addEventListener('click', () => {
        document.getElementById('envelope-img').classList.remove('visible');
        
        const cardImg = document.getElementById('card-img');
        cardImg.classList.remove('slide-up'); 
        cardImg.offsetHeight; 
        cardImg.classList.add('slide-up'); 
        cardImg.classList.add('visible');

        updateButtonVisibility('stage-3-buttons', 'stage-2-buttons');
    });

    document.getElementById('celebrate-btn').addEventListener('click', () => {
        document.getElementById('card-img').classList.remove('visible', 'slide-up');
        
        updateButtonVisibility('stage-4-buttons', 'stage-3-buttons');
    });

    document.getElementById('lights-up-btn').addEventListener('click', () => {
        mainContentScreen.classList.remove('black-bg');
        mainContentScreen.classList.add('white-bg');
        
        document.getElementById('disco-light-effect').classList.remove('active'); 

        const bulbEffectContainer = document.getElementById('bulb-effect');
        bulbEffectContainer.classList.add('active');
        bulbEffectContainer.innerHTML = ''; 

        const bulbColors = ['blue', 'green', 'orange', 'pink', 'red', 'yellow']; 
        bulbColors.forEach((color, index) => {
            const bulb = document.createElement('img');
            bulb.src = `bulb_${color}.png`; 
            bulb.alt = `${color} bulb`;
            bulb.classList.add('color-bulb', 'bulb', color); 
            bulb.style.animationDelay = `${index * 0.2}s`; 
            bulbEffectContainer.appendChild(bulb);
        });

        updateButtonVisibility('stage-5-buttons', 'stage-4-buttons');
    });

    document.getElementById('decorate-btn').addEventListener('click', () => {
        document.getElementById('banner-img').classList.add('visible'); 
        placeFixedBalloons();

        // Show and start ribbon animations
        document.querySelectorAll('.static-ribbon').forEach((ribbon, index) => {
            // 1. Reset animation properties
            ribbon.style.animation = 'none'; 
            ribbon.offsetHeight;
            
            // 2. Calculate and SET the CSS variable for delayed entry
            const delay = (index % 2) * 0.15 + Math.floor(index / 2) * 0.15;
            ribbon.style.setProperty('--initial-delay', `${0.3 + delay}s`);

            // 3. Apply classes to start entry and falling
            ribbon.classList.add('visible', 'falling-ribbon', 'ribbon-entry');
        });

        updateButtonVisibility('stage-6-buttons', 'stage-5-buttons');
    });

    document.getElementById('open-cake-btn').addEventListener('click', () => {
        resetCakeStageImages(); 
        document.getElementById('table-img').classList.add('visible');
        
        updateButtonVisibility('stage-7-buttons', 'stage-6-buttons');
    });

    document.getElementById('light-candle-btn').addEventListener('click', () => {
        resetCakeStageImages(); 
        document.getElementById('light-img').classList.add('visible'); 
        
        updateButtonVisibility('stage-8-buttons', 'stage-7-buttons');
    });

    document.getElementById('blow-candle-btn').addEventListener('click', () => {
        resetCakeStageImages(); 
        document.getElementById('blow-img').classList.add('visible'); 
        
        updateButtonVisibility('stage-9-buttons', 'stage-8-buttons');
    });

    document.getElementById('cut-cake-btn').addEventListener('click', () => {
        resetCakeStageImages(); 
        document.getElementById('cut-cake-img').classList.add('visible'); 
        
        document.getElementById('birthday-music').play();
        
        // START CONTINUOUS CELEBRATION EFFECTS
        setupFloatingBalloons();
        floatingBalloons.classList.remove("hidden");
        launchConfetti();

        updateButtonVisibility('stage-10-buttons', 'stage-9-buttons');
    });
    
    // --- FINAL BUTTON LOGIC: READY FOR SURPRISE VIDEO ---
    document.getElementById('stop-music-btn').addEventListener('click', () => {
        
        // 1. Stop background music and clear all animations
        document.getElementById('birthday-music').pause();
        document.getElementById('birthday-music').currentTime = 0; 
        
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            confettiParticles = [];
            if (confettiCtx) confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        floatingBalloons.innerHTML = ''; 

        // 2. Hide the main content screen
        mainContentScreen.classList.remove('active');
        
        // 3. Show the video screen
        videoScreen.classList.add('active');
        
        // 4. Start the video fullscreen
        if (surpriseVideo) {
            surpriseVideo.play().catch(error => {
                // Handle autoplay restriction if needed (e.g., show a play button)
                console.log("Autoplay prevented:", error);
            });
            // Optional: Request fullscreen on the video element for maximum immersion
            if (surpriseVideo.requestFullscreen) {
                surpriseVideo.requestFullscreen();
            }
        }
    });
});
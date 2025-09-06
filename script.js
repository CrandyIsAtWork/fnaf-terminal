document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://8b503b84-132c-4149-bdb3-8bef57ec4fd8-00-2ga0ewjtdd2yk.worf.replit.dev');

    socket.on('connect', () => {
        console.log('Connected to server! Requesting a new game room...');
        socket.emit('create-game');
    });

    // --- Element Selectors ---
    const powerButton = document.getElementById('power-button');
    const loadingContainer = document.getElementById('loading-container');
    const bootSequence = document.getElementById('boot-sequence');
    const taskTerminal = document.querySelector('.task-terminal');
    const taskButtons = document.querySelectorAll('.task-button');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const adPopup = document.getElementById('ad-popup-overlay');
    const adImage = document.getElementById('ad-image');
    const adCloseButton = document.getElementById('ad-close-button');
    const roomCodeContainer = document.getElementById('room-code-container');
    const roomCodeText = document.getElementById('room-code-text');
    const roomCodeToggle = document.getElementById('room-code-toggle');
    const messageDisplay = document.getElementById('message-display');
    let messageTimeout;

    // --- State Management Variables ---
    let hasBooted = false;
    let isPowerOn = false;
    let currentTaskState = {};
    let progressTimeoutId;
    const adImageUrls = ['Images/AD2.jpg', 'Images/AD1.jpg'];

    // --- Sound Setup ---
    const sounds = {
        bootup: new Audio('sounds/bootup2.wav'),
        computerLoop: new Audio('sounds/computer2.wav'),
        powerDown: new Audio('sounds/powerdowncomp.mp3'),
        click: new Audio('sounds/click.wav'),
        ad: new Audio('sounds/ad.mp3'),
        printing: new Audio('sounds/printing.mp3'),
        order: new Audio('sounds/orderitem3.mp3'),
        calibrate: new Audio('sounds/calibrating.mp3'),
        laugh: new Audio('sounds/fnaf-freddys-laugh.mp3'),
        beatbox: new Audio('sounds/freddy-beatbox-pas-en-entier-snif.mp3'),
        glitch: new Audio('sounds/golden-freddy-glitch-sound.mp3'),
        scream: new Audio('sounds/shadow-man-scream.mp3')
    };
    sounds.computerLoop.loop = true;
    sounds.ad.loop = true;

    // --- Listen for server events ---
    socket.on('game-created', (data) => {
        console.log(`Game created with code: ${data.roomCode}`);
        roomCodeText.textContent = `CODE: ${data.roomCode}`;
    });

    socket.on('player-joined', (data) => {
        console.log(`An animatronic has joined! Total animatronics: ${data.playerCount}`);
    });

    socket.on('trigger-event', (data) => {
        console.log('Received event from animatronic:', data.type);
        if (data.type === 'ad') {
            triggerAdPopup();
        }
    });

    socket.on('receive-message', (data) => {
        if (!isPowerOn) return;
        if (messageTimeout) clearTimeout(messageTimeout);
        const message = data.message;
        messageDisplay.textContent = '';
        messageDisplay.classList.remove('hidden');
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < message.length) {
                messageDisplay.textContent += message.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                messageTimeout = setTimeout(() => {
                    messageDisplay.classList.add('hidden');
                }, 5000);
            }
        }, 100);
    });
    
    socket.on('trigger-sound', (data) => {
        const soundName = data.soundName;
        if (isPowerOn && sounds[soundName]) {
            console.log(`Playing sound: ${soundName}`);
            sounds[soundName].play();
        }
    });

    // --- UI Logic and other functions ---
    roomCodeToggle.addEventListener('click', () => {
        roomCodeContainer.classList.toggle('collapsed');
    });

    function triggerAdPopup() {
        if (isPowerOn) {
            if (currentTaskState.progress > 0 && currentTaskState.progress < 100) {
                currentTaskState.isPaused = true;
                stopTaskSound(currentTaskState.taskName);
            }
            const randomAdUrl = adImageUrls[Math.floor(Math.random() * adImageUrls.length)];
            adImage.src = randomAdUrl;
            adPopup.style.display = 'flex';
            sounds.ad.currentTime = 0;
            sounds.ad.play();

            // --- NEW: 5-SECOND DELAY LOGIC ---
            adCloseButton.disabled = true;
            let countdown = 5;
            adCloseButton.textContent = countdown;

            const countdownInterval = setInterval(() => {
                countdown--;
                adCloseButton.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    adCloseButton.disabled = false;
                    adCloseButton.textContent = 'X';
                }
            }, 1000);
        }
    }

    powerButton.addEventListener('click', () => {
        sounds.click.play();
        if (!hasBooted) {
            startBootSequence();
        } else {
            togglePower();
        }
    });

    adCloseButton.addEventListener('click', () => {
        adPopup.style.display = 'none';
        sounds.ad.pause();
        const activeButton = currentTaskState.button;
        if (activeButton && currentTaskState.progress < 100) {
            activeButton.textContent = '...';
        }
        currentTaskState.isPaused = false;
        updateProgress();
        playTaskSound(currentTaskState.taskName);
    });

    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.parentElement.classList.contains('completed')) return;
            const parentTaskId = button.parentElement.id;
            let taskName, taskDuration;
            switch (parentTaskId) {
                case 'task-1': taskName = 'order'; taskDuration = Math.floor(Math.random() * 45000) + 30000; break;
                case 'task-2': taskName = 'printing'; taskDuration = Math.floor(Math.random() * 45000) + 30000; break;
                case 'task-4': taskName = 'order'; taskDuration = 150000; break; 
                case 'task-3': taskName = 'calibrate'; taskDuration = Math.floor(Math.random() * 45000) + 30000; break;
            }
            startTask(button, taskDuration, taskName);
        });
    });

    function startBootSequence() {
        hasBooted = true;
        isPowerOn = true;
        powerButton.classList.add('d-none');
        loadingContainer.classList.remove('d-none');
        bootSequence.classList.add('active');
        sounds.bootup.currentTime = 0;
        sounds.bootup.play();
        sounds.bootup.onended = () => {
            if (isPowerOn) {
                sounds.computerLoop.currentTime = 0;
                sounds.computerLoop.play();
            }
        };
        setTimeout(() => {
            loadingContainer.classList.add('d-none');
            taskTerminal.classList.remove('d-none');
            powerButton.classList.remove('d-none');
        }, 15000);
    }

    function togglePower() {
        isPowerOn = !isPowerOn;
        if (isPowerOn) {
            taskTerminal.classList.remove('d-none');
            sounds.computerLoop.currentTime = 0;
            sounds.computerLoop.play();
            const taskWasPaused = currentTaskState.isPaused && currentTaskState.progress > 0 && currentTaskState.progress < 100;
            if (taskWasPaused) {
                const activeButton = currentTaskState.button;
                activeButton.textContent = 'WAIT 5S';
                setTimeout(() => {
                    if (isPowerOn) {
                        activeButton.textContent = '...';
                        currentTaskState.isPaused = false;
                        updateProgress();
                        playTaskSound(currentTaskState.taskName);
                    }
                }, 5000);
            }
        } else {
            clearTimeout(progressTimeoutId);
            taskTerminal.classList.add('d-none');
            adPopup.style.display = 'none';
            sounds.computerLoop.pause();
            sounds.powerDown.currentTime = 0;
            sounds.powerDown.play();
            if (currentTaskState.progress > 0 && currentTaskState.progress < 100) {
                currentTaskState.isPaused = true;
                stopTaskSound(currentTaskState.taskName);
            }
            sounds.ad.pause();
        }
    }

    function startTask(clickedButton, duration, taskName) {
        taskButtons.forEach(btn => btn.disabled = true);
        clickedButton.textContent = '...';
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        currentTaskState = {
            progress: 0,
            increment: 100 / (duration / 50),
            isPaused: false,
            button: clickedButton,
            taskName: taskName
        };
        playTaskSound(taskName);
        updateProgress();
    }

    function updateProgress() {
        if (currentTaskState.isPaused || !isPowerOn) return;
        currentTaskState.progress += currentTaskState.increment * (0.8 + Math.random() * 0.7);
        if (currentTaskState.progress > 100) currentTaskState.progress = 100;
        progressBar.style.width = `${currentTaskState.progress}%`;
        if (currentTaskState.progress < 100) {
            const lagTime = 20 + Math.random() * 250;
            progressTimeoutId = setTimeout(updateProgress, lagTime);
        } else {
            finishTask(currentTaskState.button);
        }
    }

    function finishTask(clickedButton) {
        clearTimeout(progressTimeoutId);
        stopTaskSound(currentTaskState.taskName);
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
            const parentTask = clickedButton.parentElement;
            parentTask.classList.add('completed');
            clickedButton.textContent = 'DONE';
            reenableButtons();
        }, 300);
    }

    function reenableButtons() {
        taskButtons.forEach(btn => {
            if (!btn.parentElement.classList.contains('completed')) {
                btn.disabled = false;
                btn.textContent = 'BEGIN';
            }
        });
    }

    function playTaskSound(taskName) {
        stopTaskSound(currentTaskState.taskName);
        if (!sounds[taskName]) return;
        sounds[taskName].currentTime = 0;
        sounds[taskName].loop = true;
        sounds[taskName].play();
    }

    function stopTaskSound(taskName) {
        if (!sounds[taskName]) return;
        sounds[taskName].pause();
    }
});

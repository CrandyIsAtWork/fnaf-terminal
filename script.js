document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://8b503b84-132c-4149-bdb3-8bef57ec4fd8-00-2ga0ewjtdd2yk.worf.replit.dev');

    // --- Element Selectors ---
    const sabotageOverlay = document.getElementById('sabotage-overlay');
    const sabotageOkBtn = document.getElementById('sabotage-ok-btn');
    const errorTemplate = document.getElementById('error-template');
    const monitorScreen = document.querySelector('.monitor-screen');
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
    const messageLog = document.getElementById('message-log');

    // --- State Management Variables ---
    let openGlitches = 0;
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
    socket.on('connect', () => { socket.emit('create-game'); });
    socket.on('game-created', (data) => { roomCodeText.textContent = `CODE: ${data.roomCode}`; });
    socket.on('player-joined', (data) => { console.log(`Animatronic joined. Total: ${data.playerCount}`); });
    socket.on('trigger-event', (data) => { if (data.type === 'ad') { triggerAdPopup(); } });

    socket.on('sabotage-successful', () => {
        if (isPowerOn && currentTaskState.startTime && !currentTaskState.isPaused) {
            console.log('Task sabotaged! Resetting...');
            resetCurrentTask();
            sabotageOverlay.classList.remove('hidden');
            sabotageOverlay.classList.add('visible');
        }
    });

    socket.on('glitch-successful', () => {
        if (!isPowerOn || openGlitches > 0) return;
        if (currentTaskState.startTime && !currentTaskState.isPaused) { pauseTask(); }
        const numErrors = Math.floor(Math.random() * 3) + 4;
        for (let i = 0; i < numErrors; i++) {
            openGlitches++;
            const newError = errorTemplate.cloneNode(true);
            newError.removeAttribute('id');
            newError.classList.remove('hidden');
            const top = Math.random() * (monitorScreen.clientHeight - 150);
            const left = Math.random() * (monitorScreen.clientWidth - 270);
            newError.style.top = `${top}px`;
            newError.style.left = `${left}px`;
            const errorCode = `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
            newError.querySelector('.error-code').textContent = `ERROR: ${errorCode}`;
            newError.querySelector('.error-ok-btn').addEventListener('click', () => {
                newError.remove();
                openGlitches--;
                if (openGlitches === 0 && currentTaskState.isPaused) { resumeTask(); }
            });
            monitorScreen.appendChild(newError);
        }
    });

    socket.on('receive-message', (data) => {
        if (!isPowerOn) return;
        const { message, sender } = data;
        messageLog.classList.remove('hidden');
        const messageItem = document.createElement('li');
        const avatarImg = document.createElement('img');
        const textContainer = document.createElement('div');
        const senderName = document.createElement('strong');
        avatarImg.classList.add('message-avatar');
        avatarImg.src = `https://crandyisatwork.github.io/fnaf-terminal/${sender.avatar}`;
        senderName.textContent = `${sender.name}: `;
        senderName.style.color = sender.color;
        textContainer.appendChild(senderName);
        textContainer.appendChild(document.createTextNode(message));
        messageItem.appendChild(avatarImg);
        messageItem.appendChild(textContainer);
        messageLog.appendChild(messageItem);
        messageLog.scrollTop = messageLog.scrollHeight;
    });
    
    socket.on('trigger-sound', (data) => { if (isPowerOn && sounds[data.soundName]) { sounds[data.soundName].play(); } });

    // --- UI Logic and other functions ---
    sabotageOkBtn.addEventListener('click', () => {
        sabotageOverlay.classList.add('hidden');
        sabotageOverlay.classList.remove('visible');
        reenableButtons();
    });

    roomCodeToggle.addEventListener('click', () => { roomCodeContainer.classList.toggle('collapsed'); });

    function triggerAdPopup() {
        if (isPowerOn) {
            if (currentTaskState.startTime && !currentTaskState.isPaused) { pauseTask(); }
            const randomAdUrl = adImageUrls[Math.floor(Math.random() * adImageUrls.length)];
            adImage.src = randomAdUrl;
            adPopup.style.display = 'flex';
            sounds.ad.currentTime = 0;
            sounds.ad.play();
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
    
    adCloseButton.addEventListener('click', () => {
        adPopup.style.display = 'none';
        sounds.ad.pause();
        if (currentTaskState.isPaused) { resumeTask(); }
    });

    powerButton.addEventListener('click', () => {
        sounds.click.play();
        if (!hasBooted) { startBootSequence(); } else { togglePower(); }
    });

    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.parentElement.classList.contains('completed')) return;
            const parentTaskId = button.parentElement.id;
            let taskName;
            switch (parentTaskId) {
                case 'task-1': taskName = 'order'; break;
                case 'task-2': taskName = 'printing'; break;
                case 'task-4': taskName = 'printing'; break;
                case 'task-3': taskName = 'calibrate'; break;
            }
            startTask(button, 20000, taskName);
        });
    });

    function startTask(clickedButton, duration, taskName) {
        taskButtons.forEach(btn => btn.disabled = true);
        clickedButton.textContent = '...';
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        currentTaskState = { startTime: Date.now(), duration: duration, isPaused: false, button: clickedButton, taskName: taskName, timePaused: 0, pauseStart: 0 };
        playTaskSound(taskName);
        updateProgress();
    }

    function updateProgress() {
        if (currentTaskState.isPaused || !isPowerOn) return;
        const timeElapsed = Date.now() - currentTaskState.startTime - currentTaskState.timePaused;
        let progress = (timeElapsed / currentTaskState.duration) * 100;
        if (progress >= 100) {
            progressBar.style.width = '100%';
            finishTask(currentTaskState.button);
        } else {
            progressBar.style.width = `${progress}%`;
            const lagTime = 50 + Math.random() * 200;
            progressTimeoutId = setTimeout(updateProgress, lagTime);
        }
    }

    function resetCurrentTask() {
        if (!currentTaskState.startTime) return;
        stopTaskSound(currentTaskState.taskName);
        clearTimeout(progressTimeoutId);
        progressContainer.classList.add('hidden');
        progressBar.style.width = '0%';
        currentTaskState.button.textContent = 'BEGIN';
        taskButtons.forEach(btn => btn.disabled = true); // Keep buttons disabled until pop-up is closed
        currentTaskState = {};
    }
    
    function pauseTask() {
        if (currentTaskState.startTime && !currentTaskState.isPaused) {
            currentTaskState.isPaused = true;
            currentTaskState.pauseStart = Date.now();
            stopTaskSound(currentTaskState.taskName);
            clearTimeout(progressTimeoutId);
        }
    }

    function resumeTask() {
        if (currentTaskState.startTime && currentTaskState.isPaused) {
            currentTaskState.timePaused += Date.now() - currentTaskState.pauseStart;
            currentTaskState.isPaused = false;
            playTaskSound(currentTaskState.taskName);
            updateProgress();
        }
    }

    function finishTask(clickedButton) {
        clearTimeout(progressTimeoutId);
        stopTaskSound(currentTaskState.taskName);
        currentTaskState = {};
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
            const parentTask = clickedButton.parentElement;
            parentTask.classList.add('completed');
            clickedButton.textContent = 'DONE';
            reenableButtons();
        }, 300);
    }
    
    function startBootSequence() {
        hasBooted = true; isPowerOn = true;
        powerButton.classList.add('d-none');
        loadingContainer.classList.remove('d-none');
        bootSequence.classList.add('active');
        sounds.bootup.currentTime = 0; sounds.bootup.play();
        sounds.bootup.onended = () => { if (isPowerOn) { sounds.computerLoop.currentTime = 0; sounds.computerLoop.play(); } };
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
            sounds.computerLoop.play();
            if (currentTaskState.isPaused) { resumeTask(); }
        } else {
            taskTerminal.classList.add('d-none');
            sounds.computerLoop.pause();
            sounds.powerDown.play();
            if (currentTaskState.startTime) { pauseTask(); }
        }
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
        if (sounds[taskName]) {
            sounds[taskName].currentTime = 0;
            sounds[taskName].loop = true;
            sounds[taskName].play();
        }
    }

    function stopTaskSound(taskName) {
        if (sounds[taskName]) {
            sounds[taskName].pause();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- State Management Variables ---
    let hasBooted = false;
    let isPowerOn = false;
    let currentTaskState = {};
    let progressTimeoutId;
    let bootAudioPlayed = false;

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

    const adImageUrls = [
        // Base64 placeholders for ads
        'Images/AD1.jpg',
    ];

    // --- Sound Setup ---
    const sounds = {
        bootup: new Audio('sounds/bootup2.wav'),
        computerLoop: new Audio('sounds/computer2.wav'),
        powerDown: new Audio('sounds/powerdowncomp.mp3'),
        click: new Audio('sounds/click.wav'),
        ad: new Audio('sounds/ad.mp3'),
        printing: new Audio('sounds/printing.mp3'),
        order: new Audio('sounds/orderitem3.mp3'),
        calibrate: new Audio('sounds/calibrating.mp3') // placeholder, add file
    };

    sounds.computerLoop.loop = true;
    sounds.ad.loop = true;

    // --- Power Button Logic ---
    powerButton.addEventListener('click', () => {
        sounds.click.play();
        if (!hasBooted) {
            startBootSequence();
        } else {
            togglePower();
        }
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
            // --- Powering On ---
            taskTerminal.classList.remove('d-none');

            // Resume computer loop if it was powered down
            sounds.computerLoop.currentTime = 0;
            sounds.computerLoop.play();

            // Resume any paused task after 5s penalty
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
            // --- Powering Down ---
            clearTimeout(progressTimeoutId);
            taskTerminal.classList.add('d-none');
            adPopup.style.display = 'none';

            // Stop computer loop, play power down
            sounds.computerLoop.pause();
            sounds.powerDown.currentTime = 0;
            sounds.powerDown.play();

            // Pause any task
            if (currentTaskState.progress > 0 && currentTaskState.progress < 100) {
                currentTaskState.isPaused = true;
                stopTaskSound(currentTaskState.taskName);
            }
            // Stop ad sound if playing
            sounds.ad.pause();
        }
    }

    // --- Task Sound Helpers ---
    function playTaskSound(taskName) {
        stopTaskSound(currentTaskState.taskName); // stop previous task
        switch (taskName) {
            case 'printing':
                sounds.printing.currentTime = 0;
                sounds.printing.loop = true;
                sounds.printing.play();
                break;
            case 'order':
                sounds.order.currentTime = 0;
                sounds.order.loop = true;
                sounds.order.play();
                break;
            case 'calibrate':
                sounds.calibrate.currentTime = 0;
                sounds.calibrate.loop = true;
                sounds.calibrate.play();
                break;
        }
    }

    function stopTaskSound(taskName) {
        if (!taskName) return;
        switch (taskName) {
            case 'printing':
                sounds.printing.pause();
                break;
            case 'order':
                sounds.order.pause();
                break;
            case 'calibrate':
                sounds.calibrate.pause();
                break;
        }
    }

    // --- Ad Close Logic ---
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

    // --- Task Logic ---
    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.parentElement.classList.contains('completed')) return;

            const parentTaskId = button.parentElement.id;
            let taskName;
            let taskDuration;

            switch (parentTaskId) {
                case 'task-1': // example: cleaning ovens
                    taskName = 'calibrate'; // placeholder for cleaning sound
                    taskDuration = Math.floor(Math.random() * 45000) + 30000;
                    break;
                case 'task-2': // printing flyers
                    taskName = 'printing';
                    taskDuration = Math.floor(Math.random() * 45000) + 30000;
                    break;
                case 'task-3': // order supplies
                    taskName = 'order';
                    taskDuration = 150000;
                    break;
            }

            startTask(button, taskDuration, taskName);
        });
    });

    function startTask(clickedButton, duration, taskName) {
        clearTimeout(adTimer);
        taskButtons.forEach(btn => btn.disabled = true);
        clickedButton.textContent = '...';
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';

        currentTaskState = {
            progress: 0,
            increment: 100 / (duration / 50),
            isPaused: false,
            adHasPopped: false,
            button: clickedButton,
            taskName: taskName
        };

        playTaskSound(taskName);

        const adPopupDelay = Math.floor(Math.random() * (60000 - 5000 + 1)) + 5000;
        var adTimer = setTimeout(() => {
            if (isPowerOn && currentTaskState.progress < 100 && !currentTaskState.adHasPopped) {
                currentTaskState.adHasPopped = true;
                currentTaskState.isPaused = true;
                stopTaskSound(currentTaskState.taskName);

                const randomAdUrl = adImageUrls[Math.floor(Math.random() * adImageUrls.length)];
                adImage.src = randomAdUrl;
                adPopup.style.display = 'flex';
                sounds.ad.currentTime = 0;
                sounds.ad.play();
            }
        }, adPopupDelay);

        updateProgress();
    }

    function updateProgress() {
        if (currentTaskState.isPaused || !isPowerOn) return;

        currentTaskState.progress += currentTaskState.increment * (0.8 + Math.random() * 0.7);
        if (currentTaskState.progress > 100) {
            currentTaskState.progress = 100;
        }

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
});

document.addEventListener('DOMContentLoaded', () => {
    // State Management Variables
    let hasBooted = false;
    let isPowerOn = false;
    let currentTaskState = {};
    let progressTimeoutId; // To hold the ID of the progress update loop

    // Element Selectors
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

    const adImageUrls = ['data:image/png;base64,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', 'data:image/png;base64,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', 'data:image/png;base64,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'];

    // --- Power Button Logic ---
    powerButton.addEventListener('click', () => {
        if (!hasBooted) {
            // --- Initial Boot-Up Sequence ---
            hasBooted = true;
            isPowerOn = true;
            powerButton.classList.add('d-none'); // Hide button during boot animation
            loadingContainer.classList.remove('d-none');
            bootSequence.classList.add('active');

            setTimeout(() => {
                loadingContainer.classList.add('d-none');
                taskTerminal.classList.remove('d-none');
                powerButton.classList.remove('d-none'); // Show button again for toggling
            }, 15000); // 15 seconds
        } else {
            // --- On/Off Toggle Logic (after boot) ---
            togglePower();
        }
    });

    function togglePower() {
        isPowerOn = !isPowerOn; // Flip the power state

        if (isPowerOn) {
            // --- TURNING ON ---
            taskTerminal.classList.remove('d-none');

            // Check if a task was paused and needs to resume with a penalty
            const taskWasPaused = currentTaskState.isPaused && currentTaskState.progress > 0 && currentTaskState.progress < 100;
            if (taskWasPaused) {
                const activeButton = currentTaskState.button;
                activeButton.textContent = 'WAIT 5S';

                setTimeout(() => {
                    if (isPowerOn) { // Check if power wasn't turned off again during the wait
                        activeButton.textContent = '...';
                        currentTaskState.isPaused = false;
                        updateProgress(); // Resume the progress loop
                    }
                }, 5000); // 5-second penalty
            }
        } else {
            // --- TURNING OFF ---
            clearTimeout(progressTimeoutId); // IMPORTANT: Stop the progress update loop
            taskTerminal.classList.add('d-none');
            adPopup.style.display = 'none'; // Also hide ad if it's open

            // If a task is active, officially mark it as paused
            if (currentTaskState.progress > 0 && currentTaskState.progress < 100) {
                currentTaskState.isPaused = true;
            }
        }
    }

    // --- Ad Close Logic ---
    adCloseButton.addEventListener('click', () => {
        adPopup.style.display = 'none';
        const activeButton = currentTaskState.button;
        if (activeButton && currentTaskState.progress < 100) {
            activeButton.textContent = '...';
        }
        currentTaskState.isPaused = false;
        updateProgress();
    });

    // --- Task Logic ---
    taskButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.parentElement.classList.contains('completed')) return;
            let taskDuration;
            const parentTaskId = button.parentElement.id;
            if (parentTaskId === 'task-3') {
                taskDuration = 150000;
            } else {
                const minDuration = 30000;
                const maxDuration = 45000;
                taskDuration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
            }
            startTask(button, taskDuration);
        });
    });

    function startTask(clickedButton, duration) {
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
            button: clickedButton
        };
        const adPopupDelay = Math.floor(Math.random() * (60000 - 5000 + 1)) + 5000;
        var adTimer = setTimeout(() => {
            if (isPowerOn && currentTaskState.progress < 100 && !currentTaskState.adHasPopped) {
                currentTaskState.adHasPopped = true;
                currentTaskState.isPaused = true;
                const randomAdUrl = adImageUrls[Math.floor(Math.random() * adImageUrls.length)];
                adImage.src = randomAdUrl;
                adPopup.style.display = 'flex';
            }
        }, adPopupDelay);
        updateProgress();
    }

    function updateProgress() {
        if (currentTaskState.isPaused || !isPowerOn) return; // Don't update if paused or power is off

        currentTaskState.progress += currentTaskState.increment * (0.8 + Math.random() * 0.7);
        if (currentTaskState.progress > 100) {
            currentTaskState.progress = 100;
        }
        progressBar.style.width = `${currentTaskState.progress}%`;

        if (currentTaskState.progress < 100) {
            const lagTime = 20 + Math.random() * 250;
            progressTimeoutId = setTimeout(updateProgress, lagTime); // Store the timeout ID
        } else {
            finishTask(currentTaskState.button);
        }
    }

    function finishTask(clickedButton) {
        clearTimeout(progressTimeoutId);
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
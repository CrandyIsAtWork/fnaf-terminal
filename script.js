// script.js (Guard client) - full file
document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://8b503b84-132c-4149-bdb3-8bef57ec4fd8-00-2ga0ewjtdd2yk.worf.replit.dev');

    // --- Perk Data for Roster ---
    const perkData = {
        'avatars/avatar1.jpg': { name: "Fazbear's Anthem", desc: "Every time you play \"Freddy's Laugh\", there is a 25% chance the Guard's current task has its total time increased by 2 seconds." },
        'avatars/avatar2.jpg': { name: "Jam Session", desc: "When you play any sound, there is a 20% chance to cause a power surge that briefly pauses the Guard's current task for 3 seconds." },
        'avatars/avatar3.jpg': { name: "Running Buttons", desc: "When any animatronic uses Sabotage Task, your presence causes the Guard's task buttons to run away from their mouse cursor for 10 seconds." },
        'avatars/avatar4.jpg': { name: "Pirate's Haste", desc: "All of your ability cooldowns are permanently 10% shorter." },
        'avatars/avatar5.jpg': { name: "Agonized Remnant", desc: "When you use System Glitch, it generates triple the normal number of error pop-ups which are visually glitched, rapidly shaking and flashing." },
        'avatars/avatar6.jpg': { name: "Aggressive AI", desc: "For each task the Guard successfully completes, all of your ability cooldowns are permanently reduced by 20%." },
        'avatars/avatar7.jpg': { name: "Digital Eyes", desc: "When any animatronic activates Annoying Ad, there is a 50% chance your face will flash in the ad, delaying its close button by an extra 2 seconds." },
        'avatars/avatar8.jpg': { name: "Cupcake's Revenge", desc: "When any animatronic uses System Glitch, your bonus adds one extra cupcake pop-up whose 'OK' button actively runs away from the Guard's mouse for 3 seconds." },
        'avatars/avatar9.jpg': { name: "Signal Jam", desc: "Activate your unique ability to jam the Guard's video feed, blinding them with heavy static for 5 seconds. (20s Cooldown)" },
        'avatars/avatar10.jpg': { name: "Pesky Distraction", desc: "When any animatronic uses Annoying Ad, your bonus has a 50% chance to also stop the Guard's current task, kicking them out of the progress screen." },
        'avatars/avatar11.jpg': { name: "Music Box", desc: "Adds a music box to the Guard's terminal they must keep wound. If they fail, you can restore a completed task to an unfinished state." },
        'avatars/avatar12.jpg': { name: "Hide and Seek", desc: "When any animatronic uses Annoying Ad, your bonus makes the Guard's mouse cursor disappear for 3 seconds after the ad is closed and reappear randomly." },
        'avatars/avatar13.jpg': { name: "IT'S ME", desc: "Every Guard mouse click has a 3% chance to unlock your one-time use ultimate ability. When activated, it resets ALL of their tasks (even completed ones) to 0%." },
        'avatars/avatar14.jpg': { name: "Phantom Sabotage", desc: "Activate your unique ability to trigger a fake 'GET OUT' sabotage pop-up on the Guard's screen to bluff them. (10s Cooldown)" },
        'avatars/avatar15.jpg': { name: "Pop-Up Scare", desc: "When any animatronic uses Annoying Ad, there is a 50% chance to precede it with a full-screen jump scare image of your face." },
        'avatars/avatar16.jpg': { name: "Unfaced Aggression", desc: "The cooldown for your System Glitch ability is permanently 20 seconds shorter." },
        'avatars/avatar17.jpg': { name: "Freddle Infestation", desc: "Gain 1 'Freddle' counter for team Ad or Glitch uses. At 3 counters, the Guard's next task will require 20% more time to complete." },
        'avatars/avatar18.jpg': { name: "Eternal Fright", desc: "Once per game, you can revert one COMPLETED task to 0%. That task is now permanently haunted and progresses 25% slower." },
        'avatars/avatar19.jpg': { name: "Frenzied Attack", desc: "The cooldown for your Sabotage Task ability is permanently 15 seconds shorter." },
        'avatars/avatar20.jpg': { name: "Pumpkin Toss", desc: "When any animatronic uses Annoying Ad, your arm emerges and throws a pumpkin at the Guard's cursor, sending it flying to a random location." },
        'avatars/avatar21.jpg': { name: "Unforeseen Consequences", desc: "When any animatronic uses Sabotage Task, there is a 30% chance to also trigger a random secondary event (Glitch, Ad, or Signal Jam)." },
        'avatars/avatar22.jpg': { name: "Bite Sized", desc: "When any animatronic uses Annoying Ad, there is a 40% chance to also trigger a mini System Glitch with 3 un-closeable pop-ups that drift off-screen." },
        'avatars/avatar23.jpg': { name: "Please Deposit Five Coins", desc: "Gain 1 'Faz-Coin' when any animatronic uses an ability. At 3 coins, you can activate your ability to instantly drain 100% of the progress from the Guard's active task." },
        'avatars/avatar24.jpg': { name: "Power Chord", desc: "When you play any sound, there is a 20% chance of a 'Power Chord' that makes the Guard's UI shake and rapidly drain their active task's progress for 3 seconds." },
        'avatars/avatar25.jpg': { name: "Rattle the System", desc: "When you use System Glitch, the error pop-ups rattle violently, making the 'OK' buttons slightly harder to click." },
        'avatars/avatar26.jpg': { name: "A Pirate's Gamble", desc: "Activate your ability to trigger a 'Click the Parrot!' pop-up for the Guard (4s timer). Success gives the Guard a 5% boost. Failure results in an immediate Sabotage Task." },
        'avatars/avatar27.jpg': { name: "A Lengthy Monologue", desc: "Once per game, activate your ability to force an un-skippable 15-second story monologue on the Guard's screen, preventing any other actions." },
        'avatars/avatar28.jpg': { name: "You'll Never See Me Coming!", desc: "When you use System Glitch, the error pop-ups are invisible for the first 2 seconds." },
        'avatars/avatar29.jpg': { name: "Banjo Tune", desc: "When you play any sound, there is a 25% chance of a banjo riff that permanently slows the Guard's mouse cursor movement speed by 50% for the rest of the game." },
        'avatars/avatar30.jpg': { name: "Vanishing Act", desc: "Activate your unique ability to make one of the Guard's task buttons invisible and non-functional for 15 seconds. (60s Cooldown)" },
        'avatars/avatar31.jpg': { name: "System Clutter", desc: "When any animatronic uses System Glitch, three extra, non-functional pop-ups appear, visually cluttering the screen." },
        'avatars/avatar32.jpg': { name: "Silent Threat", desc: "Your Sabotage Task has a 10s longer cooldown but is completely silent. It also locks the Guard out of that task until all other tasks are completed." },
        'avatars/avatar33.jpg': { name: "Faulty Training", desc: "Activate your unique ability to temporarily remove the Guard's active task. The task only returns after they have completed all other available tasks. (75s Cooldown)" },
        'avatars/avatar34.jpg': { name: "Drown Your Demons", desc: "Activate your ability to trigger a fishing minigame pop-up. The Guard must press 'C' with perfect timing to dismiss it. (20s Cooldown)" },
        'avatars/avatar35.jpg': { name: "Ceaseless Dread", desc: "Constantly writhing tendrils line the Guard's screen. If the Guard's mouse hovers over a task button for more than 2 seconds, a tendril disables that button for 5 seconds." },
        'avatars/avatar36.jpg': { name: "Marked for Death", desc: "Activate your ability to 'mark' one task for 30 seconds. Progress on that task is reduced by 50%, and you can see its progress bar. (60s Cooldown)" },
        'avatars/avatar37.jpg': { name: "System Venom", desc: "Your Sabotage Task only resets 50% progress but also 'poisons' the task, causing its progress to drain for 20 seconds. The Guard can fight it by rapidly clicking." },
        'avatars/avatar38.jpg': { name: "Evil Within", desc: "Start in Tier 1 (longer cooldowns). Use your Stalk ability to watch the Guard's progress bar to rank up. Reach Tier 3 for a massive, temporary power boost." }
    };

    // --- Element Selectors ---
    const rosterToggleButton = document.getElementById('roster-toggle-button');
    const rosterModal = document.getElementById('roster-modal');
    const rosterModalClose = document.getElementById('roster-modal-close');
    const rosterList = document.getElementById('roster-list');
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
    let markedTasks = {}; // NEW: Tracks which tasks are marked by Ghostface
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

    // --- Listen for Server Events ---
    socket.on('connect', () => { socket.emit('create-game'); });
    socket.on('game-created', (data) => { roomCodeText.textContent = `CODE: ${data.roomCode}`; });
    socket.on('trigger-event', (data) => { if (data.type === 'ad') { triggerAdPopup(); } });
    socket.on('update-roster', (data) => { renderRoster(data.animatronics); });

    socket.on('sabotage-successful', () => {
        if (isPowerOn && currentTaskState.startTime && !currentTaskState.isPaused) {
            resetCurrentTask();
            sabotageOverlay.classList.remove('hidden');
            sabotageOverlay.classList.add('visible');
        }
    });

    socket.on('glitch-successful', (data) => {
        if (!isPowerOn || openGlitches > 0) return;
        if (currentTaskState.startTime && !currentTaskState.isPaused) { pauseTask(); }

        let numErrors = Math.floor(Math.random() * 3) + 4;
        if (data.withSpringtrapPerk) {
            numErrors *= 3;
        }

        const errorButtons = []; 

        for (let i = 0; i < numErrors; i++) {
            openGlitches++;
            const newError = errorTemplate.cloneNode(true);
            newError.removeAttribute('id');
            newError.classList.remove('hidden');
            
            if (data.withSpringtrapPerk) {
                newError.classList.add('shaking-error');
            }

            const top = Math.random() * (monitorScreen.clientHeight - 150);
            const left = Math.random() * (monitorScreen.clientWidth - 270);
            newError.style.top = `${top}px`;
            newError.style.left = `${left}px`;
            const errorCode = `0x${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
            newError.querySelector('.error-code').textContent = `ERROR: ${errorCode}`;
            
            const okButton = newError.querySelector('.error-ok-btn');
            errorButtons.push(okButton);

            okButton.addEventListener('click', () => {
                newError.remove();
                openGlitches--;
                if (openGlitches === 0 && currentTaskState.isPaused) { resumeTask(); }
            });
            monitorScreen.appendChild(newError);
        }

        if (data.withChicaPerk) {
            makeButtonsRun(errorButtons);
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

    // NEW: Listen for Ghostface's ability
    socket.on('task-marked', (data) => {
        const taskElement = document.getElementById(data.taskId);
        if (taskElement) {
            taskElement.classList.add('marked');
            markedTasks[data.taskId] = true;
        }
    });

    socket.on('task-unmarked', (data) => {
        const taskElement = document.getElementById(data.taskId);
        if (taskElement) {
            taskElement.classList.remove('marked');
            delete markedTasks[data.taskId];
        }
    });

    // --- Michael Myers STALK logic (Guard) ---
    let myersPc = null;
    let myersLocalStream = null;
    let currentMyersWatcherId = null;

    // Server tells guard "Myers started a stalk (watcherId + duration)"
    socket.on('myers-watch-start', async (data) => {
        if (!isPowerOn) return; // if terminal is already off ignore
        console.log("Received myers-watch-start", data);

        // Immediately reset guard's current task (per your requirement)
        if (currentTaskState.startTime) {
            resetCurrentTask();
        }

        currentMyersWatcherId = data.watcherId;

        // Setup RTCPeerConnection and stream webcam to watcher
        try {
            myersPc = new RTCPeerConnection();

            myersPc.onicecandidate = (event) => {
                if (event.candidate && currentMyersWatcherId) {
                    socket.emit('myers-ice-candidate', { toId: currentMyersWatcherId, candidate: event.candidate });
                }
            };

            // optional: observe connectionstatechange for debug/cleanup
            myersPc.onconnectionstatechange = () => {
                if (!myersPc) return;
                if (myersPc.connectionState === 'disconnected' || myersPc.connectionState === 'failed' || myersPc.connectionState === 'closed') {
                    // cleanup if needed
                }
            };

            // Acquire webcam (if available). If user denies, the stalk still happened but no stream will be sent.
            try {
                myersLocalStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                myersLocalStream.getTracks().forEach(track => myersPc.addTrack(track, myersLocalStream));
            } catch (err) {
                console.warn("Guard webcam unavailable or permission denied:", err);
                // still create offer (without tracks) so the watcher still receives an answer and an event flow
            }

            const offer = await myersPc.createOffer();
            await myersPc.setLocalDescription(offer);

            // send offer to server (server will forward to the watcher using the provided watcherId)
            socket.emit('myers-offer', { watcherId: currentMyersWatcherId, offer: offer });

        } catch (err) {
            console.error('Error during Myers stalk setup:', err);
        }
    });

    socket.on('myers-answer', async (data) => {
        // data: { answer, watcherId }
        try {
            if (myersPc && data && data.answer) {
                await myersPc.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        } catch (err) {
            console.error('Error applying Myers answer:', err);
        }
    });

    socket.on('myers-ice-candidate', async (data) => {
        // data: { candidate, fromId }
        try {
            if (myersPc && data && data.candidate) {
                await myersPc.addIceCandidate(new RTCIceCandidate(data.candidate));
            }
        } catch (err) {
            console.warn('Error adding remote ICE candidate (guard):', err);
        }
    });

    // When server says the stalk stopped or it was cancelled, cleanup
    socket.on('myers-watch-stop', () => {
        cleanupMyersConnection();
    });
    socket.on('myers-cancelled', () => {
        cleanupMyersConnection();
    });

    function cleanupMyersConnection() {
        if (myersLocalStream) {
            myersLocalStream.getTracks().forEach(t => t.stop());
            myersLocalStream = null;
        }
        if (myersPc) {
            try { myersPc.close(); } catch {}
            myersPc = null;
        }
        currentMyersWatcherId = null;
    }

    // --- UI Event Listeners ---
    rosterToggleButton.addEventListener('click', () => { rosterModal.classList.toggle('hidden'); });
    rosterModalClose.addEventListener('click', () => { rosterModal.classList.add('hidden'); });
    sabotageOkBtn.addEventListener('click', () => {
        sabotageOverlay.classList.add('hidden');
        sabotageOverlay.classList.remove('visible');
        reenableButtons();
    });
    roomCodeToggle.addEventListener('click', () => { roomCodeContainer.classList.toggle('collapsed'); });
    adCloseButton.addEventListener('click', () => {
    adPopup.style.display = 'none';
    sounds.ad.pause();

    // Only resume the task if *no glitch popups* are still open
    if (openGlitches === 0 && currentTaskState.isPaused) {
        resumeTask();
    }
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

    // --- Core Functions ---
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
    
    function startTask(clickedButton, duration, taskName) {
        let taskDuration = duration;
        const parentTaskId = clickedButton.parentElement.id;

        if (markedTasks[parentTaskId]) {
            console.log(`Task ${parentTaskId} is marked! Progress will be 50% slower.`);
            taskDuration *= 2; // Takes twice as long
        }

        taskButtons.forEach(btn => btn.disabled = true);
        clickedButton.textContent = '...';
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        currentTaskState = { startTime: Date.now(), duration: taskDuration, isPaused: false, button: clickedButton, taskName: taskName, timePaused: 0, pauseStart: 0 };
        playTaskSound(taskName);
        updateProgress();
    }

    function updateProgress() {
    // Stop updating if task is paused, power is off,
    // OR glitch popups are open, OR an ad is visible
    if (
        currentTaskState.isPaused ||
        !isPowerOn ||
        openGlitches > 0 ||
        adPopup.style.display === 'flex'
    ) {
        return;
    }

    const timeElapsed = Date.now() - currentTaskState.startTime - currentTaskState.timePaused;
    let progress = Math.min(100, (timeElapsed / currentTaskState.duration) * 100);

        socket.emit('progress-update', { taskId: currentTaskState.button.parentElement.id, progress: progress });

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
        // return button to begin so guard can start other tasks manually
        if (currentTaskState.button) currentTaskState.button.textContent = 'BEGIN';
        taskButtons.forEach(btn => btn.disabled = true);
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
        const parentTask = clickedButton.parentElement;
        // Unmark the task if it was marked when finished
        if (parentTask.classList.contains('marked')) {
            parentTask.classList.remove('marked');
            delete markedTasks[parentTask.id];
        }
        currentTaskState = {};
        setTimeout(() => {
            progressContainer.classList.add('hidden');
            progressBar.style.width = '0%';
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
            socket.emit('terminal-on'); // notify server if you want
        } else {
            taskTerminal.classList.add('d-none');
            sounds.computerLoop.pause();
            sounds.powerDown.play();
            if (currentTaskState.startTime) { pauseTask(); }

            // Tell the server the guard turned off terminal: cancels Myers stalk
            socket.emit('terminal-off');
            // Also local cleanup
            cleanupMyersConnection();
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

    function renderRoster(animatronics) {
        rosterList.innerHTML = '';
        if (animatronics.length === 0) {
            rosterList.innerHTML = '<li>No animatronics have joined yet.</li>';
            return;
        }
        animatronics.forEach(player => {
            const listItem = document.createElement('li');
            const avatarImg = document.createElement('img');
            avatarImg.src = `https://crandyisatwork.github.io/fnaf-terminal/${player.avatar}`;
            avatarImg.className = 'roster-avatar';
            const playerName = document.createElement('span');
            playerName.className = 'roster-player-name';
            playerName.textContent = player.name;
            playerName.style.color = player.color;
            playerName.style.textShadow = '2px 2px #000';
            const perkButton = document.createElement('button');
            perkButton.className = 'roster-perk-info-btn';
            perkButton.textContent = 'i';
            perkButton.addEventListener('click', () => {
                const perk = perkData[player.avatar];
                if (perk) {
                    alert(`Perk: ${perk.name}\n\n${perk.desc}`);
                } else {
                    alert('Perk information not available for this character.');
                }
            });
            listItem.appendChild(avatarImg);
            listItem.appendChild(playerName);
            listItem.appendChild(perkButton);
            rosterList.appendChild(listItem);
        });
    }

    function makeButtonsRun(buttonsToRun) {
    console.log("CHICA PERK: Error buttons are now running!");
    const effectDuration = 10000; // 10 seconds
    const moveDistance = 70; 
    const repelRadius = 160;

    buttonsToRun.forEach(btn => {
        btn.style.position = 'relative'; // Ensure we can move them
        btn.style.transition = 'transform 0.1s ease-out'; // Make movement smoother
    });

    const mouseMoveHandler = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        buttonsToRun.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            if (rect.width === 0) return; // Skip buttons that have been removed

            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;
            
            const deltaX = btnCenterX - mouseX;
            const deltaY = btnCenterY - mouseY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < repelRadius) {
                const angle = Math.atan2(deltaY, deltaX);
                const moveX = Math.cos(angle) * moveDistance * (1 - distance / repelRadius);
                const moveY = Math.sin(angle) * moveDistance * (1 - distance / repelRadius);
                btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                btn.style.transform = 'translate(0, 0)';
            }
        });
    };

    document.addEventListener('mousemove', mouseMoveHandler);

    setTimeout(() => {
        console.log("CHICA PERK: Error buttons have stopped running.");
        document.removeEventListener('mousemove', mouseMoveHandler);
        buttonsToRun.forEach(btn => {
            btn.style.transform = 'translate(0, 0)';
        });
    }, effectDuration);
}

});

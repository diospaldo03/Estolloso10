// Store colors for each light
const lightColors = {
    light1: '#ffff00',
    light2: '#ffff00',
    light3: '#ffff00'
};

// Store the initial state of the main switch when the page loads
let mainSwitchState = false;

// Function to check if all lights are on
function checkAllLightsOn() {
    const lights = document.querySelectorAll('.light');
    return Array.from(lights).every(light => light.classList.contains('on'));
}

// Variables for blinking and sequence features
let isBlinking = false;
let blinkInterval;
let blinkSpeed = 500; // milliseconds

let isSequencing = false;
let sequenceInterval;
let currentSequenceIndex = 0;

// Initialize lights as off
window.onload = function() {
    document.querySelectorAll('.light').forEach(light => {
        light.classList.remove('on');
        light.style.filter = 'brightness(0%)';
        light.style.boxShadow = 'none';
    });
    
    // Initialize toggle buttons
    document.querySelectorAll('.light').forEach(light => {
        const switchBtn = document.getElementById('switch' + light.id.slice(-1));
        switchBtn.classList.remove('active');
    });
    
    // Initialize main switch
    document.getElementById('mainSwitch').classList.remove('active');
    
    // Initialize other buttons
    document.getElementById('blinkButton').classList.remove('active');
    document.getElementById('sequenceButton').classList.remove('active');
};

function updateButtonStates() {
    // Update individual light buttons
    document.querySelectorAll('.light').forEach(light => {
        const switchBtn = document.getElementById('switch' + light.id.slice(-1));
        if (light.classList.contains('on')) {
            switchBtn.classList.add('active');
        } else {
            switchBtn.classList.remove('active');
        }
    });
    
    // Update main switch - only when toggled directly, not from individual lights
    // We'll handle this separately in the toggleAll function
    
    // Update blink and sequence buttons
    document.getElementById('blinkButton').classList.toggle('active', isBlinking);
    document.getElementById('sequenceButton').classList.toggle('active', isSequencing);
}

function toggleLight(id) {
    const bulb = document.getElementById(id);
    const slider = document.getElementById('slider' + id.slice(-1));
    const label = document.getElementById('label' + id.slice(-1));
    const switchBtn = document.getElementById('switch' + id.slice(-1));
    const sound = document.getElementById(bulb.classList.contains("on") ? "soundOff" : "soundOn");

    bulb.classList.toggle("on");
    switchBtn.classList.toggle("active");

    if (bulb.classList.contains("on")) {
        const value = slider.value;
        bulb.style.filter = `brightness(${value}%)`;
        bulb.style.backgroundColor = lightColors[id];
        bulb.style.boxShadow = `0 0 20px ${lightColors[id]}`;
        label.textContent = `${value}%`;
    } else {
        bulb.style.filter = 'brightness(0%)';
        bulb.style.boxShadow = 'none';
        label.textContent = '0%';
    }
    
    sound.currentTime = 0;
    sound.play();
    
    // Check if main switch state needs update
    const mainSwitch = document.getElementById('mainSwitch');
    
    // Only update the main switch to ON if ALL lights are turned on
    // Don't turn main switch OFF when individual lights are turned off
    if (checkAllLightsOn() && !mainSwitch.classList.contains('active')) {
        mainSwitch.classList.add('active');
        mainSwitchState = true;
    }
}

function adjustBrightness(id, slider) {
    const bulb = document.getElementById(id);
    const value = slider.value;
    const label = document.getElementById('label' + id.slice(-1));

    label.textContent = `${value}%`;

    if (bulb.classList.contains("on")) {
        bulb.style.filter = `brightness(${value}%)`;
    }
}

function changeColor(id, color) {
    const bulb = document.getElementById(id);
    lightColors[id] = color;
    
    if (bulb.classList.contains("on")) {
        bulb.style.backgroundColor = color;
        bulb.style.boxShadow = `0 0 20px ${color}`;
    }
}

function toggleAll() {
    const bulbs = [
        document.getElementById('light1'),
        document.getElementById('light2'),
        document.getElementById('light3')
    ];

    const sliders = [
        document.getElementById('slider1'),
        document.getElementById('slider2'),
        document.getElementById('slider3')
    ];

    const labels = [
        document.getElementById('label1'),
        document.getElementById('label2'),
        document.getElementById('label3')
    ];

    const mainSwitch = document.getElementById('mainSwitch');
    const isMainSwitchOn = mainSwitch.classList.contains('active');
    const sound = document.getElementById(isMainSwitchOn ? "soundOff" : "soundOn");

    // Toggle main switch state
    mainSwitch.classList.toggle('active');
    
    bulbs.forEach((bulb, index) => {
        const value = sliders[index].value;
        if (isMainSwitchOn) {
            bulb.classList.remove('on');
            bulb.style.filter = 'brightness(0%)';
            bulb.style.boxShadow = 'none';
            labels[index].textContent = '0%';
        } else {
            bulb.classList.add('on');
            bulb.style.filter = `brightness(${value}%)`;
            bulb.style.backgroundColor = lightColors[bulb.id];
            bulb.style.boxShadow = `0 0 20px ${lightColors[bulb.id]}`;
            labels[index].textContent = `${value}%`;
        }
    });
    
    sound.currentTime = 0;
    sound.play();
    
    // Update individual button states
    document.querySelectorAll('.light').forEach(light => {
        const switchBtn = document.getElementById('switch' + light.id.slice(-1));
        if (light.classList.contains('on')) {
            switchBtn.classList.add('active');
        } else {
            switchBtn.classList.remove('active');
        }
    });
}

// Function to toggle blinking of all lights
function toggleBlink() {
    const blinkButton = document.getElementById('blinkButton');
    
    if (isBlinking) {
        clearInterval(blinkInterval);
        isBlinking = false;
        
        // Reset lights to their original state based on current class
        document.querySelectorAll('.light').forEach(light => {
            const sliderIndex = light.id.slice(-1);
            const slider = document.getElementById('slider' + sliderIndex);
            
            if (light.classList.contains('on')) {
                light.style.filter = `brightness(${slider.value}%)`;
                light.style.backgroundColor = lightColors[light.id];
                light.style.boxShadow = `0 0 20px ${lightColors[light.id]}`;
            } else {
                light.style.filter = 'brightness(0%)';
                light.style.boxShadow = 'none';
            }
        });
        
    } else {
        // Stop sequencing if it's running
        if (isSequencing) {
            toggleSequence();
        }
        
        isBlinking = true;
        
        let isOn = true;
        blinkInterval = setInterval(() => {
            document.querySelectorAll('.light').forEach(light => {
                if (light.classList.contains('on')) {
                    const sliderIndex = light.id.slice(-1);
                    const value = document.getElementById('slider' + sliderIndex).value;
                    
                    if (isOn) {
                        light.style.filter = `brightness(${value}%)`;
                        light.style.backgroundColor = lightColors[light.id];
                        light.style.boxShadow = `0 0 20px ${lightColors[light.id]}`;
                    } else {
                        light.style.filter = 'brightness(0%)';
                        light.style.boxShadow = 'none';
                    }
                }
            });
            
            isOn = !isOn;
            document.getElementById(isOn ? "soundOn" : "soundOff").play();
        }, blinkSpeed);
    }
    
    // Update button states
    updateButtonStates();
}

// Function to toggle sequential light control
function toggleSequence() {
    const lights = ['light1', 'light2', 'light3'];
    
    if (isSequencing) {
        clearInterval(sequenceInterval);
        isSequencing = false;
        currentSequenceIndex = 0;
        
        // Reset lights based on their current class
        document.querySelectorAll('.light').forEach(light => {
            if (light.classList.contains('on')) {
                const sliderIndex = light.id.slice(-1);
                const value = document.getElementById('slider' + sliderIndex).value;
                light.style.filter = `brightness(${value}%)`;
                light.style.backgroundColor = lightColors[light.id];
                light.style.boxShadow = `0 0 20px ${lightColors[light.id]}`;
            }
        });
        
    } else {
        // Stop blinking if it's running
        if (isBlinking) {
            toggleBlink();
        }
        
        isSequencing = true;
        currentSequenceIndex = 0;
        
        // Start sequence
        sequenceInterval = setInterval(() => {
            // Increment sequence
            currentSequenceIndex = (currentSequenceIndex + 1) % lights.length;
            
            // Update visual appearance for all lights based on sequence
            lights.forEach((lightId, index) => {
                const light = document.getElementById(lightId);
                const sliderIndex = lightId.slice(-1);
                const value = document.getElementById('slider' + sliderIndex).value;
                
                // Only modify appearance, don't toggle the light's on/off state
                if (light.classList.contains('on')) {
                    if (index === currentSequenceIndex) {
                        // This is the currently active light in the sequence
                        light.style.filter = `brightness(${value}%)`;
                        light.style.backgroundColor = lightColors[lightId];
                        light.style.boxShadow = `0 0 20px ${lightColors[lightId]}`;
                    } else {
                        // Dim the other lights but don't turn them off
                        light.style.filter = `brightness(20%)`;
                        light.style.boxShadow = `0 0 5px ${lightColors[lightId]}`;
                    }
                }
            });
            
            document.getElementById("soundOn").play();
        }, blinkSpeed);
    }
    
    // Update button states
    updateButtonStates();
}

// Function to update speed of blinking and sequence
function updateSpeed(value) {
    blinkSpeed = parseInt(value);
    document.getElementById('speedLabel').textContent = value + 'ms';
    
    // Update intervals if active
    if (isBlinking) {
        clearInterval(blinkInterval);
        toggleBlink();
        toggleBlink();
    }
    
    if (isSequencing) {
        clearInterval(sequenceInterval);
        toggleSequence();
        toggleSequence();
    }
}
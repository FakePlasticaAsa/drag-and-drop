function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event, blankId, allowedType) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const blankElement = document.getElementById(blankId);

    if (draggedElement.classList.contains(allowedType)) {
        if (blankElement.innerText !== '???') {
            returnToOptions(blankElement.innerText, allowedType);
        }

        blankElement.innerText = draggedElement.innerText;

        draggedElement.parentNode.removeChild(draggedElement);

        if (blankId === 'blank1') {
            updateImage(draggedElement.innerText); 
        } else if (blankId === 'blank2') {
            showSingleItemOverlay(draggedElement.innerText); 
        } else if (blankId === 'blank3') {
            showSingleCharacterOverlay(draggedElement.innerText); 
        }

        validateBlanks();
    } else {
        alert(`You can only drop ${allowedType} options here.`);
    }
}

// Show Items
function showSingleItemOverlay(item) {
    const overlayContainer = document.getElementById('overlay-container');

    const existingItemOverlay = document.querySelector(`#overlay-container .item-overlay`);
    if (existingItemOverlay) {
        existingItemOverlay.remove();
    }

    const newOverlay = document.createElement('img');
    if (item === 'Lerasium') {
        newOverlay.className = `absolute w-[150px] h-[150px] object-cover rounded-lg item-overlay mr-24`;
    } else if (item === 'Nightblood') {
        newOverlay.className = `absolute w-[300px] h-[450px] object-cover rounded-lg item-overlay`;
    } else if (item === 'Biochromatic Breath') {
        newOverlay.className = `absolute w-[350px] h-[300px] object-cover rounded-lg item-overlay mr-20`;
    }
    newOverlay.style.pointerEvents = 'none';
    newOverlay.style.right = '10px'; 
    newOverlay.style.bottom = '10px'; 
    newOverlay.style.position = 'absolute';


    if (item === 'Lerasium') {
        newOverlay.src = 'img/lerasium.webp'; 
    } else if (item === 'Nightblood') {
        newOverlay.src = 'img/nightblood.png';
    } else if (item === 'Biochromatic Breath') {
        newOverlay.src = 'img/biochroma.webp';
    }

    overlayContainer.appendChild(newOverlay);
}

// Show characters
function showSingleCharacterOverlay(character) {
    const overlayContainer = document.getElementById('overlay-container');

    const existingCharacterOverlay = document.querySelector(`#overlay-container .character-overlay`);
    if (existingCharacterOverlay) {
        existingCharacterOverlay.remove();
    }

    const newOverlay = document.createElement('img');
    if (character === 'Kelsier') {
        newOverlay.className = `absolute w-[300px] h-[400px] object-cover rounded-lg character-overlay ml-20`;
    } else if (character === 'Szeth') {
        newOverlay.className = `absolute w-[300px] h-[400px] object-cover rounded-lg character-overlay ml-20`;
    } else if (character === 'Hoid') {
        newOverlay.className = `absolute w-[300px] h-[400px] object-cover rounded-lg character-overlay ml-16`;
    }
    newOverlay.style.pointerEvents = 'none';
    newOverlay.style.left = '10px';
    newOverlay.style.bottom = '10px'; 
    newOverlay.style.position = 'absolute';

    if (character === 'Kelsier') {
        newOverlay.src = 'img/kelsier.png'; 
    } else if (character === 'Szeth') {
        newOverlay.src = 'img/szeth.png';
    } else if (character === 'Hoid') {
        newOverlay.src = 'img/vasher.png'; 
    }

    overlayContainer.appendChild(newOverlay);
}



// Show Background World Image
function updateImage(world) {
    const imageElement = document.getElementById('adventure-image');
    if (world === 'Roshar') {
        imageElement.src = 'img/roshar.png'; 
    } else if (world === 'Scadrial') {
        imageElement.src = 'img/scadrial.jpg'; 
    } else if (world === 'Nalthis') {
        imageElement.src = 'img/nalthis.jpg'; 
    } else {
        imageElement.src = 'img/default.jpg'; 
    }
}


// Return draggable
function returnToOptions(value, type) {
    const optionsContainer = document.getElementById(`${type}-options`);
    const existingOption = Array.from(optionsContainer.children).find(
        (child) => child.innerText === value
    );

    if (!existingOption) {
        const newOption = document.createElement('span');
        newOption.className = `draggable-option ${type}`;
        newOption.draggable = true;
        newOption.ondragstart = drag; 
        newOption.innerText = value;
        optionsContainer.appendChild(newOption);
    }
}

// Resets page
function resetContent() {
    location.reload(); 
}

// If the blanks are blank !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function validateBlanks() {
    const blank1 = document.getElementById('blank1').innerText.trim();
    const blank2 = document.getElementById('blank2').innerText.trim();
    const blank3 = document.getElementById('blank3').innerText.trim();
    const nextButton = document.getElementById('next-button');
    nextButton.disabled = (blank1 === "???" || blank2 === "???" || blank3 === "???");
}

// 27 outcomes for every combination
async function showOutcome() {
    try {
        const response = await fetch('outcomes.json');
        if (!response.ok) {
            throw new Error(`JSON not found: ${response.statusText}`);
        }

        const outcomes = await response.json();

        const world = document.getElementById('blank1').innerText.trim();
        const item = document.getElementById('blank2').innerText.trim();
        const character = document.getElementById('blank3').innerText.trim();
        const key = `${world}-${item}-${character}`;

        return outcomes[key] || "Outcome not found for this combination.";
    } catch (error) {
        console.error("Error loading outcomes:", error);
        return "An error occurred while fetching the outcome.";
    }
}
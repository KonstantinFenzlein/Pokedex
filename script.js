//Zentrales Daten-Array für alle Pokémon-Daten
const allPokemons = []; 
//Direkte Referenzen auf DOM-Elemente
const pCardDialog = document.getElementById("pInfoDialog");
const searchInput = document.getElementById('searchInput');
const deleteBtn = document.getElementById('deleteSearchInput');
const goTopButton = document.getElementById("goToTop");
//Wie viele Pokémon wurden bereits geladen
let loadedPokemons = 0;
//Aktiver Tab im Dialog
let currentCategory = "Basic";
//Aktuell angezeigtes Pokémon im Dialog
let currentPokemon = 0;
//Aktuell angezeigte Daten für die Suche
let currentData = [];
//Maximale Anzahl an Pokémon, die geladen werden sollen
let maxPokemon = 200;

//Startfunktion zum Laden der ersten Pokémon-Daten
async function getPokemonData() {
  showLoadingScreen();
  for (let indexPokemon = 1; indexPokemon <= 20; indexPokemon++) { //Lädt die ersten 20 Pokémon
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexPokemon}`); //API-Aufruf...
    let responseAsJson = await response.json(); //...und warten, dass Daten vollständig geladen sind
    allPokemons.push(responseAsJson); //Cach-Speicherung der geladenen Pokémon-Daten
    currentData = allPokemons; //Zeigt alle geladenen Pokémon im Überblick an
  }
  hideLoadingScreen();
  renderCards();
  showLoadMoreBtn();
}

async function loadMorePokemons() {
  showLoadingScreen();
  disabledLoadMoreButton();
  const startIndex = loadedPokemons + 1; //Berechnet nächsten API-Bereich
  const endIndex = loadedPokemons + 20; //Verhindert doppelte Pokémon

  for (let indexPokemon = startIndex; indexPokemon <= endIndex; indexPokemon++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexPokemon}`);
    const responseAsJson = await response.json();
    allPokemons.push(responseAsJson);
  }
  currentData = allPokemons;
  hideLoadingScreen();
  renderMoreCards();
}

//Steuerung fürs Loaden und Buttons
function showLoadMoreBtn() {
  const loadButton = document.getElementById('loadMoreBtn');
  loadButton.classList.remove("loadBtn");
}

function hideLoadMoreBtn() {
  const loadButton = document.getElementById('loadMoreBtn');
  loadButton.classList.add("loadBtn");
}

function disabledLoadMoreButton() {
  const loadButton = document.getElementById('loadMoreBtn');
  loadButton.disabled = true;
}

function enableLoadMoreButton() {
  const loadButton = document.getElementById('loadMoreBtn');
  loadButton.disabled = false;
}

function showLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen')
  loadingScreen.classList.remove('dNone');
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen')
  loadingScreen.classList.add('dNone');
}

//Karten rendern und füllen
function renderCards() {
  const cardContent = document.getElementById('cardOverview');
  cardContent.innerHTML = ""; //Ansicht zurücksetzen

  if (currentData == "") {
    showNoResultMessage()
  } else {
    for (let indexCard = 0; indexCard < currentData.length; indexCard++) {
      const pokemon = currentData[indexCard];
      const imgHome = pokemon.sprites.other.home.front_default;
      const nameCap = capitalize(pokemon.species.name);
      const pokeId = pokemon.id;
      cardContent.innerHTML += getTemplateCardOverview(indexCard, pokeId, nameCap, imgHome, pokemon);
      addTypesToCardOverview(indexCard);
    }
  }
  loadedPokemons = allPokemons.length;
}

function renderMoreCards() {
  const cardContent = document.getElementById('cardOverview');
  const startIndex = loadedPokemons;

  for (let indexCard = startIndex; indexCard < currentData.length; indexCard++) {
    const pokemon = currentData[indexCard];
    const imgHome = pokemon.sprites.other.home.front_default;
    const nameCap = capitalize(pokemon.species.name);
    const pokeID = pokemon.id;
    cardContent.innerHTML += getTemplateCardOverview(indexCard, pokeID, nameCap, imgHome, pokemon);
    addTypesToCardOverview(indexCard);
  }
  loadedPokemons = allPokemons.length;
  enableLoadMoreButton();
  checkLoadMoreButton();
}

function addTypesToCardOverview(indexCard) {
  const cardTypeContent = document.getElementById(`typeOverview${indexCard}`);

  for (let indexTypes = 0; indexTypes < currentData[indexCard].types.length; indexTypes++) {
    const type = currentData[indexCard].types[indexTypes].type.name;
    cardTypeContent.innerHTML += getTemplateCardTypes(indexCard, indexTypes, type)
  }
}

function checkLoadMoreButton() {
  const button = document.getElementById('loadMoreBtn');
  if (loadedPokemons >= maxPokemon) {
    button.disabled = true;
    button.textContent = "no more Pokémon available";
  }
}

function openPokemonInfo(indexCard) {
  bodyDeactivateScrolling();
  currentPokemon = indexCard;
  pCardDialog.showModal();
  pCardDialog.classList.add("opened");
  pCardDialog.innerHTML = getTemplateInformation();
  loadBasicInformation(currentPokemon);
  checkNextAvailable();
  checkPrevAvailable()
}

function closeDialog() {
  pCardDialog.close();
  pCardDialog.classList.remove("opened");
  bodyActivateScrolling();
  currentCategory = "Basic";
}

function loadBasicInformation() {
  loadBackgroundColorPCard();
  loadIdPCard();
  loadNamePCard();
  loadTypesPCard();
  loadImgPCard();
  loadInformationIntoPCard();
  setCurrentPageInDialog();
}

function loadBackgroundColorPCard() {
  const type = currentData[currentPokemon].types[0].type.name
  document.getElementById('pInfoCard').classList.add(`${type}TypeInfo`)
}

function loadIdPCard() {
  const pokeId = currentData[currentPokemon].id;
  document.getElementById('pIdInfoCard').innerHTML = `# ${pokeId}`;
}

function loadNamePCard() {
  const nameCap = capitalize(currentData[currentPokemon].species.name);
  document.getElementById('pNameInfoCard').innerHTML = `${nameCap}`;
}

function loadTypesPCard() {
  const pCardTypeContent = document.getElementById(`ttTypeInfoCard`);
  pCardTypeContent.innerHTML = "";

  for (let indexTypes = 0; indexTypes < currentData[currentPokemon].types.length; indexTypes++) {
    const types = currentData[currentPokemon].types[indexTypes].type.name
    pCardTypeContent.innerHTML += getTemplatePCardTypes(types);
  }
}

function loadImgPCard() {
  const imgHome = currentData[currentPokemon].sprites.other.home.front_default;
  const nameCap = capitalize(currentData[currentPokemon].species.name);
  document.getElementById('pCardImg').innerHTML = getTemplateImgHome(imgHome, nameCap);
}

function showStatsInformation() {
  const infoRowContent = document.getElementById(`infoRowContent`);
  infoRowContent.innerHTML = "";
  infoRowContent.innerHTML += getTemplatePCardStats();
  currentCategory = "Stats";
  setCategoryOnActive();
}

function setCurrentPageInDialog() {
  const currentPage = document.getElementById('currentPage');
  currentPage.innerHTML = currentPokemon + 1;
}

function loadInformationIntoPCard() {
  if (currentCategory === "Basic") {
    showBasicInformation();
  } else if (currentCategory === "Stats") {
    showStatsInformation();
  } else if (currentCategory === "Attacks") {
    showAttacksInformation();
  } else if (currentCategory === "Forms") {
    showPokemonForms();
  } else return;
}

function showAttacksInformation() {
  const infoRowContent = document.getElementById(`infoRowContent`);
  infoRowContent.innerHTML = "";

  for (let indexAttacks = 0; indexAttacks < currentData[currentPokemon].moves.length; indexAttacks++) {
    const attack = currentData[currentPokemon].moves[indexAttacks].move.name;
    const level = currentData[currentPokemon].moves[indexAttacks].version_group_details[0].level_learned_at;
    infoRowContent.innerHTML += getTemplatePCardAttacks(attack, level);
  }

  currentCategory = "Attacks";
  setCategoryOnActive();
}

function showPokemonForms() {
  const shinyImg = currentData[currentPokemon].sprites.other.home.front_shiny;
  const artworkImg = currentData[currentPokemon].sprites.other["official-artwork"].front_default;
  const gifImg = currentData[currentPokemon].sprites.versions["generation-v"]["black-white"].animated.front_default;
  const infoRowContent = document.getElementById(`infoRowContent`);
  infoRowContent.innerHTML = "";
  infoRowContent.innerHTML = getTemplatePCardForms(shinyImg, artworkImg, gifImg);
  currentCategory = "Forms";
  setCategoryOnActive();
}


function showBasicInformation() {
  const infoRowContent = document.getElementById(`infoRowContent`);
  const nameCap = capitalize(currentData[currentPokemon].species.name)
  infoRowContent.innerHTML = "";
  infoRowContent.innerHTML = getTemplatePCardBasics(nameCap);
  currentCategory = "Basic";
  loadAbilitiesInformationIntoPCard();
  setCategoryOnActive();
}

function loadAbilitiesInformationIntoPCard() {
  const pCardAbilitiesContent = document.getElementById(`pokeAbilitiesValueInfoCard`);
  pCardAbilitiesContent.innerHTML = "";

  for (let indexAbilities = 0; indexAbilities < currentData[currentPokemon].abilities.length; indexAbilities++) {
    const abilities = currentData[currentPokemon].abilities[indexAbilities].ability.name;
    pCardAbilitiesContent.innerHTML += getTemplatePCardAbilities(abilities);
  }
}

function setCategoryOnActive() {
  removeCategoryActive();
  addCategoryActive();
}

function removeCategoryActive() {
  const categories = document.querySelectorAll('.categoryBtn');

  for (let i = 0; i < categories.length; i++) {
    categories[i].classList.remove('active');
  }
}

function addCategoryActive() {
  if (currentCategory === "Basic") {
    document.getElementById('categoryBtnBasicInfoCard').classList.add('active');
  } else if (currentCategory === "Stats") {
    document.getElementById('categoryBtnBaseStatsInfoCard').classList.add('active');
  } else if (currentCategory === "Attacks") {
    document.getElementById('categoryBtnAttacksInfoCard').classList.add('active');
  } else if (currentCategory === "Forms") {
    document.getElementById('categoryBtnFormsInfoCard').classList.add('active');
  };
}

pCardDialog.addEventListener("click", (event) => {
  if (event.target === pCardDialog) {
    closeDialog();
  }
});

function nextPokemonPCard() {
  if (currentPokemon < currentData.length - 1) {
    currentPokemon++;
    loadBasicInformation();
  }

  checkPrevAvailable();
  checkNextAvailable();
}

function prevPokemonPCard() {
  if (currentPokemon > 0) {
    currentPokemon--;
    loadBasicInformation();
  }

  checkNextAvailable();
  checkPrevAvailable();
}

// function searchForPokemon() {
//   const searchInput = document.getElementById('searchInput').value.toLowerCase();
//   currentData = [];

//   if (searchInput.length >= 3) {
//     pushResultsInArr(searchInput);
//     document.getElementById('deleteSearchInput').classList.add('show');
//     hideInputWarning()
//     renderCards();
//     hideLoadMoreBtn();
//   } else {
//     showInputWarning();
//   }
// }

function searchForPokemon() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  currentData = [];
  
  if (searchInput.length === 0) {
    resetOverview();
    return;
  }

  if (searchInput.length >= 3) {
    triggerSearch(searchInput);
  } else {
    showInputWarning();
    hideDeleteSearchX();
  }
}

function hideDeleteSearchX() {
    document.getElementById('deleteSearchInput').classList.remove('show');
};

function showDeleteSearchX() {
    document.getElementById('deleteSearchInput').classList.add('show');
};

function triggerSearch (searchInput) {
    pushResultsInArr(searchInput);
    hideInputWarning();
    renderCards();
    hideLoadMoreBtn();
}

document.getElementById('searchInput').addEventListener('input', searchForPokemon);

function pushResultsInArr(searchInput) {
  allPokemons.forEach(pokemon => {

    if (pokemon.species.name.toLowerCase().includes(searchInput)) {
      currentData.push(pokemon);
    }
  });
}

function showInputWarning() {
  messageWarning = document.getElementById('searchWarning');
  messageWarning.classList.add('show');
}

function hideInputWarning() {
  messageWarning = document.getElementById('searchWarning');
  messageWarning.classList.remove('show');
}

function deleteSearchInput() {
  document.getElementById('searchInput').value = "";
  document.getElementById('deleteSearchInput').classList.remove('show');
  hideNoResultMessage();
  hideInputWarning();
  resetOverview();
}

function toggleSearchMobileBar() {
  const mobileSearchBtn = document.getElementById('searchBar')
  mobileSearchBtn.classList.toggle("show");
}

function resetOverview() {
  currentData = allPokemons;
  hideDeleteSearchX();
  hideInputWarning();
  renderCards();
  showLoadMoreBtn();
}

searchInput.addEventListener('input', () => {
  if (searchInput.value.trim() !== "") {
    deleteBtn.classList.add('show');
  } else {
    deleteBtn.classList.remove('show');
  }
});

function showGoTopButton() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    goTopButton.classList.add("show");
  } else {
    goTopButton.classList.remove("show");
  }
}

function scrollUp() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
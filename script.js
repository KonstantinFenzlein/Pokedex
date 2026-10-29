//Zentrales Daten-Array für alle Pokémon-Daten
const allPokemons = [];
//Direkte Referenzen auf DOM-Elemente
const pCardDialog = document.getElementById("pInfoDialog");
const searchInput = document.getElementById('searchInput');
const deleteBtn = document.getElementById('deleteSearchInput');
const goTopButton = document.getElementById("goToTop");
//Wie viele Pokémon pro Ladevorgang geholt werden
const pokemonsPerLoad = 20;
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
  try {
    await fetchPokemonRange(1, pokemonsPerLoad); //Lädt die ersten 20 Pokémon
  } catch (error) {
    showLoadError(error);
    return;
  } finally {
    hideLoadingScreen();
  }
  currentData = allPokemons; //Zeigt alle geladenen Pokémon im Überblick an
  renderCards();
  showLoadMoreBtn();
}

async function loadMorePokemons() {
  showLoadingScreen();
  disabledLoadMoreButton();
  const startIndex = loadedPokemons + 1; //Berechnet nächsten API-Bereich
  const endIndex = loadedPokemons + pokemonsPerLoad; //Verhindert doppelte Pokémon

  try {
    await fetchPokemonRange(startIndex, endIndex);
  } catch (error) {
    showLoadError(error);
    enableLoadMoreButton();
    return;
  } finally {
    hideLoadingScreen();
  }
  currentData = allPokemons;
  renderMoreCards();
}

//Alle Anfragen gleichzeitig starten und in der richtigen Reihenfolge speichern
async function fetchPokemonRange(startIndex, endIndex) {
  const requests = [];

  for (let indexPokemon = startIndex; indexPokemon <= endIndex; indexPokemon++) {
    requests.push(fetchPokemon(indexPokemon));
  }
  const pokemons = await Promise.all(requests);
  allPokemons.push(...pokemons); //Cache-Speicherung der geladenen Pokémon-Daten
}

async function fetchPokemon(indexPokemon) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexPokemon}`);
  if (!response.ok) {
    throw new Error(`Pokémon ${indexPokemon} konnte nicht geladen werden (${response.status})`);
  }
  return response.json();
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
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.classList.remove('dNone');
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  loadingScreen.classList.add('dNone');
}

//Fehlermeldung, wenn die API nicht erreichbar ist
function showLoadError(error) {
  console.error(error);
  const errorContainer = document.getElementById('loadErrorMessage');
  errorContainer.classList.add('show', 'flex-col');
}

//Karten rendern und füllen
function renderCards() {
  const cardContent = document.getElementById('cardOverview');
  cardContent.innerHTML = ""; //Ansicht zurücksetzen

  if (currentData.length === 0) {
    showNoResultMessage();
  } else {
    hideNoResultMessage();
    cardContent.innerHTML = getCardsHtml(0);
  }
  loadedPokemons = allPokemons.length;
}

function renderMoreCards() {
  const cardContent = document.getElementById('cardOverview');
  cardContent.insertAdjacentHTML('beforeend', getCardsHtml(loadedPokemons)); //Nur die neuen Karten anhängen
  loadedPokemons = allPokemons.length;
  enableLoadMoreButton();
  checkLoadMoreButton();
}

//HTML aller Karten ab startIndex in einem String sammeln
function getCardsHtml(startIndex) {
  let cardsHtml = "";

  for (let indexCard = startIndex; indexCard < currentData.length; indexCard++) {
    const pokemon = currentData[indexCard];
    const imgHome = pokemon.sprites.other.home.front_default;
    const nameCap = capitalize(pokemon.species.name);
    cardsHtml += getTemplateCardOverview(indexCard, pokemon.id, nameCap, imgHome, pokemon, getTypesHtml(pokemon));
  }
  return cardsHtml;
}

function getTypesHtml(pokemon) {
  let typesHtml = "";

  for (let indexTypes = 0; indexTypes < pokemon.types.length; indexTypes++) {
    typesHtml += getTemplateTypeIcon(pokemon.types[indexTypes].type.name);
  }
  return typesHtml;
}

function checkLoadMoreButton() {
  const button = document.getElementById('loadMoreBtn');
  if (loadedPokemons >= maxPokemon) {
    button.disabled = true;
    button.textContent = "no more Pokémon available";
  }
}

//Karte per Tastatur öffnen (Enter oder Leertaste)
function handleCardKeydown(event, indexCard) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openPokemonInfo(indexCard);
  }
}

function openPokemonInfo(indexCard) {
  bodyDeactivateScrolling();
  currentPokemon = indexCard;
  pCardDialog.showModal();
  pCardDialog.classList.add("opened");
  pCardDialog.innerHTML = getTemplateInformation();
  loadBasicInformation();
  checkNextAvailable();
  checkPrevAvailable();
}

//Schließt den Dialog; das Aufräumen übernimmt der "close"-Listener
function closeDialog() {
  pCardDialog.close();
}

//Läuft bei jedem Schließen, auch mit der Escape-Taste
function onDialogClosed() {
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

//Klassen komplett neu setzen, damit keine alte Typ-Farbe hängen bleibt
function loadBackgroundColorPCard() {
  const type = currentData[currentPokemon].types[0].type.name;
  document.getElementById('pInfoCard').className = `card pInfo ${type}TypeInfo`;
}

function loadIdPCard() {
  const pokeId = currentData[currentPokemon].id;
  document.getElementById('pIdInfoCard').innerHTML = `# ${pokeId}`;
}

function loadNamePCard() {
  const nameCap = capitalize(currentData[currentPokemon].species.name);
  document.getElementById('pNameInfoCard').innerHTML = nameCap;
}

function loadTypesPCard() {
  document.getElementById('ttTypeInfoCard').innerHTML = getTypesHtml(currentData[currentPokemon]);
}

function loadImgPCard() {
  const imgHome = currentData[currentPokemon].sprites.other.home.front_default;
  const nameCap = capitalize(currentData[currentPokemon].species.name);
  document.getElementById('pCardImg').innerHTML = getTemplateImgHome(imgHome, nameCap);
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
  }
}

//Tab "Basic Info": Größe/Gewicht kommen in Dezimeter/Hektogramm aus der API
function showBasicInformation() {
  const pokemon = currentData[currentPokemon];
  const nameCap = capitalize(pokemon.species.name);
  const height = pokemon.height / 10;
  const weight = pokemon.weight / 10;
  document.getElementById('infoRowContent').innerHTML = getTemplatePCardBasics(nameCap, height, weight);
  currentCategory = "Basic";
  loadAbilitiesInformationIntoPCard();
  setCategoryOnActive();
}

function loadAbilitiesInformationIntoPCard() {
  const abilities = currentData[currentPokemon].abilities;
  let abilitiesHtml = "";

  for (let indexAbilities = 0; indexAbilities < abilities.length; indexAbilities++) {
    abilitiesHtml += getTemplatePCardAbilities(abilities[indexAbilities].ability.name);
  }
  document.getElementById('pokeAbilitiesValueInfoCard').innerHTML = abilitiesHtml;
}

//Tab "Base Stats": Balkenbreite auf 100% begrenzt, damit nichts überläuft
function showStatsInformation() {
  const stats = currentData[currentPokemon].stats;
  let statsHtml = "";

  for (let indexStats = 0; indexStats < stats.length; indexStats++) {
    const statName = stats[indexStats].stat.name.replace("-", " ");
    const statValue = stats[indexStats].base_stat;
    statsHtml += getTemplatePCardStat(statName, statValue, Math.min(statValue, 100));
  }
  document.getElementById('infoRowContent').innerHTML = statsHtml;
  currentCategory = "Stats";
  setCategoryOnActive();
}

//Tab "Attacks"
function showAttacksInformation() {
  const moves = currentData[currentPokemon].moves;
  let attacksHtml = "";

  for (let indexAttacks = 0; indexAttacks < moves.length; indexAttacks++) {
    const attack = moves[indexAttacks].move.name;
    const learnInfo = getLearnInfo(moves[indexAttacks].version_group_details[0]);
    attacksHtml += getTemplatePCardAttacks(attack, learnInfo);
  }
  document.getElementById('infoRowContent').innerHTML = attacksHtml;
  currentCategory = "Attacks";
  setCategoryOnActive();
}

//Statt "Level 0" anzeigen, wie die Attacke gelernt wird
function getLearnInfo(details) {
  const method = details.move_learn_method.name;

  if (method === "level-up") {
    return `Level ${details.level_learned_at}`;
  } else if (method === "machine") {
    return "TM";
  } else if (method === "egg") {
    return "Egg";
  } else if (method === "tutor") {
    return "Tutor";
  }
  return capitalize(method);
}

//Tab "Forms"
function showPokemonForms() {
  const sprites = currentData[currentPokemon].sprites;
  const shinyImg = sprites.other.home.front_shiny;
  const artworkImg = sprites.other["official-artwork"].front_default;
  const gifImg = sprites.versions["generation-v"]["black-white"].animated.front_default;
  document.getElementById('infoRowContent').innerHTML = getTemplatePCardForms(shinyImg, artworkImg, gifImg);
  currentCategory = "Forms";
  setCategoryOnActive();
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
  }
}

//Klick auf den Hintergrund schließt den Dialog
pCardDialog.addEventListener("click", (event) => {
  if (event.target === pCardDialog) {
    closeDialog();
  }
});

pCardDialog.addEventListener("close", onDialogClosed);

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

//Suche: ab 3 Buchstaben filtern, leeres Feld zeigt wieder alle
function searchForPokemon() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm.length === 0) {
    resetOverview();
    return;
  }

  showDeleteSearchX();
  if (searchTerm.length >= 3) {
    triggerSearch(searchTerm);
  } else {
    showInputWarning();
  }
}

function hideDeleteSearchX() {
  deleteBtn.classList.remove('show');
}

function showDeleteSearchX() {
  deleteBtn.classList.add('show');
}

function triggerSearch(searchTerm) {
  currentData = allPokemons.filter(pokemon => pokemon.species.name.toLowerCase().includes(searchTerm));
  hideInputWarning();
  renderCards();
  hideLoadMoreBtn();
}

searchInput.addEventListener('input', searchForPokemon);

function showInputWarning() {
  const messageWarning = document.getElementById('searchWarning');
  messageWarning.classList.add('show');
}

function hideInputWarning() {
  const messageWarning = document.getElementById('searchWarning');
  messageWarning.classList.remove('show');
}

function deleteSearchInput() {
  searchInput.value = "";
  resetOverview();
}

function toggleSearchMobileBar() {
  const mobileSearchBtn = document.getElementById('searchBar');
  mobileSearchBtn.classList.toggle("show");
}

//Übersicht mit allen geladenen Pokémon wiederherstellen
function resetOverview() {
  currentData = allPokemons;
  hideDeleteSearchX();
  hideInputWarning();
  renderCards();
  showLoadMoreBtn();
}

function showGoTopButton() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    goTopButton.classList.add("show");
  } else {
    goTopButton.classList.remove("show");
  }
}

function scrollUp() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

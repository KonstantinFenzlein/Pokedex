//Erster Buchstabe eines Strings wird großgeschrieben
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//Zugriff auf Next-Button im Dialog
function checkNextAvailable() {
    const nextButton = document.getElementById('pageSelectorBtnNext');

    if (currentPokemon == currentData.length - 1) { //letztes Pokemon?
        nextButton.classList.add('dNone'); //Button ausblenden
    } else {
        nextButton.classList.remove('dNone'); //Button einblenden
    }
}
//Zugriff auf Prev-Button im Dialog
function checkPrevAvailable() {
    const prevButton = document.getElementById('pageSelectorBtnPrev');

    if (currentPokemon == "0") { //erstes Pokemon?
        prevButton.classList.add('dNone');//Zurück-Button ausblenden
    } else {
        prevButton.classList.remove('dNone');//Zurück-Button einblenden
    }
}
//Bei jedem Scrollen Button anzeigen/verstecken
window.onscroll = function () {
    showGoTopButton();
};
//Bei offenem Dialog Scrollen deaktivieren
function bodyDeactivateScrolling() {
    const body = document.getElementById('body');
    body.classList.add('noScroll')
}

function bodyActivateScrolling() {
    const body = document.getElementById('body');
    body.classList.remove('noScroll')
}
//No match found - Container anzeigen/verstecken
function showNoResultMessage() {
    messageContainer = document.getElementById('emptySearchResultMessage');
    messageContainer.classList.add('show', 'flex-col');
}
//Kein Ergebnis
function hideNoResultMessage() {
    messageContainer = document.getElementById('emptySearchResultMessage');
    messageContainer.classList.remove('show', 'flex-col');
}
//Zurücksetzen der Übersicht
function loadMorePokemonEmptyResult() {
    document.getElementById('searchInput').value = "";
    hideNoResultMessage();
    resetOverview();
    loadMorePokemons();
}

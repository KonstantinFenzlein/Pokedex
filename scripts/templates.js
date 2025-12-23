function getTemplateCardOverview(indexCard, pokeId, nameCap, imgHome, pokemon) {
  return `
      <section onclick="openPokemonInfo(${indexCard})" id="cardOverview${indexCard}" class="card pCard ${pokemon.types[0].type.name}Type">
        <div class="pId">
          <p id="idOverview${indexCard}" class="t-center"># ${pokeId}</p>
        </div>
        <div id="pokeImgOverview${indexCard}" class="pCardImg">
          <img src="${imgHome}" alt="picture of ${nameCap}" />
        </div>
        <h2 id="pokeNameOverview${indexCard}">${nameCap}</h2>
        <section id="typeOverview${indexCard}" class="pCardTypes"></section>
      </section>
    `;
}

function getTemplateCardTypes(indexCard, indexTypes, type) {
  return `
      <div class="tooltip pCardTypes" id="ttTypeInfoCard${indexCard}-${indexTypes}">
        <img src="./assets/icons/types/${type}.png" alt="Icon of type ${type}" class="type" />
        <span class="tooltiptext bg-${type}">${type}</span>
      </div>   
    `;
}

function getTemplateInformation() {
  return `
      <section class="card pInfo" id="pInfoCard">
        <button onclick="closeDialog()" class="closeDialogMobile">X</button>
        <section class="pinfoHeader">
          <div class="pId">
            <p id="pIdInfoCard" class="t-center"></p>
          </div>
          <h2 class="pInfoHeadline" id="pNameInfoCard"></h2>
          <div class="pType" id="ttTypeInfoCard"></div>
        </section>
        <section class="pCardImg" id="pCardImg"></section>
        <hr />
        <section class="categoryInfoSection">
          <section class="categorySelector">
            <button onclick="showBasicInformation()" id="categoryBtnBasicInfoCard" class="categoryBtn active">Basic Info</button>
            <button onclick="showStatsInformation()" id="categoryBtnBaseStatsInfoCard" class="categoryBtn">Base Stats</button>
            <button onclick="showAttacksInformation()" id="categoryBtnAttacksInfoCard" class="categoryBtn">Attacks</button>
            <button onclick="showPokemonForms()" id="categoryBtnFormsInfoCard" class="categoryBtn">Forms</button>
          </section>
          <section class="card categoryInfobox">
            <div class="infoRowContentBox" id="infoRowContent"></div>
          </section>
        </section>
        <section class="pageSelector">
          <div class="selectorButtonPlaceholder">
            <button id="pageSelectorBtnPrev" class="pageSelectorBtnPrev" alt="" onclick="prevPokemonPCard()"></button>
          </div>
          <div class="pageCurrent">
            <b><span class="f-white" id="currentPage">${currentPokemon + 1}</span> of <span class="f-white" id="totalPokemonsLoaded">${currentData.length}</span></b>
          </div>
          <div class="selectorButtonPlaceholder">
            <button id="pageSelectorBtnNext" class="pageSelectorBtnNext" alt="" onclick="nextPokemonPCard()"></button>
          </div>
        </section>
      </section>

    `;
}

function getTemplateImgHome(imgHome, nameCap) {
  return `
      <img src="${imgHome}" alt="Picture of ${nameCap}"/>
    `;
}

function getTemplatePCardTypes(types) {
  return `
      <div class="tooltip pCardTypes">
        <img src="./assets/icons/types/${types}.png" alt="Icon of type ${types}" class="type" />
        <span class="tooltiptext bg-${types}">${types}</span>
      </div>
    `;
}

function getTemplatePCardBasics(nameCap) {
  return `
      <div class="infoRow">
        <div id="pokeHeightKeyInfoCard" class="basicInfoLeft">Height:</div>
        <div id="pokeHeightValueInfoCard" class="basicInfoRight">${allPokemons[currentPokemon].height}</div>
      </div>
      <div class="infoRow">
        <div id="pokeWeightKeyInfoCard" class="basicInfoLeft">Weight:</div>
        <div id="pokeWeightValueInfoCard" class="basicInfoRight">${allPokemons[currentPokemon].weight}</div>
      </div>
      <div class="infoRow">
        <div id="pokeSpeciesKeyInfoCard" class="basicInfoLeft">Species:</div>
        <div id="pokeSpeciesValueInfoCard" class="basicInfoRight">${nameCap}</div>
      </div>
      <div class="infoRow">
        <div id="pokeAbilitiesKeyInfoCard" class="basicInfoLeft">Abilities:</div>
        <div id="pokeAbilitiesValueInfoCard" class="basicInfoRight pl-16"></div>
      </div>
    `;
}

function getTemplatePCardAbilities(abilities) {
  return `
      <li>${abilities}</li>
    `;
}

function getTemplatePCardStats() {
  return `
      <div class="infoRow">
        <div class="basicInfoLeft">hp:</div>
        <div class="basicInfoRight progressBar">
          <div class="progressBarInner" style="width:${allPokemons[currentPokemon].stats[0].base_stat}%">${allPokemons[currentPokemon].stats[0].base_stat}</div>
        </div>
      </div>
      <div class="infoRow">
        <div class="basicInfoLeft">attack:</div>
        <div class="basicInfoRight progressBar">
          <div class="progressBarInner" style="width:${allPokemons[currentPokemon].stats[1].base_stat}%">${allPokemons[currentPokemon].stats[1].base_stat}</div>
        </div>
      </div>
      <div class="infoRow">
        <div class="basicInfoLeft">defense:</div>
        <div class="basicInfoRight progressBar">
          <div class="progressBarInner" style="width:${allPokemons[currentPokemon].stats[2].base_stat}%">${allPokemons[currentPokemon].stats[2].base_stat}</div>
        </div>
      </div>
      <div class="infoRow">
        <div class="basicInfoLeft">special attack:</div>
        <div class="basicInfoRight progressBar">
          <div class="progressBarInner" style="width:${allPokemons[currentPokemon].stats[3].base_stat}%">${allPokemons[currentPokemon].stats[3].base_stat}</div>
        </div>
      </div>
      <div class="infoRow">
        <div class="basicInfoLeft">special defense:</div>
        <div class="basicInfoRight progressBar">
          <div class="progressBarInner" style="width:${allPokemons[currentPokemon].stats[4].base_stat}%">${allPokemons[currentPokemon].stats[4].base_stat}</div>
        </div>
      </div>
      <div class="infoRow">
        <div class="basicInfoLeft">speed:</div>
        <div class="basicInfoRight progressBar">
          <div class="progressBarInner" style="width:${allPokemons[currentPokemon].stats[5].base_stat}%">${allPokemons[currentPokemon].stats[5].base_stat}</div>
        </div>
      </div>
     `;
}

function getTemplatePCardAttacks(attack, level) {
  return `
      <div class="infoRow">
          <div class="basicInfoLeft">${attack}</div>
          <div class="basicInfoRight">Level ${level}</div>
      </div>
    `;
}

function getTemplatePCardForms(shinyImg, artworkImg, gifImg) {
  return ` 
      <div class="infoRow pCardForm">
        <div class="basicInfoLeft"><p>Shiny</p></div>
        <div class="basicInfoRight"><img src="${shinyImg}" alt="Shiny Sprite"></div>
      </div>
      <div class="infoRow pCardForm">
        <div class="basicInfoLeft"><p>Artwork</p></div>
        <div class="basicInfoRight"><img src="${artworkImg}" alt="Official Artwork"></div>
      </div>
      <div class="infoRow pCardForm">
        <div class="basicInfoLeft"><p>Animated</p></div>
        <div class="basicInfoRight"><img src="${gifImg}" alt="Official Artwork"></div>
      </div>
    `;
}
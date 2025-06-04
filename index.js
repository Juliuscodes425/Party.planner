// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2505-ftb-et-web-ft"; // Make sure to change this!
const API = BASE + COHORT;

// === State ===
state = {
  parties: [],
  selectedParty: [],
  rsvps: [],
  guests: [],
};

/** Updates state with all parties from the API */
async function getParties() {
  try {
    const response = await fetch(API + "/events");
    const result = await response.json();
    state.parties = result.data;
    render();
  } catch (e) {
    console.error(e);
    console.log(state.parties);
  }
}
getParties();

/** Updates state with a single party from the API */
async function getParty(id) {
  try {
    const response = await fetch(API + "/events/" + id);
    const result = await response.json();
    state.selectedParty = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all RSVPs from the API */
async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const result = await response.json();
    state.rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all guests from the API */
async function getGuests() {
  try {
    const response = await fetch(API + "/guests");
    const result = await response.json();
    state.guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===

/** Party name that shows more details about the party when clicked */
function PartyListItem(party) {
  const $li = document.createElement("li");

  if (party.id === state.selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  $li.addEventListener("click", () => getParty(party.id));
  return $li;
}

/** A list of names of all parties */
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties");

  const $parties = state.parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);

  return $ul;
}

/** Detailed information about the selected party */
function SelectedParty() {
  if (!state.selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");
  $party.innerHTML = `
    <h3>${state.selectedParty.name} #${state.selectedParty.id}</h3>
    <time datetime="${state.selectedParty.date}">
      ${state.selectedParty.date.slice(0, 10)}
    </time>
    <address>${state.selectedParty.location}</address>
    <p>${state.selectedParty.description}</p>
    <GuestList></GuestList>
  `;
  $party.querySelector("GuestList").replaceWith(GuestList());

  return $party;
}

/** List of guests attending the selected party */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = state.guests.filter((guest) =>
    state.rsvps.some(
      (rsvp) =>
        rsvp.guestId === guest.id && rsvp.eventId === state.selectedParty.id
    )
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
}
const form = document.querySelector("form");
const input = document.querySelector("input");
function addNewParty() {
  const newButton = form.addEventListener(`submit`, async (event) => {
    event.preventDefault();
    $li.appendChild(newButton);
  });
}
addNewParty();

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();

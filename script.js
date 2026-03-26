// ======================
// SAFE STORAGE (corrige mobile)
// ======================

function isStorageAvailable() {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = isStorageAvailable();

// fallback em memória (caso localStorage falhe)
let memoryStorage = [];

// ======================
// ELEMENTOS
// ======================

const input = document.getElementById("item-input");
const addBtn = document.getElementById("add-btn");
const itemList = document.getElementById("item-list");
const saveListBtn = document.getElementById("save-list-btn");
const savedListsEl = document.getElementById("saved-lists");

let currentItems = [];

// ======================
// UTIL
// ======================

function formatDate(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${d}/${m}/${y} - ${h}:${min}`;
}

// ======================
// STORAGE
// ======================

function saveToStorage(lists) {
  if (storageAvailable) {
    localStorage.setItem("lists", JSON.stringify(lists));
  } else {
    memoryStorage = lists;
  }
}

function loadFromStorage() {
  if (storageAvailable) {
    return JSON.parse(localStorage.getItem("lists")) || [];
  }
  return memoryStorage;
}

// ======================
// LISTA ATUAL
// ======================

function renderItems() {
  itemList.innerHTML = "";

  currentItems.forEach((item, index) => {
    const li = document.createElement("li");

    const content = document.createElement("div");
    content.className = "item-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.completed;

    const text = document.createElement("span");
    text.textContent = item.text;

    if (item.completed) text.classList.add("completed");

    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;
      renderItems();
    });

    content.appendChild(checkbox);
    content.appendChild(text);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✕";
    removeBtn.className = "remove-btn";

    removeBtn.addEventListener("click", () => {
      currentItems.splice(index, 1);
      renderItems();
    });

    li.appendChild(content);
    li.appendChild(removeBtn);

    itemList.appendChild(li);
  });
}

function addItem() {
  const text = input.value.trim();
  if (!text) return;

  currentItems.push({
    text,
    completed: false
  });

  input.value = "";
  renderItems();
}

// ======================
// LISTAS SALVAS
// ======================

function renderSavedLists() {
  const lists = loadFromStorage();
  savedListsEl.innerHTML = "";

  lists.forEach((list, index) => {
    const li = document.createElement("li");

    const title = document.createElement("span");
    title.textContent = list.name;

    const actions = document.createElement("div");
    actions.className = "saved-actions";

    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Abrir";
    loadBtn.className = "load-btn";

    loadBtn.addEventListener("click", () => {
      currentItems = JSON.parse(JSON.stringify(list.items));
      renderItems();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      if (!confirm("Deseja excluir esta lista?")) return;

      const lists = loadFromStorage();
      lists.splice(index, 1);
      saveToStorage(lists);
      renderSavedLists();
    });

    actions.appendChild(loadBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(title);
    li.appendChild(actions);

    savedListsEl.appendChild(li);
  });
}

function saveCurrentList() {
  if (currentItems.length === 0) return;

  const lists = loadFromStorage();

  lists.push({
    name: formatDate(new Date()),
    items: currentItems
  });

  saveToStorage(lists);
  renderSavedLists();
}

// ======================
// EVENTOS (melhor para mobile)
// ======================

addBtn.addEventListener("click", addItem);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

saveListBtn.addEventListener("click", saveCurrentList);

// ======================
// INIT
// ======================

document.addEventListener("DOMContentLoaded", () => {
  renderItems();
  renderSavedLists();
});
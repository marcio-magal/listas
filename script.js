// Elementos
const input = document.getElementById("item-input");
const addBtn = document.getElementById("add-btn");
const itemList = document.getElementById("item-list");
const saveListBtn = document.getElementById("save-list-btn");
const savedListsEl = document.getElementById("saved-lists");

// Estado atual
let currentItems = [];

// ======================
// UTILIDADES
// ======================

// Formatar data (dd/mm/yyyy - hh:mm)
function formatDate(date) {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${d}/${m}/${y} - ${h}:${min}`;
}

// Salvar no localStorage
function saveToStorage(lists) {
  localStorage.setItem("lists", JSON.stringify(lists));
}

// Carregar do localStorage
function loadFromStorage() {
  return JSON.parse(localStorage.getItem("lists")) || [];
}

// ======================
// LISTA ATUAL
// ======================

// Renderizar itens
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

    // Marcar concluído
    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;
      renderItems();
    });

    content.appendChild(checkbox);
    content.appendChild(text);

    // Botão remover
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

// Adicionar item
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

// Renderizar listas salvas
function renderSavedLists() {
  const lists = loadFromStorage();
  savedListsEl.innerHTML = "";

  lists.forEach((list, index) => {
    const li = document.createElement("li");

    const title = document.createElement("span");
    title.textContent = list.name;

    const actions = document.createElement("div");
    actions.className = "saved-actions";

    // Carregar lista
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "Abrir";
    loadBtn.className = "load-btn";

    loadBtn.addEventListener("click", () => {
      currentItems = [...list.items];
      renderItems();
    });

    // Deletar lista (com confirmação)
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      const confirmDelete = confirm("Deseja excluir esta lista?");
      if (!confirmDelete) return;

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

// Salvar lista atual
function saveCurrentList() {
  if (currentItems.length === 0) return;

  const lists = loadFromStorage();

  const newList = {
    name: formatDate(new Date()),
    items: currentItems
  };

  lists.push(newList);
  saveToStorage(lists);

  renderSavedLists();
}

// ======================
// EVENTOS
// ======================

addBtn.addEventListener("click", addItem);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addItem();
});

saveListBtn.addEventListener("click", saveCurrentList);

// Inicialização
renderItems();
renderSavedLists();
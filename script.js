const input = document.querySelector(".input");
const searchBox = document.querySelector(".search-box");
const infoBox = document.querySelector(".info-box");

let array = [];

const loadData = async () => {
  deleteAutocomplete();

  let value = getValue();

  const data = await fetch(
    `https://api.github.com/search/repositories?q=${value}&per_page=5`
  );
  const result = await data.json();
  array = result.items;

  createAutocomplete();
};

function getValue(value) {
  let inputValue = input.value;

  if (inputValue.length === 0 || inputValue === " ") {
    return;
  }
  return inputValue;
}

function createAutocomplete() {
  const ul = document.createElement("ul");
  
  array.forEach((elem) => {
    const li = document.createElement("li");
    li.textContent = `${elem.name}`;

    li.addEventListener("click", function () {
      createRepoCard(elem);
      deleteAutocomplete();
      input.value = "";
      array.slice(0);
    });
    
    ul.appendChild(li);
  });
  searchBox.appendChild(ul);
}

function deleteAutocomplete() {
  const list = document.querySelector("ul");
  if (list) {
    list.remove();
  }
}

function createRepoCard(a) {
  const divBox = document.createElement("div");
  divBox.classList.add("divBox");
  const div = document.createElement("div");
  div.classList.add("card");

  let name = document.createElement("p");
  name.textContent = `Name: ${a.name}`;
  
  let owner = document.createElement("p");
  owner.textContent = `Owner: ${a.owner.login}`;
  
  let stars = document.createElement("p");
  stars.textContent = `Stars: ${a.stargazers_count}`;
  
  let button = document.createElement("button");
  button.textContent = `x`;
  button.classList.add("delete");
  
  div.appendChild(name);
  div.appendChild(owner);
  div.appendChild(stars);
  div.appendChild(button);
  divBox.append(div);
  infoBox.appendChild(divBox);
  
  button.addEventListener("click", function () {
    let targetBtn = button.target;
    div.remove(targetBtn);
  });
}

const debounce = (fn, ms = 1000) => {
  let timer;

  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timer);
    timer = setTimeout(fnCall, ms);
  };
};

const fetchData = debounce(loadData, 500);

input.addEventListener("input", fetchData);

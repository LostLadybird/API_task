const input = document.querySelector(".input");
const searchBox = document.querySelector(".search-box");
const infoBox = document.querySelector(".info-box");

let array = [];

const loadData = async (value) => {
  deleteAutocomplete();

  let inputValue = input.value;

  if (inputValue.length === 0 || inputValue === " ") {
    return;
  }

  const data = await fetch(
    `https://api.github.com/search/repositories?q=${inputValue}&per_page=5`
  );
  const result = await data.json();
  array = result.items;
  console.log(array);

  createAutocomplete();
};

function createAutocomplete() {
  const ul = document.createElement("ul");
  searchBox.appendChild(ul);

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
  divBox.append(div);

  let name = document.createElement("p");
  name.textContent = `Name: ${a.name}`;
  div.appendChild(name);

  let owner = document.createElement("p");
  owner.textContent = `Owner: ${a.owner.login}`;
  div.appendChild(owner);

  let stars = document.createElement("p");
  stars.textContent = `Stars: ${a.stargazers_count}`;
  div.appendChild(stars);

  let button = document.createElement("button");
  button.textContent = `x`;
  button.classList.add("delete");
  div.appendChild(button);

  button.addEventListener("click", function () {
    let targetBtn = button.target;
    div.remove(targetBtn);
  });

  infoBox.appendChild(divBox);
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

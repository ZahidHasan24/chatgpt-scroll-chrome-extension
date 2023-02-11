let items = [];
let currentPage = 0;
let showPages = 10;
let generateResponse = -1;

const init = () => {
  if (window.buttonsInterval) {
    clearInterval(window.buttonsInterval);
  }
  window.buttonsInterval = setInterval(() => {
    const actionsArea = document.querySelector("form>div>div");
    if (!actionsArea) {
      return;
    }
    if (shouldAddPagination()) {
      main();
    }
    if (shouldRemovePagination() || isResponseGenerating()) {
      removeButtons();
    }
  }, 1000);
};

const isResponseGenerating = () => {
  const inConversation = document.querySelector("form button");
  if (inConversation?.innerText === "Stop generating") {
    return true;
  }
  return false;
};

const main = () => {
  const innerItems = [];

  document
    .querySelectorAll(
      ".w-full.border-b.border-black\\/10.dark\\:border-gray-900\\/50.text-gray-800.dark\\:text-gray-100.group.dark\\:bg-gray-800"
    )
    .forEach((item, index) => {
      item.classList.add(`question-${index + 1}`);
      innerItems.push(index + 1);
    });

  items = innerItems;

  createPaginationList();
  addNextButton();
  addPrevButton();
};

const createPaginationList = () => {
  const parentDiv = document.createElement("div");
  parentDiv.className = "flex justify-center mt-5 pagination";
  parentDiv.innerHTML = `
  <nav class="flex">
    <ul class="flex items-center"></ul>
  </nav>
`;

  const childNode = document.querySelector(
    ".px-3.pt-2.pb-3.text-center.text-xs.text-black\\/50.dark\\:text-white\\/50.md\\:px-4.md\\:pt-3.md\\:pb-6"
  );

  document
    ?.querySelector(".absolute.bottom-0")
    ?.insertBefore(parentDiv, childNode);

  const paginationList = document.querySelector("nav ul");

  const slicedItems = items.slice(0, showPages);

  slicedItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = `target-${item} cursor-pointer mx-2`;
    li.param = `.question-${item}`;
    li.addEventListener("click", scrollToView);

    const span = document.createElement("span");
    span.className =
      "btn flex justify-center gap-2 btn-neutral border-0 md:border";
    span.innerHTML = item;
    li.appendChild(span);

    paginationList.appendChild(li);
  });
  currentPage = 0;
};

const addNextButton = () => {
  const parentDiv = document.querySelector(".pagination");
  const nextButton = document.createElement("button");
  nextButton.className =
    "btn flex justify-center gap-2 btn-neutral border-0 md:border next";
  nextButton.innerText = "Next";
  nextButton.disabled = currentPage >= items.length - showPages;
  nextButton.addEventListener("click", handleNextButton);
  parentDiv.append(nextButton);
};

const addPrevButton = () => {
  const parentDiv = document.querySelector(".pagination");
  const prevButton = document.createElement("button");
  prevButton.className =
    "btn flex justify-center gap-2 btn-neutral border-0 md:border prev";
  prevButton.innerText = "Prev";
  prevButton.disabled = currentPage === 0;
  prevButton.addEventListener("click", handlePrevButton);
  parentDiv.prepend(prevButton);
};

const handlePagination = (isNext) => {
  isNext ? currentPage++ : currentPage--;
  const startIndex = currentPage;
  const endIndex = showPages + currentPage;
  const slicedItems = items.slice(startIndex, endIndex);
  if (slicedItems.length === 0) {
    return;
  }
  const nextButton = document.querySelector(".next");
  const prevButton = document.querySelector(".prev");
  const pagination = document.querySelector("nav ul");
  pagination.innerHTML = "";
  for (var i = 0; i < slicedItems.length; i++) {
    var innerLi = document.createElement("li");
    innerLi.className = `target-${slicedItems[i]} cursor-pointer mx-2`;
    var innerSpan = document.createElement("span");
    innerSpan.className =
      "btn flex justify-center gap-2 btn-neutral border-0 md:border";
    innerSpan.innerHTML = slicedItems[i];
    innerLi.addEventListener("click", scrollToView, false);
    innerLi.param = `.question-${slicedItems[i]}`;
    innerLi.appendChild(innerSpan);
    pagination.appendChild(innerLi);
  }
  nextButton.disabled = currentPage >= items.length - showPages;
  prevButton.disabled = currentPage === 0;
};

const handleNextButton = () => handlePagination(true);

const handlePrevButton = () => handlePagination(false);
const scrollToView = (event) => {
  event.preventDefault();
  document
    .querySelector(event.currentTarget.param)
    .scrollIntoView({ behavior: "smooth" });
};

const shouldRemovePagination = () => {
  const isThereSpinner = document.querySelector(".animate-spin");

  if (isThereSpinner !== null) {
    return true;
  }

  return false;
};

const shouldAddPagination = () => {
  const isTherePagination = document.querySelector(".pagination");
  const isThereChat = document.querySelectorAll(
    ".w-full.border-b.border-black\\/10.dark\\:border-gray-900\\/50.text-gray-800.dark\\:text-gray-100.group.dark\\:bg-gray-800"
  );
  if (isTherePagination === null && isThereChat?.length > 0) {
    return true;
  }
  return false;
};

const removeButtons = () => {
  const pagination = document.querySelector(".pagination");
  resetVariable();
  if (pagination !== null) {
    pagination.remove();
    resetVariable();
  }
};

const resetVariable = () => {
  items = [];
  showPages = 10;
  currentPage = 0;
};

// run init
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

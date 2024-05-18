let items = [];
let questionList = [];
let currentPage = 0;
let showPages = 10;
let generateResponse = -1;

const classNameForQuestion = '[data-message-author-role="user"]';
var style = document.createElement("style");
style.innerHTML = `
[tooltip] {
  position: relative;
  cursor: pointer;
}

/* Applies to all tooltips */
[tooltip]::before,
[tooltip]::after {
  text-transform: none;
  font-size: 0.9em;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  position: absolute;
  display: none;
  opacity: 0;
}
[tooltip]::before {
  content: "";
  border: 5px solid transparent;
  z-index: 1001;
}
[tooltip]::after {
  content: attr(tooltip);
  text-align: center;
  min-width: 3em;
  max-width: 450px;
  white-space: nowrap;
  overflow: auto;
  padding: 1.5ch 1.9ch;
  border-radius: 10px;
  box-shadow: 0 1em 2em -0.5em rgba(0, 0, 0, 0.404);
  background: rgb(0, 0, 0);
  color: #ffffff;
  z-index: 1000;
}
/* Make the tooltips respond to hover */
[tooltip]:hover::before,
[tooltip]:hover::after {
  display: block;
}
/* don't show empty tooltips */
[tooltip=""]::before,
[tooltip=""]::after {
  display: none !important;
}
/* FLOW: UP */
[tooltip]:not([flow])::before,
[tooltip][flow^="up"]::before {
  bottom: 100%;
  border-bottom-width: 0;
  border-top-color: rgb(0, 0, 0);
}
[tooltip]:not([flow])::after,
[tooltip][flow^="up"]::after {
  bottom: calc(100% + 5px);
}
[tooltip]:not([flow])::before,
[tooltip]:not([flow])::after,
[tooltip][flow^="up"]::before,
[tooltip][flow^="up"]::after {
  left: 50%;
  transform: translate(-50%, -0.5em);
}
/* KEYFRAMES */
@keyframes tooltips-vert {
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
@keyframes tooltips-horz {
  to {
    opacity: 1;
    transform: translate(0, -50%);
  }
}
/* FX All The Things */
[tooltip]:not([flow]):hover::before,
[tooltip]:not([flow]):hover::after,
[tooltip][flow^="up"]:hover::before,
[tooltip][flow^="up"]:hover::after{
  animation: tooltips-vert 300ms ease-out forwards;
}

  `;
document.head.appendChild(style);

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
  const quesList = [];
  document.querySelectorAll(classNameForQuestion).forEach((item, index) => {
    item.classList.add(`question-${index + 1}`);
    innerItems.push(index + 1);
    quesList.push(item?.innerText);
  });

  items = innerItems;
  questionList = quesList;

  createPaginationList();
  addNextButton();
  addPrevButton();
};

const createPaginationList = () => {
  const parentDiv = document.createElement("div");
  parentDiv.className = "flex justify-center mt-3 pagination";
  parentDiv.innerHTML = `
  <nav class="flex">
    <ul class="flex items-center"></ul>
  </nav>
`;

  const chatBoxParent = document.querySelectorAll(
    "form.w-full .flex.w-full.items-center"
  );

  const chatBoxParentLastChild = chatBoxParent[chatBoxParent?.length - 1];

  chatBoxParentLastChild?.classList?.add("flex-col");

  chatBoxParentLastChild.appendChild(parentDiv);

  const paginationList = document.querySelector("nav ul");

  const slicedItems = items.slice(0, showPages);

  slicedItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = `target-${item} cursor-pointer mx-2`;
    li.param = `.question-${item}`;
    li.addEventListener("click", scrollToView);
    li.setAttribute(
      "tooltip",
      questionList[item - 1]?.length > 65
        ? `${questionList[item - 1].slice(0, 61)}...`
        : questionList[item - 1]
    );
    li.setAttribute("flow", "up");

    const span = document.createElement("span");
    span.className =
      "btn flex justify-center gap-2 btn-neutral border-0 md:border";
    span.innerHTML = item;
    li.appendChild(span);

    paginationList?.appendChild(li);
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
  parentDiv?.append(nextButton);
};

const addPrevButton = () => {
  const parentDiv = document.querySelector(".pagination");
  const prevButton = document.createElement("button");
  prevButton.className =
    "btn flex justify-center gap-2 btn-neutral border-0 md:border prev";
  prevButton.innerText = "Prev";
  prevButton.disabled = currentPage === 0;
  prevButton.addEventListener("click", handlePrevButton);
  parentDiv?.prepend(prevButton);
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
    innerLi.setAttribute(
      "tooltip",
      questionList[slicedItems[i] - 1]?.length > 65
        ? `${questionList[slicedItems[i] - 1].slice(0, 61)}...`
        : questionList[slicedItems[i] - 1]
    );
    innerLi.setAttribute("flow", "up");
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
  const isThereSpinner = document.querySelector(
    '[aria-label="Stop generating"]'
  );

  if (isThereSpinner !== null) {
    return true;
  }

  return false;
};

const shouldAddPagination = () => {
  const isTherePagination = document.querySelector(".pagination");
  // Define a regular expression to match elements with data-testid="conversation-turn-{number}"
  const regex = /^conversation-turn-\d+$/;

  // Query all elements with data-testid attribute
  const elements = document.querySelectorAll("[data-testid]");

  // Check if any of the elements match the pattern
  const isThereChat = Array.from(elements).filter((element) =>
    regex.test(element.getAttribute("data-testid"))
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
  questionList = [];
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

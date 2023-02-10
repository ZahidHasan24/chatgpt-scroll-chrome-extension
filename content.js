let items = [];
let currentPage = 0;
const showPages = 10;

const parentDiv = document.createElement("div");
parentDiv.className = "flex justify-center mt-5";
parentDiv.innerHTML = `
  <nav class="flex">
    <ul class="flex items-center"></ul>
  </nav>
`;

const main = () => {
  document
    .querySelectorAll(
      ".w-full.border-b.border-black\\/10.dark\\:border-gray-900\\/50.text-gray-800.dark\\:text-gray-100.group.dark\\:bg-gray-800"
    )
    .forEach((item, index) => {
      item.classList.add(`question-${index + 1}`);
      items.push(index + 1);
    });

  const childNode = document.querySelector(
    ".px-3.pt-2.pb-3.text-center.text-xs.text-black\\/50.dark\\:text-white\\/50.md\\:px-4.md\\:pt-3.md\\:pb-6"
  );
  if (childNode !== null) {
    document
      ?.querySelector(".absolute.bottom-0")
      ?.insertBefore(parentDiv, childNode);

    createPaginationList();
    addNextButton();
    addPrevButton();
  }
};

const createPaginationList = () => {
  const paginationList = document.querySelector("nav ul");
  const slicedItems = items.slice(currentPage, currentPage + showPages);

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
};

const addNextButton = () => {
  const nextButton = document.createElement("button");
  nextButton.className =
    "btn flex justify-center gap-2 btn-neutral border-0 md:border next";
  nextButton.innerText = "Next";
  nextButton.disabled = currentPage >= items.length - showPages;
  nextButton.addEventListener("click", handleNextButton);
  parentDiv.append(nextButton);
};

const addPrevButton = () => {
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

var intervalID = setInterval(function () {
  var getAllQuestions = document.querySelectorAll(
    ".w-full.border-b.border-black\\/10.dark\\:border-gray-900\\/50.text-gray-800.dark\\:text-gray-100.group.dark\\:bg-gray-800"
  );
  if (getAllQuestions?.length > 0) {
    main();
    clearInterval(intervalID);
  }
}, 2000);

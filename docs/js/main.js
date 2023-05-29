const elSelectNative = document.getElementsByClassName("js-select__Native")[0];
const elSelectCustom = document.getElementsByClassName("js-select__Custom")[0];
const elSelectCustomBox = elSelectCustom.children[0];
const elSelectCustomOpts = elSelectCustom.children[1];
const customOptsList = Array.from(elSelectCustomOpts.children);
const optionsCount = customOptsList.length;
const defaultLabel = elSelectCustomBox.getAttribute("data-value");
const sliderProgress = document.querySelector(".form__slider-progress");
const slider = document.querySelector(".form__slider");

const fileLabel = document.querySelector(".form__file-label");
const file = document.querySelector(".form__file");

let optionChecked = "";
let optionHoveredIndex = -1;

slider.addEventListener("change", (e) => {
  sliderProgress.textContent = e.target.value + "%";
});

file.addEventListener("change", (e) => {
  fileLabel.textContent = e.target.value;
});

elSelectCustomBox.addEventListener("click", (e) => {
  const isClosed = !elSelectCustom.classList.contains("isActive");

  if (isClosed) {
    openSelectCustom();
  } else {
    closeSelectCustom();
  }
});

function openSelectCustom() {
  elSelectCustom.classList.add("isActive");

  elSelectCustom.setAttribute("aria-hidden", false);

  if (optionChecked) {
    const optionCheckedIndex = customOptsList.findIndex(
      (el) => el.getAttribute("data-value") === optionChecked
    );
    updateCustomSelectHovered(optionCheckedIndex);
  }

  document.addEventListener("click", watchClickOutside);
  document.addEventListener("keydown", supportKeyboardNavigation);
}

function closeSelectCustom() {
  elSelectCustom.classList.remove("isActive");
  elSelectCustom.setAttribute("aria-hidden", true);
  updateCustomSelectHovered(-1);
  document.removeEventListener("click", watchClickOutside);
  document.removeEventListener("keydown", supportKeyboardNavigation);
}

function updateCustomSelectHovered(newIndex) {
  const prevOption = elSelectCustomOpts.children[optionHoveredIndex];
  const option = elSelectCustomOpts.children[newIndex];

  if (prevOption) {
    prevOption.classList.remove("isHover");
  }
  if (option) {
    option.classList.add("isHover");
  }

  optionHoveredIndex = newIndex;
}

function updateCustomSelectChecked(value, text) {
  const prevValue = optionChecked;

  const elPrevOption = elSelectCustomOpts.querySelector(
    `[data-value="${prevValue}"`
  );
  const elOption = elSelectCustomOpts.querySelector(`[data-value="${value}"`);

  if (elPrevOption) {
    elPrevOption.classList.remove("isActive");
  }

  if (elOption) {
    elOption.classList.add("isActive");
  }

  elSelectCustomBox.textContent = text;
  optionChecked = value;
}

function watchClickOutside(e) {
  const didClickedOutside = !elSelectCustom.contains(event.target);
  if (didClickedOutside) {
    closeSelectCustom();
  }
}

function supportKeyboardNavigation(e) {
  if (event.keyCode === 40 && optionHoveredIndex < optionsCount - 1) {
    let index = optionHoveredIndex;
    e.preventDefault();
    updateCustomSelectHovered(optionHoveredIndex + 1);
  }

  if (event.keyCode === 38 && optionHoveredIndex > 0) {
    e.preventDefault();
    updateCustomSelectHovered(optionHoveredIndex - 1);
  }

  if (event.keyCode === 13 || event.keyCode === 32) {
    e.preventDefault();

    const option = elSelectCustomOpts.children[optionHoveredIndex];
    const value = option && option.getAttribute("data-value");

    if (value) {
      elSelectNative.value = value;
      updateCustomSelectChecked(value, option.textContent);
    }
    closeSelectCustom();
  }

  if (event.keyCode === 27) {
    closeSelectCustom();
  }
}

elSelectNative.addEventListener("change", (e) => {
  const value = e.target.value;
  const elRespectiveCustomOption = elSelectCustomOpts.querySelectorAll(
    `[data-value="${value}"]`
  )[0];

  updateCustomSelectChecked(value, elRespectiveCustomOption.textContent);
});

customOptsList.forEach(function (elOption, index) {
  elOption.addEventListener("click", (e) => {
    const value = e.target.getAttribute("data-value");

    elSelectNative.value = value;
    updateCustomSelectChecked(value, e.target.textContent);
    closeSelectCustom();
  });

  elOption.addEventListener("mouseenter", (e) => {
    updateCustomSelectHovered(index);
  });
});

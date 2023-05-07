const mainContainer = document.querySelector(".main-container");
const choosePhotoBtn = document.querySelector(".choose-photo-btn");
const choosePhotoFileInput = document.querySelector(".choose-photo-file-input");
const chosenPhoto = document.querySelector(".chosenPhoto");
const choosePhotoContainer = document.querySelector(".choose-photo-container");
const main = document.querySelector("main");
const nav = document.querySelector(".navbar");
const controls = document.querySelectorAll(".controls");
const textControlsContainer = document.querySelector(".add-text");
const optionsGroup = document.querySelectorAll(".options-group");
let isEditAllow = false;

main.style.height = `calc(100vh - ${nav.clientHeight}px - 3em)`;

const reset = () => {
  chosenPhoto.style.display = "none";
  choosePhotoFileInput.value = null;
  choosePhotoContainer.style.display = "block";

  mainContainer.addEventListener("drop", dropHandler);

  controls.forEach((control) => {
    control.value = control.dataset.value;
    const suffix = control.dataset.sizing || "";
    document.documentElement.style.setProperty(
      `--${control.name}`,
      control.dataset.filter
        ? `${control.dataset.filter}(${control.dataset.value + suffix})`
        : control.dataset.value + suffix
    );
  });

  document.documentElement.style.setProperty("--photo-bg-color", "transparent");

  textControlsContainer.innerHTML = "";
  document
    .querySelectorAll(".main-container > p")
    .forEach((text) => text.remove());
  isEditAllow = false;
};

const choosePhotoBtnHandler = () => {
  choosePhotoFileInput.click();
};

const displayImage = (imageObj) => {
  document.documentElement.style.setProperty("--photo-bg-color", "white");
  choosePhotoContainer.style.display = "none";
  const image = URL.createObjectURL(imageObj);
  chosenPhoto.src = image;
  chosenPhoto.onload = () => {
    URL.revokeObjectURL(image);
  };
  chosenPhoto.style.display = "block";
  isEditAllow = true;
};

const fileInputOnchangeHandler = () => {
  if (choosePhotoFileInput.files[0]) {
    displayImage(choosePhotoFileInput.files[0]);
  }
};

function handleUpdate() {
  const suffix = this.dataset.sizing || "";
  document.documentElement.style.setProperty(
    `--${this.name}`,
    this.dataset.filter
      ? `${this.dataset.filter}(${this.value + suffix})`
      : this.value + suffix
  );
}

function dropHandler(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  const images = [];
  for (let i = 0; i < files.length; i++) {
    if (!files[i].type.match("image")) continue;
    images.push(files[i]);
  }
  if (images.length !== 0) {
    displayImage(images[0]);
  }

  mainContainer.removeEventListener("drop", dropHandler);
}

controls.forEach((input) => input.addEventListener("change", handleUpdate));
// controls.forEach((input) => input.addEventListener("mousemove", handleUpdate));

mainContainer.addEventListener("dragover", (e) => {
  e.preventDefault();
});

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

const textInputChangeHandler = (e) => {
  const txtEle = document.querySelector(`.${e.target.name}`);
  txtEle.textContent = e.target.value;
};

const removeTextHandler = (textName) => {
  document.querySelector(`.text-${textName}-controls`).remove();
  document.querySelector(`.text-${textName}`).remove();
};

const createHtmlElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  setAttributes(element, attributes);
  return element;
};

const handleTextUpdate = (event, textName) => {
  document.querySelector(`.text-${textName}`).style[event.target.name] = `${
    event.target.value
  }${event.target.dataset.sizing || ""}`;
};

const textEditingControl = (
  { label, type, attributes, options },
  parentName
) => {
  const container = createHtmlElement("div");
  const labelElement = createHtmlElement("label");
  labelElement.append(document.createTextNode(label));
  const control = createHtmlElement(type, attributes);
  if (options) {
    options.forEach((option) => {
      const optionNode = createHtmlElement("option", { value: option });
      optionNode.append(
        document.createTextNode(
          option.charAt(0).toUpperCase() + option.slice(1)
        )
      );
      control.append(optionNode);
    });
  }
  control.addEventListener("change", (event) =>
    handleTextUpdate(event, parentName)
  );
  container.append(labelElement, control);
  return container;
};

const createTextControl = () => {
  const textControlName = Math.floor(Math.random() * 100);
  const container = document.createElement("div");

  const textInputAndRemoveBtnContainer = document.createElement("div");
  textInputAndRemoveBtnContainer.classList.add(
    "space-between-center-container"
  );

  const textInput = createHtmlElement("input", {
    type: "text",
    class: "textInput",
    name: `text-${textControlName}`,
    value: "",
    placeholder: "Add text",
  });
  textInput.addEventListener("change", textInputChangeHandler);

  const textEle = createHtmlElement("p", {
    class: `text text-${textControlName}`,
  });

  setAttributes(container, { class: `text-${textControlName}-controls` });

  const removeBtn = document.createElement("button");
  removeBtn.appendChild(document.createTextNode("X"));
  setAttributes(removeBtn, { type: "button", class: "basic-btn removeBtn" });
  removeBtn.addEventListener("click", () => removeTextHandler(textControlName));

  textInputAndRemoveBtnContainer.append(textInput, removeBtn);

  const x = textEditingControl(
    {
      label: "X",
      type: "input",
      attributes: {
        type: "range",
        name: "left",
        min: "0",
        max: `${100 - textEle.clientWidth}`,
        value: "0",
        ["data-sizing"]: "%",
      },
    },
    textControlName
  );

  const y = textEditingControl(
    {
      label: "Y",
      type: "input",
      attributes: {
        type: "range",
        name: "top",
        min: "0",
        max: `${100 - textEle.clientHeight}`,
        value: "0",
        ["data-sizing"]: "%",
      },
    },
    textControlName
  );

  const color = textEditingControl(
    {
      label: "Font Color",
      type: "input",
      attributes: {
        type: "color",
        name: "color",
        value: "#000000",
      },
    },
    textControlName
  );

  const fontSize = textEditingControl(
    {
      label: "Font Size",
      type: "input",
      attributes: {
        type: "number",
        name: "font-size",
        min: "0",
        value: "16",
        ["data-sizing"]: "px",
      },
    },
    textControlName
  );

  const fontFamily = textEditingControl(
    {
      label: "Font Family",
      type: "select",
      attributes: { name: "font-family" },
      options: ["sans-serif", "serif", "cursive", "fantasy"],
    },
    textControlName
  );

  const fontWeight = textEditingControl(
    {
      label: "Font Weight",
      type: "select",
      attributes: { name: "font-weight" },
      options: ["normal", "bold"],
    },
    textControlName
  );

  const fontStyle = textEditingControl(
    {
      label: "Font Style",
      type: "select",
      attributes: { name: "font-style" },
      options: ["normal", "italic"],
    },
    textControlName
  );

  mainContainer.append(textEle);
  container.append(
    textInputAndRemoveBtnContainer,
    x,
    y,
    color,
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle
  );
  return container;
};

const addText = () => {
  if (isEditAllow) {
    textControlsContainer.append(createTextControl());
  }
};

function closeAllVisibleOptions(e) {
  optionsGroup.forEach((optionGroup) =>
    optionGroup.classList.remove("options--visible")
  );
  e.stopPropagation();
}

function optionsGroupClickHandler() {
  optionsGroup.forEach((optionGroup) =>
    optionGroup.classList.remove("options--visible")
  );
  this.classList.add("options--visible");
}

optionsGroup.forEach((optionGroup) =>
  optionGroup.addEventListener("click", optionsGroupClickHandler)
);

function imagePrintHandler() {
  window.print();
}

reset();

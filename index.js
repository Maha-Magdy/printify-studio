const mainContainer = document.querySelector(".main-container");
const choosePhotoBtn = document.querySelector(".choose-photo-btn");
const choosePhotoFileInput = document.querySelector(".choose-photo-file-input");
const chosenPhoto = document.querySelector(".chosenPhoto");
const choosePhotoContainer = document.querySelector(".choose-photo-container");
const main = document.querySelector("main");
const nav = document.querySelector("nav");
const controls = document.querySelectorAll(".controls");
const textControlsContainer = document.querySelector(
  ".text-controls-container"
);

main.style.height = `calc(100vh - ${nav.clientHeight}px - 3em)`;

const reset = () => {
  chosenPhoto.style.display = "none";
  choosePhotoFileInput.value = null;
  choosePhotoContainer.style.display = "block";
  document.documentElement.style.setProperty("--photo-bg-color", "transparent");
  document.documentElement.style.setProperty("--photo-border-color", "#000000");
  document.documentElement.style.setProperty("--photo-border-line-width", "0");
};

const choosePhotoBtnHandler = () => {
  choosePhotoFileInput.click();
};

const fileInputOnchangeHandler = () => {
  if (choosePhotoFileInput.files[0]) {
    document.documentElement.style.setProperty("--photo-bg-color", "white");
    choosePhotoContainer.style.display = "none";
    const image = URL.createObjectURL(choosePhotoFileInput.files[0]);
    chosenPhoto.src = image;
    chosenPhoto.onload = () => {
      URL.revokeObjectURL(image);
    };
    chosenPhoto.style.display = "block";
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
  //   console.log(this.value + suffix);
  //   console.log(this.name);
}

controls.forEach((input) => input.addEventListener("change", handleUpdate));
// controls.forEach((input) => input.addEventListener("mousemove", handleUpdate));

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

const textInputChangeHandler = (e) => {
  console.log(e, e.target.name, e.target.value);
  const txtEle = document.querySelector(`.${e.target.name}`);
  const txt = document.createTextNode(e.target.value);
  txtEle.appendChild(txt);
};

const removeTextHandler = (textName) => {
  document.querySelector(`.text-${textName}-controls`).remove();
  document.querySelector(`.${textName}`).remove();
};

const createTextControl = () => {
  const container = document.createElement("div");

  const textInputAndRemoveBtnContainer = document.createElement("div");

  const textInput = document.createElement("input");
  setAttributes(textInput, {
    type: "text",
    class: "textInput",
    name: `text-${Math.floor(Math.random() * 100)}`,
    value: "",
    placeholder: "Add text",
  });
  textInput.addEventListener("change", textInputChangeHandler);

  const textEle = document.createElement("p");
  setAttributes(textEle, { class: `text ${textInput.name}` });

  setAttributes(container, { class: `text-${textInput.name}-controls` });

  const removeBtn = document.createElement("button");
  removeBtn.appendChild(document.createTextNode("Remove"));
  setAttributes(removeBtn, { type: "button", class: "removeBtn" });
  removeBtn.addEventListener("click", () => removeTextHandler(textInput.name));

  textInputAndRemoveBtnContainer.append(textInput, removeBtn);

  mainContainer.append(textEle);
  container.append(textInputAndRemoveBtnContainer);
  return container;
};

const addText = () => {
  console.log("Hi");
  textControlsContainer.append(createTextControl());
};

reset();

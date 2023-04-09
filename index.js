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

// () => {
//   const container = document.createElement("div");
//   const label = document.createElement("label");
//   label.append(document.createTextNode("Font Weight"));
//   const select = createHtmlElement("select", { name: "font-weight" });
//   const options = ["normal", "bold"];
//   options.forEach((option) => {
//     const optionNode = createHtmlElement("option", { value: option });
//     optionNode.append(
//       document.createTextNode(option.charAt(0).toUpperCase() + option.slice(1))
//     );
//     select.append(optionNode);
//   });
//   select.addEventListener("change", (event) => {
//     handleTextUpdate(event, textControlName);
//   });
//   container.append(label, select);
//   return container;
// };

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
  removeBtn.appendChild(document.createTextNode("Remove"));
  setAttributes(removeBtn, { type: "button", class: "removeBtn" });
  removeBtn.addEventListener("click", () => removeTextHandler(textControlName));

  textInputAndRemoveBtnContainer.append(textInput, removeBtn);

  const x = textEditingControl(
    {
      label: "X",
      type: "input",
      attributes: {
        type: "number",
        name: "left",
        min: "0",
        max: `${mainContainer.clientWidth}`,
        value: "0",
        ["data-sizing"]: "px",
      },
    },
    textControlName
  );

  const y = textEditingControl(
    {
      label: "Y",
      type: "input",
      attributes: {
        type: "number",
        name: "top",
        min: "0",
        max: `${mainContainer.clientHeight}`,
        value: "0",
        ["data-sizing"]: "px",
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

  const fontWeight = textEditingControl(
    {
      label: "Font Weight",
      type: "select",
      attributes: { name: "font-weight" },
      options: ["normal", "bold"],
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
    fontWeight
  );
  return container;
};

const addText = () => {
  console.log("Hi");
  textControlsContainer.append(createTextControl());
};

reset();

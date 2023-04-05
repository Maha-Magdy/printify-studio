const photoContainer = document.querySelector('.photo-container');
const choosePhotoBtn = document.querySelector(".choose-photo-btn");
const choosePhotoFileInput = document.querySelector(".choose-photo-file-input");
const chosenPhoto = document.querySelector(".chosenPhoto");
const choosePhotoContainer = document.querySelector(".choose-photo-container");
const main = document.querySelector("main");
const nav = document.querySelector("nav");
const controls = document.querySelectorAll('.controls');

main.style.height = `calc(100vh - ${nav.clientHeight}px - 3em)`;

const reset = () => {
    chosenPhoto.style.display = "none";
    choosePhotoFileInput.value = null;
    choosePhotoContainer.style.display = "block";
    document.documentElement.style.setProperty('--photo-bg-color', 'transparent');
};

const choosePhotoBtnHandler = () => {
    choosePhotoFileInput.click();
};

const fileInputOnchangeHandler = () => {
    if (choosePhotoFileInput.files[0]) {
        document.documentElement.style.setProperty('--photo-bg-color', 'white');
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
    const suffix = this.dataset.sizing || '';
    document.documentElement.style.setProperty(`--${this.name}`, this.value);
    console.log(this.value);
    console.log(this.name);
}

controls.forEach(input => input.addEventListener('change', handleUpdate));

reset();

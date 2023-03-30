const choosePhotoBtn = document.querySelector('.choose-photo');
const choosePhotoFileInput = document.querySelector('.choose-photo-file-input');
const chosenPhoto = document.querySelector('.chosenPhoto');

const choosePhotoBtnHandler = () => {
    choosePhotoFileInput.click();
};

const fileInputOnchangeHandler = () => {
    const image = URL.createObjectURL(choosePhotoFileInput.files[0]);
    chosenPhoto.src = image;
    chosenPhoto.onload = () => {
        URL.revokeObjectURL(image);
    }
}
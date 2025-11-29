const fileInput = document.querySelector('.fileInput');
const filterOption = document.querySelectorAll('.upper button[data-filter]');
const previewImage = document.querySelector('#image');
const filterSlider = document.querySelector('.range input');
const filterValue = document.querySelector('.value');
const rotateOption = document.querySelectorAll('.rotate button');
const filterName = document.querySelector('.filter-info .name');
const resetFilterBtn = document.querySelector('.resetbtn');
const chooseImageBtn = document.querySelector('.choosebtn');
const saveImageBtn = document.querySelector('.savebtn');

const loadImage = () => {
    const file = fileInput.files[0];
    if (!file) return;
    previewImage.src = URL.createObjectURL(file);
    previewImage.addEventListener('load', () => {
        resetFilter();
        document.querySelector('.sidebar-container').classList.remove('disabled');
    });
}

let brightness= 100,
    saturation= 100,
    inversion= 0,
    grayscale= 0;

    let rotate = 0, flipHorizontal = 1, flipVertical = 1;

    const applyFilters = () => {
        previewImage.style.filter = `
            brightness(${brightness}%)
            saturate(${saturation}%)
            invert(${inversion}%)
            grayscale(${grayscale}%)
        `;

        previewImage.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;

    }

filterOption.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.sidebar .active')?.classList.remove('active');
        option.classList.add('active');
        filterName.textContent = option.textContent;
    
    });
});

filterOption.forEach(option => {
    option.addEventListener('click', () => {
        document.querySelector('.sidebar .active').classList.remove('active');
        option.classList.add('active');
        const selectedFilter = option.id;

        if(option.id === 'brightness'){
            filterSlider.max = '200';
            filterSlider.value = brightness;
            filterValue.textContent = `${brightness}%`;
        } else if(option.id === 'saturation'){
            filterSlider.max = '200';
            filterSlider.value = saturation;
            filterValue.textContent = `${saturation}%`;
        }   else if(option.id === 'inversion'){
            filterSlider.max = '100';
            filterSlider.value = inversion;
            filterValue.textContent = `${inversion}%`;
        } else{
            filterSlider.max = '100';
            filterSlider.value = grayscale;
            filterValue.textContent = `${grayscale}%`;
        } 
        
    });
});

rotateOption.forEach(option => {
    option.addEventListener('click', () => {
        if(option.id === 'left'){
            rotate -= 90;
        } else if(option.id === 'right'){
            rotate += 90;
        } else if(option.id === 'vertical'){
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else{
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilters();
    });
});

const updateFilter = () => {
    filterValue.textContent = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector('.upper .active').id;

    if(selectedFilter === 'brightness'){
        brightness = filterSlider.value;
    } else if(selectedFilter === 'saturation'){
        saturation = filterSlider.value;
    } else if(selectedFilter === 'inversion'){
        inversion = filterSlider.value;
    } else{
        grayscale = filterSlider.value;
    }  
    
    applyFilters();
}

const resetFilter = () => {
    brightness= 100;
    saturation= 100;
    inversion= 0;
    grayscale= 0;
    rotate = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterOption[0].click();
    applyFilters();
}

fileInput.addEventListener('change', loadImage);
filterSlider.addEventListener('input', updateFilter);
resetFilterBtn.addEventListener('click', resetFilter);
saveImageBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;
    ctx.filter = `
        brightness(${brightness}%)
        saturate(${saturation}%)
        invert(${inversion}%)
        grayscale(${grayscale}%)
    `;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = 'edited-image-photofix-by-aaquib-ahmad.jpg';
    link.href = canvas.toDataURL();
    link.click();


});
chooseImageBtn.addEventListener('click', () => {
    fileInput.click();
});


const cropBtn = document.querySelector(".crop-btn");
const croppiePopup = document.querySelector("#croppie-popup");
const croppieBox = document.querySelector("#croppie-box");
const applyCrop = document.querySelector("#apply-crop");
const cancelCrop = document.querySelector("#cancel-crop");

let croppieInstance = null;

cropBtn.addEventListener("click", () => {
    croppiePopup.style.display = "block";

    if (croppieInstance) {
        croppieInstance.destroy();
    }


    croppieInstance = new Croppie(croppieBox, {
        viewport: { width: 250, height: 250, type: "square" },
        boundary: { width: 300, height: 300 },
        enableResize: true
    });


    croppieInstance.bind({
        url: previewImage.src
    });
});


applyCrop.addEventListener("click", () => {
    croppieInstance.result({
        type: "base64",
        format: "jpeg",
        size: "original"
    })
    .then(cropped => {
        previewImage.src = cropped;  // Replace main image
        croppiePopup.style.display = "none";
    });
});

cancelCrop.addEventListener("click", () => {
    croppiePopup.style.display = "none";
});


const removeBgBtn = document.querySelector(".removebg-btn");

removeBgBtn.addEventListener("click", async () => {
    if (!fileInput.files[0]) {
        alert("Please upload an image first!");
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image_file", file);

    removeBgBtn.textContent = "Processing...";

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": "ZXrhUpdHznYmWbA4oSy5mEj1" },
            body: formData
        });

        const resultBlob = await response.blob();
        const newImageURL = URL.createObjectURL(resultBlob);

        previewImage.src = newImageURL; 

    } catch (error) {
        console.error("Background removal failed:", error);
        alert("Background removal failed!");
    }

    removeBgBtn.textContent = "Done!";
    setTimeout(() => removeBgBtn.textContent = "Remove BG", 1500);
});










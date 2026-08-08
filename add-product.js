/* =========================================================
   BAZVOR — ADD PRODUCT
   FIRESTORE + CLOUDINARY
   ========================================================= */

import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================================
   FIREBASE
   ========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyCc1q9_taS8b-T3FxQmQ12BajjBgvtcmyM",
  authDomain: "bazvor-da3c4.firebaseapp.com",
  projectId: "bazvor-da3c4",
  storageBucket: "bazvor-da3c4.firebasestorage.app",
  messagingSenderId: "59852021286",
  appId: "1:59852021286:web:b6ad6eba476f853b1710e7",
  measurementId: "G-L6JFCT5RDD"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* =========================================================
   CLOUDINARY
   ========================================================= */

const CLOUD_NAME = "vtgcxluf";

const UPLOAD_PRESET = "bazvor_products";

const CLOUDINARY_URL =
  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;


/* =========================================================
   ELEMENTS
   ========================================================= */

const mediaInput =
  document.getElementById("mediaInput");

const mediaPreview =
  document.getElementById("mediaPreview");

const previewImage =
  document.getElementById("previewImage");

const productName =
  document.getElementById("productName");

const brandName =
  document.getElementById("brandName");

const previewName =
  document.getElementById("previewName");

const previewBrand =
  document.getElementById("previewBrand");

const oldPrice =
  document.getElementById("oldPrice");

const salePrice =
  document.getElementById("salePrice");

const previewPrice =
  document.getElementById("previewPrice");

const previewOld =
  document.getElementById("previewOld");

const discountText =
  document.getElementById("discountText");

const discountTextCard =
  document.getElementById("discountTextCard");

const previewCountry =
  document.getElementById("previewCountry");

const freeDelivery =
  document.getElementById("freeDelivery");

const deliveryBadge =
  document.getElementById("deliveryBadge");

const flashBox =
  document.getElementById("flashBox");

const publishBtn =
  document.getElementById("publishBtn");

const saveDraftBtn =
  document.getElementById("saveDraft");


/* =========================================================
   STATE
   ========================================================= */

let selectedFiles = [];

const MAX_FILES = 10;


/* =========================================================
   HELPER
   ========================================================= */

function getValue(id) {

  const element =
    document.getElementById(id);

  if (!element) {
    console.warn("Element not found:", id);
    return "";
  }

  return element.value.trim();
}


/* =========================================================
   MEDIA SELECT
   ========================================================= */

if (mediaInput) {

  mediaInput.addEventListener(
    "change",
    function (event) {

      const files =
        Array.from(
          event.target.files || []
        );

      if (!files.length) return;


      const available =
        MAX_FILES - selectedFiles.length;


      if (available <= 0) {

        alert(
          `Maximum ${MAX_FILES} files allowed.`
        );

        mediaInput.value = "";
        return;
      }


      const filesToAdd =
        files.slice(0, available);


      for (const file of filesToAdd) {

        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) {

          alert(
            `${file.name} is not a supported image/video file.`
          );

          continue;
        }

        selectedFiles.push(file);
      }


      renderMediaPreview();

      mediaInput.value = "";

    }
  );

}


/* =========================================================
   MEDIA PREVIEW
   ========================================================= */

function renderMediaPreview() {

  if (!mediaPreview) return;

  mediaPreview.innerHTML = "";


  selectedFiles.forEach(
    (file, index) => {

      const item =
        document.createElement("div");

      item.className =
        "media-item";


      if (index === 0) {
        item.classList.add("main");
      }


      /* IMAGE */

      if (
        file.type.startsWith("image/")
      ) {

        const img =
          document.createElement("img");

        img.src =
          URL.createObjectURL(file);

        img.alt =
          file.name;

        item.appendChild(img);

      }


      /* VIDEO */

      else if (
        file.type.startsWith("video/")
      ) {

        const video =
          document.createElement("video");

        video.src =
          URL.createObjectURL(file);

        video.muted = true;

        video.playsInline = true;

        video.controls = true;

        item.appendChild(video);

      }


      /* MAIN */

      if (index === 0) {

        const mainLabel =
          document.createElement("div");

        mainLabel.className =
          "main-label";

        mainLabel.textContent =
          "MAIN";

        item.appendChild(mainLabel);
      }


      /* FILE NAME */

      const fileName =
        document.createElement("div");

      fileName.className =
        "media-file-name";

      fileName.textContent =
        file.name;

      fileName.title =
        file.name;

      item.appendChild(fileName);


      mediaPreview.appendChild(item);

    }
  );


  /* MAIN PREVIEW */

  if (selectedFiles.length > 0) {

    const firstFile =
      selectedFiles[0];


    if (
      firstFile.type.startsWith("image/") &&
      previewImage
    ) {

      previewImage.src =
        URL.createObjectURL(firstFile);

      previewImage.style.display =
        "block";

    }

  }

  else if (previewImage) {

    previewImage.removeAttribute("src");

  }

}


/* =========================================================
   PRODUCT NAME LIVE PREVIEW
   ========================================================= */

if (productName && previewName) {

  productName.addEventListener(
    "input",
    function () {

      previewName.textContent =
        productName.value.trim() ||
        "Product Name";

    }
  );

}


/* =========================================================
   BRAND LIVE PREVIEW
   ========================================================= */

if (brandName && previewBrand) {

  brandName.addEventListener(
    "input",
    function () {

      previewBrand.textContent =
        brandName.value.trim() ||
        "Brand Name";

    }
  );

}


/* =========================================================
   DISCOUNT
   ========================================================= */

if (oldPrice) {

  oldPrice.addEventListener(
    "input",
    calculateDiscount
  );

}

if (salePrice) {

  salePrice.addEventListener(
    "input",
    calculateDiscount
  );

}


function calculateDiscount() {

  const old =
    Number(oldPrice?.value) || 0;

  const sale =
    Number(salePrice?.value) || 0;


  if (previewPrice) {
    previewPrice.textContent = sale;
  }

  if (previewOld) {
    previewOld.textContent = old;
  }


  if (
    old > 0 &&
    sale > 0 &&
    sale < old
  ) {

    const discount =
      Math.round(
        ((old - sale) / old) * 100
      );

    const text =
      `-${discount}%`;


    if (discountText) {
      discountText.textContent = text;
    }


    if (discountTextCard) {

      discountTextCard.textContent =
        text;

      discountTextCard.classList.remove(
        "hidden"
      );

    }

  }

  else {

    if (discountText) {
      discountText.textContent = "0%";
    }


    if (discountTextCard) {

      discountTextCard.textContent = "";

      discountTextCard.classList.add(
        "hidden"
      );

    }

  }

}


/* =========================================================
   ORIGIN
   ========================================================= */

const origin =
  document.getElementById("origin");

if (origin) {

  origin.addEventListener(
    "change",
    function (event) {

      if (previewCountry) {

        previewCountry.textContent =
          event.target.value;

      }

    }
  );

}


/* =========================================================
   FREE DELIVERY
   ========================================================= */

if (freeDelivery) {

  freeDelivery.addEventListener(
    "change",
    function () {

      if (!deliveryBadge) return;


      if (freeDelivery.checked) {

        deliveryBadge.textContent =
          "Free Delivery";

      }

      else {

        deliveryBadge.textContent =
          "";

      }

    }
  );

}


/* =========================================================
   FLASH SELL
   ========================================================= */

document
  .querySelectorAll(
    'input[name="type"]'
  )
  .forEach(
    function (radio) {

      radio.addEventListener(
        "change",
        function () {

          if (!flashBox) return;


          if (
            this.checked &&
            this.value === "flash"
          ) {

            flashBox.classList.remove(
              "hidden"
            );

          }

          else {

            flashBox.classList.add(
              "hidden"
            );

          }

        }
      );

    }
  );


/* =========================================================
   CLOUDINARY UPLOAD
   ========================================================= */

async function uploadToCloudinary(
  file,
  index
) {

  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  formData.append(
    "upload_preset",
    UPLOAD_PRESET
  );


  console.log(
    "Cloudinary uploading:",
    file.name
  );


  const response =
    await fetch(
      CLOUDINARY_URL,
      {
        method: "POST",
        body: formData
      }
    );


  let result;


  try {

    result =
      await response.json();

  }

  catch {

    throw new Error(
      "Cloudinary returned an invalid response."
    );

  }


  if (!response.ok) {

    console.error(
      "Cloudinary error:",
      result
    );


    throw new Error(
      result?.error?.message ||
      `Cloudinary upload failed (${response.status})`
    );

  }


  if (!result.secure_url) {

    throw new Error(
      `Cloudinary URL পাওয়া যায়নি: ${file.name}`
    );

  }


  return {

    url:
      result.secure_url,

    type:
      file.type.startsWith("video/")
        ? "video"
        : "image",

    isMain:
      index === 0,

    name:
      file.name,

    fileName:
      file.name,

    publicId:
      result.public_id || "",

    resourceType:
      result.resource_type || "",

    format:
      result.format || "",

    width:
      result.width || null,

    height:
      result.height || null,

    bytes:
      result.bytes || file.size

  };

}


/* =========================================================
   UPLOAD ALL MEDIA
   ========================================================= */

async function uploadMedia() {

  const media = [];


  for (
    let i = 0;
    i < selectedFiles.length;
    i++
  ) {

    const file =
      selectedFiles[i];


    if (publishBtn) {

      publishBtn.textContent =
        `Uploading ${i + 1}/${selectedFiles.length}...`;

    }


    const uploaded =
      await uploadToCloudinary(
        file,
        i
      );


    media.push(uploaded);

  }


  return media;

}


/* =========================================================
   COLLECT PRODUCT DATA
   ========================================================= */

function collectProductData(status) {

  const selectedType =
    document.querySelector(
      'input[name="type"]:checked'
    );


  const type =
    selectedType
      ? selectedType.value
      : "regular";


  const data = {

    name:
      getValue("productName"),

    brand:
      getValue("brandName"),

    sku:
      getValue("sku"),

    category:
      getValue("category"),

    origin:
      getValue("origin"),

    condition:
      getValue("condition"),

    shortDescription:
      getValue("shortDescription"),

    description:
      getValue("description"),


    /* PRICE */

    oldPrice:
      Number(
        getValue("oldPrice")
      ) || 0,

    price:
      Number(
        getValue("salePrice")
      ) || 0,

    wholesalePrice:
      Number(
        getValue("wholesalePrice")
      ) || 0,


    /* STOCK */

    stock:
      Number(
        getValue("stock")
      ) || 0,

    minimumOrder:
      Number(
        getValue("minOrder")
      ) || 1,


    /* VARIANT */

    variant: {

      color:
        getValue("color"),

      size:
        getValue("size")

    },


    /* TYPE */

    type:
      type,

    status:
      status,


    /* REVIEW */

    rating:
      0,

    reviews:
      0,

    reviewList:
      [],

    verified:
      false,


    /* SHIPPING */

    shipping: {

      weight:
        getValue("weight"),

      deliveryTime:
        getValue("deliveryTime"),

      deliveryCharge:
        Number(
          getValue("deliveryCharge")
        ) || 0,

      freeDelivery:
        freeDelivery
          ? freeDelivery.checked
          : false

    },


    /* POLICY */

    returnPolicy:
      getValue("returnPolicy"),

    warranty:
      getValue("warranty"),


    /* CREATED */

    createdAt:
      serverTimestamp()

  };


  /* FLASH SELL */

  if (type === "flash") {

    data.flash = {

      stock:
        Number(
          getValue("flashStock")
        ) || 0,

      start:
        getValue("flashStart"),

      end:
        getValue("flashEnd")

    };

  }


  return data;

}


/* =========================================================
   SAVE PRODUCT
   ========================================================= */

async function saveProduct(status) {

  console.log(
    "saveProduct started:",
    status
  );


  try {

    /* PRODUCT NAME */

    if (
      !productName ||
      !productName.value.trim()
    ) {

      alert(
        "Please enter Product Name."
      );

      productName?.focus();

      return;

    }


    /* MEDIA */

    if (
      selectedFiles.length === 0
    ) {

      alert(
        "Please add at least one product photo."
      );

      return;

    }


    if (
      selectedFiles.length > MAX_FILES
    ) {

      alert(
        `Maximum ${MAX_FILES} files allowed.`
      );

      return;

    }


    /* BUTTON */

    if (publishBtn) {

      publishBtn.disabled =
        true;

      publishBtn.textContent =
        "Uploading...";

    }


    if (saveDraftBtn) {

      saveDraftBtn.disabled =
        true;

    }


    /* =====================================================
       STEP 1
       CLOUDINARY
       ===================================================== */

    console.log(
      "Uploading media to Cloudinary..."
    );


    const media =
      await uploadMedia();


    console.log(
      "Cloudinary upload complete:",
      media
    );


    /* =====================================================
       STEP 2
       PRODUCT DATA
       ===================================================== */

    const productData =
      collectProductData(status);


    /* =====================================================
       STEP 3
       MEDIA DATA
       ===================================================== */

    const imageMedia =
      media.filter(
        item =>
          item.type === "image"
      );


    const videoMedia =
      media.filter(
        item =>
          item.type === "video"
      );


    const images =
      imageMedia.map(
        item => item.url
      );


    const imageNames =
      imageMedia.map(
        item => item.name
      );


    const videos =
      videoMedia.map(
        item => item.url
      );


    const mainMedia =
      media.length > 0
        ? media[0]
        : null;


    const mainImage =
      mainMedia &&
      mainMedia.type === "image"
        ? mainMedia.url
        : "";


    const mainImageName =
      mainMedia &&
      mainMedia.type === "image"
        ? mainMedia.name
        : "";


    /* =====================================================
       ADD MEDIA TO FIRESTORE
       ===================================================== */

    productData.media =
      media;

    productData.images =
      images;

    productData.imageNames =
      imageNames;

    productData.videos =
      videos;

    productData.mainImage =
      mainImage;

    productData.mainImageName =
      mainImageName;

    productData.mainMediaType =
      mainMedia
        ? mainMedia.type
        : "";


    /* =====================================================
       STEP 4
       FIRESTORE
       ===================================================== */

    console.log(
      "Saving product to Firestore..."
    );


    const productRef =
      await addDoc(
        collection(
          db,
          "products"
        ),
        productData
      );


    console.log(
      "Product saved:",
      productRef.id
    );


    /* =====================================================
       SUCCESS
       ===================================================== */

    alert(
      status === "published"
        ? "Product Published Successfully!"
        : "Draft Saved Successfully!"
    );


    location.reload();

  }


  catch (error) {

    console.error(
      "BAZVOR UPLOAD ERROR:",
      error
    );


    alert(
      "Upload Error:\n\n" +
      (
        error?.message ||
        error?.code ||
        String(error)
      )
    );


    /* RESTORE BUTTON */

    if (publishBtn) {

      publishBtn.disabled =
        false;

      publishBtn.textContent =
        "Publish Product";

    }


    if (saveDraftBtn) {

      saveDraftBtn.disabled =
        false;

    }

  }

}


/* =========================================================
   PUBLISH BUTTON
   ========================================================= */

if (publishBtn) {

  publishBtn.addEventListener(
    "click",
    function () {

      console.log(
        "PUBLISH BUTTON CLICKED"
      );

      saveProduct(
        "published"
      );

    }
  );

}


/* =========================================================
   SAVE DRAFT BUTTON
   ========================================================= */

if (saveDraftBtn) {

  saveDraftBtn.addEventListener(
    "click",
    function () {

      console.log(
        "SAVE DRAFT BUTTON CLICKED"
      );

      saveProduct(
        "draft"
      );

    }
  );

}


/* =========================================================
   READY
   ========================================================= */

console.log(
  "BAZVOR ADD PRODUCT JS LOADED"
);

console.log(
  "Firebase Firestore: READY"
);

console.log(
  "Cloudinary: READY"
);

console.log(
  "Cloud Name:",
  CLOUD_NAME
);

console.log(
  "Upload Preset:",
  UPLOAD_PRESET
);
const apiKey = "d8dd6051212745f781065b02656a8d46"; // ضع مفتاح API الخاص بك هنا
const searchInput = document.getElementById("searchInput");
const sourceFilter = document.getElementById("sourceFilter");
const dateFilter = document.getElementById("dateFilter");
const favoritesContainer = document.getElementById("favoritesContainer");

// دالة لجلب الأخبار بناءً على البحث والفلاتر
async function fetchNews(
  query = "technology",
  source = "",
  dateRange = "",
  category = ""
) {
  let url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

  if (source) {
    url += `&sources=${source}`;
  }

  if (category) {
    url += `&category=${category}`;
  }

  if (dateRange) {
    const today = new Date();
    let fromDate;

    if (dateRange === "today") {
      fromDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    } else if (dateRange === "this_week") {
      fromDate = new Date(today.setDate(today.getDate() - 7)).toISOString();
    } else if (dateRange === "this_month") {
      fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString();
    }

    url += `&from=${fromDate}&to=${new Date().toISOString()}`;
  }

  try {
    console.log("Fetching URL:", url); // تسجيل عنوان URL للتصحيح
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      displayNews(data.articles);
    } else {
      newsContainer.innerHTML = "<p>لا توجد أخبار متاحة.</p>";
    }
  } catch (error) {
    console.error("حدث خطأ في جلب الأخبار:", error);
    newsContainer.innerHTML =
      "<p>حدث خطأ أثناء جلب الأخبار. يرجى المحاولة لاحقًا.</p>";
  }
}

// عرض الأخبار على الصفحة
function displayNews(articles) {
  newsContainer.innerHTML = ""; // تفريغ الحاوية قبل عرض الأخبار الجديدة
  articles.forEach((article) => {
    const newsCard = document.createElement("div");
    newsCard.className = "news-card";
    newsCard.innerHTML = `
            <img src="${
              article.urlToImage || "https://via.placeholder.com/300x200"
            }" alt="news image">
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.description || "No Valid Discription"}</p>
                <a href="${article.url}" target="_blank">Show More</a>
                <button class="save-favorite" data-url="${
                  article.url
                }">حفظ كمفضل</button>
            </div>
        `;
    newsContainer.appendChild(newsCard);
  });

  // إضافة مستمع للأحداث للأزرار
  document.querySelectorAll(".save-favorite").forEach((button) => {
    button.addEventListener("click", (event) => {
      const articleUrl = event.target.getAttribute("data-url");
      const article = articles.find((a) => a.url === articleUrl);
      saveFavoriteArticle(article);
    });
  });
}

// دالة لحفظ المقالات المفضلة
function saveFavoriteArticle(article) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some((fav) => fav.url === article.url)) {
    favorites.push(article);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("The Artical Is Saved!");
  } else {
    alert("The Artical Was Saved Before.");
  }
}

// دالة لعرض الأخبار المفضلة
function displayFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p>No Favourite Articals.</p>";
    return;
  }

  favoritesContainer.innerHTML = ""; // تفريغ الحاوية قبل عرض الأخبار الجديدة
  favorites.forEach((article) => {
    const newsCard = document.createElement("div");
    newsCard.className = "news-card";
    newsCard.innerHTML = `
            <img src="${
              article.urlToImage || "https://via.placeholder.com/300x200"
            }" alt="news image">
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.description || "No Valid discription."}</p>
                <a href="${article.url}" target="_blank">Show More</a>
            </div>
        `;
    favoritesContainer.appendChild(newsCard);
  });
}

// دالة لتحديث الأخبار بناءً على البحث والفلاتر
function updateNews() {
  const query = searchInput.value.trim();
  const source = sourceFilter.value;
  const dateRange = dateFilter.value;

  if (query) {
    fetchNews(query, source, dateRange);
  } else {
    fetchNews("technology", source, dateRange); // جلب أخبار افتراضية
  }
}

// إضافة مستمعات للأحداث لمربعات البحث والفلاتر
searchInput.addEventListener("input", updateNews);
sourceFilter.addEventListener("change", updateNews);
dateFilter.addEventListener("change", updateNews);

// جلب الأخبار الافتراضية عند تحميل الصفحة وجلب المصادر
document.addEventListener("DOMContentLoaded", () => {
  updateNews(); // استخدم updateNews بدلاً من fetchNews مباشرة لجلب الأخبار الافتراضية
  displayFavorites(); // عرض الأخبار المفضلة عند تحميل الصفحة
  fetchSources(); // جلب المصادر
});

// جلب قائمة المصادر لفلتر المصدر
async function fetchSources() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines/sources?apiKey=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    data.sources.forEach((source) => {
      const option = document.createElement("option");
      option.value = source.id;
      option.textContent = source.name;
      sourceFilter.appendChild(option);
    });
  } catch (error) {
    console.error("Error in Resourses", error);
  }
}

const themeToggleButton = document.getElementById("themeToggle");

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

// تهيئة الوضع عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
});

themeToggleButton.addEventListener("click", toggleTheme);

const newsContainer = document.getElementById("newsContainer");
const favoritesList = document.getElementById("favoritesList");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// دالة لعرض الأخبار
function displayNews(articles) {
  newsContainer.innerHTML = "";
  articles.forEach((article, index) => {
    const newsCard = document.createElement("div");
    newsCard.className = "news-card";
    newsCard.innerHTML = `
            <img src="${
              article.urlToImage || "https://via.placeholder.com/300x200"
            }" alt="news image">
            <div class="news-card-content">
                <h3>${article.title}</h3>
                <p>${article.description || "No Valid Discription."}</p>
                <a href="${article.url}" target="_blank">Show More</a>
                <button class="save-favorite" data-url="${
                  article.url
                }">Save</button>
            </div>
        `;
    newsContainer.appendChild(newsCard);

    // إضافة مستمع للأزرار
    document.querySelectorAll(".save-favorite").forEach((button) => {
      button.addEventListener("click", (event) => {
        const articleUrl = event.target.getAttribute("data-url");
        const article = articles.find((a) => a.url === articleUrl);
        saveFavoriteArticle(article);
      });
    });
  });
}

// دالة لحفظ المقالات كمفضلات
function saveFavoriteArticle(article) {
  if (!favorites.some((fav) => fav.url === article.url)) {
    favorites.push(article);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  }
}

// دالة لعرض المفضلات
function displayFavorites() {
  favoritesList.innerHTML = "";
  favorites.forEach((article) => {
    const favoriteItem = document.createElement("div");
    favoriteItem.className = "favorite-item";
    favoriteItem.innerHTML = `
            <h3>${article.title}</h3>
            <button data-url="${article.url}">إزالة</button>
        `;
    favoritesList.appendChild(favoriteItem);

    // إضافة مستمع لأزرار الإزالة
    favoriteItem.querySelector("button").addEventListener("click", (event) => {
      const articleUrl = event.target.getAttribute("data-url");
      removeFavoriteArticle(articleUrl);
    });
  });
}

// دالة لإزالة المقالات من المفضلات
function removeFavoriteArticle(url) {
  favorites = favorites.filter((fav) => fav.url !== url);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}

// تهيئة الصفحة
document.addEventListener("DOMContentLoaded", () => {
  displayFavorites();
});

let debounceTimer;

function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(query) ||
      (article.description && article.description.toLowerCase().includes(query))
  );
  displayNews(filteredArticles);
}

const debouncedSearch = debounce(handleSearch, 300);

document
  .getElementById("searchInput")
  .addEventListener("input", debouncedSearch);


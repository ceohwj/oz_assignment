const TRACKED_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "TRXUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "DOTUSDT",
  "LTCUSDT",
  "BCHUSDT",
  "SUIUSDT",
  "TONUSDT",
  "XLMUSDT",
  "UNIUSDT",
  "AAVEUSDT",
  "NEARUSDT",
  "ETCUSDT"
];

const API_URL =
  "https://api4.binance.com/api/v3/ticker/24hr?symbols=" +
  encodeURIComponent(
    JSON.stringify(TRACKED_SYMBOLS)
  );

const STORAGE_KEY =
  "cryptoFavorites";

const REFRESH_INTERVAL = 1000;
const PAGE_SIZE = 50;

/* HTML 요소 가져오기 */

const cryptoList =
  document.getElementById("cryptoList");

const cryptoTable =
  document.getElementById("cryptoTable");

const loading =
  document.getElementById("loading");

const errorMessage =
  document.getElementById("errorMessage");

const emptyMessage =
  document.getElementById("emptyMessage");

const resultCount =
  document.getElementById("resultCount");

const searchInput =
  document.getElementById("searchInput");

const sortSelect =
  document.getElementById("sortSelect");

const allTab =
  document.getElementById("allTab");

const favoritesTab =
  document.getElementById("favoritesTab");

const lastUpdated =
  document.getElementById("lastUpdated");

const pagination =
  document.getElementById("pagination");

const previousPageButton =
  document.getElementById("previousPageButton");

const nextPageButton =
  document.getElementById("nextPageButton");

const pageInfo =
  document.getElementById("pageInfo");

/* 화면 상태 */

let allCryptoData = [];
let favorites = loadFavorites();

let currentTab = "all";
let currentPage = 1;
let isFetching = false;

/* LocalStorage */

function loadFavorites() {
  try {
    const savedFavorites =
      JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        )
      );

    if (Array.isArray(savedFavorites)) {
      return savedFavorites;
    }

    return [];
  } catch (error) {
    console.error(
      "관심 종목 불러오기 실패:",
      error
    );

    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(favorites)
  );
}

function toggleFavorite(symbol) {
  const favoriteIndex =
    favorites.indexOf(symbol);

  if (favoriteIndex === -1) {
    favorites.push(symbol);
  } else {
    favorites.splice(
      favoriteIndex,
      1
    );
  }

  saveFavorites();
  filterAndRender();
}

/* Binance API */

async function fetchCryptoData() {
  /*
    이전 요청이 끝나지 않았다면
    중복 요청을 보내지 않습니다.
  */
  if (isFetching) {
    return;
  }

  isFetching = true;

  try {
    if (allCryptoData.length === 0) {
      loading.hidden = false;
    }

    errorMessage.hidden = true;

    const response = await fetch(
      API_URL,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData =
        await response.json()
          .catch(() => null);

      const message =
        errorData?.msg ||
        `API 요청 실패: ${response.status}`;

      throw new Error(message);
}

    const data =
      await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "API 응답이 배열 형식이 아닙니다."
      );
    }

    allCryptoData = data.filter(
      (item) => {
        const lastPrice =
          Number(item.lastPrice);

        return (
          item.symbol.endsWith("USDT") &&
          Number.isFinite(lastPrice) &&
          lastPrice > 0
        );
      }
    );

    loading.hidden = true;

    lastUpdated.textContent =
      new Date().toLocaleTimeString(
        "ko-KR",
        {
          hour12: false,
        }
      );

    filterAndRender();
  } catch (error) {
    console.error(
      "암호화폐 데이터 요청 오류:",
      error
    );

    loading.hidden = true;

    errorMessage.textContent =
      allCryptoData.length === 0
        ? "데이터를 불러오지 못했습니다. Live Server와 인터넷 연결을 확인해 주세요."
        : "새로운 데이터를 불러오지 못해 이전 데이터를 표시하고 있습니다.";

    errorMessage.hidden = false;

    if (allCryptoData.length === 0) {
      cryptoTable.hidden = true;
      pagination.hidden = true;
    }
  } finally {
    isFetching = false;
  }
}

/* 검색, 탭, 정렬 */

function filterAndRender() {
  const searchTerm =
    searchInput.value
      .trim()
      .toUpperCase();

  let filteredData =
    allCryptoData.filter(
      (item) => {
        return item.symbol.includes(
          searchTerm
        );
      }
    );

  if (currentTab === "favorites") {
    filteredData =
      filteredData.filter(
        (item) => {
          return favorites.includes(
            item.symbol
          );
        }
      );
  }

  filteredData = sortData(
    filteredData
  );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredData.length /
        PAGE_SIZE
      )
    );

  /*
    검색 결과가 줄어들면 현재 페이지가
    마지막 페이지를 넘지 않게 합니다.
  */
  currentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (currentPage - 1) * PAGE_SIZE;

  const endIndex =
    startIndex + PAGE_SIZE;

  const pageData =
    filteredData.slice(
      startIndex,
      endIndex
    );

  renderData(
    pageData,
    filteredData.length,
    totalPages
  );
}

function sortData(data) {
  const copiedData = [...data];

  if (
    sortSelect.value ===
    "change-desc"
  ) {
    return copiedData.sort(
      (a, b) => {
        return (
          Number(b.priceChangePercent) -
          Number(a.priceChangePercent)
        );
      }
    );
  }

  if (
    sortSelect.value ===
    "change-asc"
  ) {
    return copiedData.sort(
      (a, b) => {
        return (
          Number(a.priceChangePercent) -
          Number(b.priceChangePercent)
        );
      }
    );
  }

  if (
    sortSelect.value ===
    "symbol"
  ) {
    return copiedData.sort(
      (a, b) => {
        return a.symbol.localeCompare(
          b.symbol
        );
      }
    );
  }

  return copiedData.sort(
    (a, b) => {
      return (
        Number(b.quoteVolume) -
        Number(a.quoteVolume)
      );
    }
  );
}

/* 화면 출력 */

function renderData(
  data,
  totalCount,
  totalPages
) {
  cryptoList.innerHTML = "";

  if (totalCount === 0) {
    resultCount.textContent =
      "0개 종목";

    cryptoTable.hidden = true;
    pagination.hidden = true;
    emptyMessage.hidden = false;

    emptyMessage.textContent =
      currentTab === "favorites"
        ? "등록된 관심 종목이 없습니다."
        : "검색 결과가 없습니다.";

    return;
  }

  const startNumber =
    (currentPage - 1) *
      PAGE_SIZE +
    1;

  const endNumber =
    Math.min(
      currentPage * PAGE_SIZE,
      totalCount
    );

  resultCount.textContent =
    `${startNumber}-${endNumber} / ` +
    `${totalCount.toLocaleString("ko-KR")}개`;

  emptyMessage.hidden = true;
  cryptoTable.hidden = false;

  const fragment =
    document.createDocumentFragment();

  data.forEach((item) => {
    const row =
      document.createElement("tr");

    const changeClass =
      getChangeClass(
        item.priceChangePercent
      );

    const isFavorite =
      favorites.includes(
        item.symbol
      );

    row.innerHTML = `
      <td>
        <button
          class="favorite-button ${
            isFavorite ? "active" : ""
          }"
          type="button"
          data-symbol="${item.symbol}"
          aria-label="${item.symbol} ${
            isFavorite
              ? "관심 종목에서 제거"
              : "관심 종목에 추가"
          }"
          aria-pressed="${isFavorite}"
        >
          ${isFavorite ? "★" : "☆"}
        </button>
      </td>

      <td class="symbol">
        ${item.symbol}
      </td>

      <td class="price">
        ${formatPrice(item.lastPrice)}
        USDT
      </td>

      <td class="${changeClass}">
        ${formatChangePercent(
          item.priceChangePercent
        )}
      </td>

      <td>
        ${formatPrice(item.highPrice)}
      </td>

      <td>
        ${formatPrice(item.lowPrice)}
      </td>

      <td>
        ${formatVolume(
          item.quoteVolume
        )}
        USDT
      </td>
    `;

    fragment.appendChild(row);
  });

  cryptoList.appendChild(fragment);

  pagination.hidden =
    totalPages <= 1;

  pageInfo.textContent =
    `${currentPage} / ${totalPages} 페이지`;

  previousPageButton.disabled =
    currentPage === 1;

  nextPageButton.disabled =
    currentPage === totalPages;
}

/* 숫자 표시 */

function formatPrice(priceValue) {
  const price =
    Number(priceValue);

  let maximumFractionDigits = 8;

  if (price >= 1000) {
    maximumFractionDigits = 2;
  } else if (price >= 1) {
    maximumFractionDigits = 4;
  } else if (price >= 0.01) {
    maximumFractionDigits = 6;
  }

  return price.toLocaleString(
    "en-US",
    {
      maximumFractionDigits:
        maximumFractionDigits,
    }
  );
}

function formatChangePercent(value) {
  const changePercent =
    Number(value);

  const sign =
    changePercent > 0
      ? "+"
      : "";

  return (
    sign +
    changePercent.toFixed(2) +
    "%"
  );
}

function getChangeClass(value) {
  const changePercent =
    Number(value);

  if (changePercent > 0) {
    return "up";
  }

  if (changePercent < 0) {
    return "down";
  }

  return "same";
}

function formatVolume(value) {
  const volume =
    Number(value);

  return new Intl.NumberFormat(
    "ko-KR",
    {
      notation: "compact",
      maximumFractionDigits: 1,
    }
  ).format(volume);
}

/* 탭 변경 */

function changeTab(nextTab) {
  currentTab = nextTab;
  currentPage = 1;

  const isAllTab =
    nextTab === "all";

  allTab.classList.toggle(
    "active",
    isAllTab
  );

  favoritesTab.classList.toggle(
    "active",
    !isAllTab
  );

  allTab.setAttribute(
    "aria-selected",
    String(isAllTab)
  );

  favoritesTab.setAttribute(
    "aria-selected",
    String(!isAllTab)
  );

  filterAndRender();
}

/* 이벤트 */

cryptoList.addEventListener(
  "click",
  (event) => {
    const favoriteButton =
      event.target.closest(
        ".favorite-button"
      );

    if (!favoriteButton) {
      return;
    }

    const symbol =
      favoriteButton.dataset.symbol;

    toggleFavorite(symbol);
  }
);

searchInput.addEventListener(
  "input",
  () => {
    currentPage = 1;
    filterAndRender();
  }
);

sortSelect.addEventListener(
  "change",
  () => {
    currentPage = 1;
    filterAndRender();
  }
);

allTab.addEventListener(
  "click",
  () => {
    changeTab("all");
  }
);

favoritesTab.addEventListener(
  "click",
  () => {
    changeTab("favorites");
  }
);

previousPageButton.addEventListener(
  "click",
  () => {
    if (currentPage > 1) {
      currentPage -= 1;
      filterAndRender();
    }
  }
);

nextPageButton.addEventListener(
  "click",
  () => {
    currentPage += 1;
    filterAndRender();
  }
);

/* 최초 실행 및 1초 갱신 */

fetchCryptoData();

const refreshTimer =
  setInterval(
    fetchCryptoData,
    REFRESH_INTERVAL
  );

window.addEventListener(
  "beforeunload",
  () => {
    clearInterval(refreshTimer);
  }
);
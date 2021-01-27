// [DOM]

// 알림창
const toastElList = [].slice.call(document.querySelectorAll('.toast'))
const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})

// 검색창
const keyword = document.querySelector("#keyword");

// 이벤트 리스터 추가 (엔터)
keyword.addEventListener(
    "keydown", (e) => {
        if (e.keyCode == 13) {
            find();
        }
    }
);

// 기본 이미지
const defaultImg = document.querySelector("#defaultImg");

// 책 카드 그리드
const bookCardGrid = document.querySelector("#bookCardGrid");

// [데이터]

// 다음 검색 API Key
const restApiKey = "9a9cf8c2b20f08fbbe9bd8f8288861e7";

// Axios (AJAX 통신) 을 통해 API 통신을 위한 인스턴스 생성
const api = axios.create({
    baseURL: "https://dapi.kakao.com/v3/search/book",
    headers: { Authorization: `KakaoAK ${restApiKey}` },
    method: "get",
});

// 검색 헬퍼
function find() {
    const keywordText = keyword.value;

    // 텍스트가 빈 값이라면 에러 알림창 표시
    if (keywordText == "") {
        toastList[0].show();
        // 기본 이미지 보여주기
        defaultImg.classList.remove("d-none");
        bookCardGrid.classList.add("d-none");
        return;
    }

    // console.log(keywordText);

    bookCardGrid.innerHTML = "";
    api({ params: { query: keywordText } })
        .then(function (response) {
            console.log(response);
            response.data.documents.forEach(
                (e) =>
                bookCardGrid.appendChild(
                    makeCard(e)
                ));
        })
        .catch(function (error) {
            console.log(error);
        });

    // 기본 이미지 감추기
    defaultImg.classList.add("d-none");
    bookCardGrid.classList.remove("d-none");
}

// 책 카드 헬퍼
function makeCard(data) {
    // 그리드 열
    const col = document.createElement("div");
    col.classList.add("col");
    // 카드 요소 생성
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("h-100");
    // 좌측
    const left = document.createElement("div");
    left.classList.add("col-lg-4");
    left.classList.add("col-md");
    left.classList.add("d-flex");
    left.classList.add("justify-content-center");
    left.classList.add("align-items-center");
    // - 썸네일 이미지
    const img = document.createElement("img");
    img.setAttribute("src", data.thumbnail);
    img.classList.add("card-img-top");
    img.classList.add("border");
    left.appendChild(img);
    card.appendChild(left);
    // 우측
    const right = document.createElement("div");
    right.classList.add("col-lg-8");
    right.classList.add("col-md");
    // - 카드 바디
    const body = document.createElement("div");
    body.classList.add("card-body");
    // - 타이틀 (책 이름)
    const title = document.createElement("div");
    title.classList.add("card-text");
    title.innerText = data.title;
    body.appendChild(title);
    right.appendChild(body);
    
    const row = document.createElement("div");
    row.classList.add("row");
    row.appendChild(left);
    row.appendChild(right);
    card.appendChild(row);
    col.appendChild(card);
    // console.log(col);
    return col;
}
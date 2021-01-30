// 다음 검색 API Key
const restApiKey = "9a9cf8c2b20f08fbbe9bd8f8288861e7";

// Axios (AJAX 통신) 을 통해 API 통신을 위한 인스턴스 생성
const api = axios.create({
    baseURL: "https://dapi.kakao.com/v3/search/book",
    headers: { Authorization: `KakaoAK ${restApiKey}` },
    method: "get",
});

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

// 검색 창을 통한 검색
function find() {
    const keywordText = keyword.value;

    // 기본 이미지
    const defaultImg = document.querySelector("#defaultImg");
    // 결과 없음 이미지
    const emptyImg = document.querySelector("#emptyImg");
    // 에러 이미지
    const errorImg = document.querySelector("#errorImg");
    // 책 카드 그리드
    const bookCardGrid = document.querySelector("#bookCardGrid");
    // 페이지네이션
    const pagination = document.querySelector("#pagination");
    // 알림창
    const toastElList = [].slice.call(document.querySelectorAll('.toast'));
    const toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl)
    });

    hideAll();

    showEmptyKeywordToast();

    drawGrid(1);

    // 모두 감추기
    function hideAll() {
        defaultImg.classList.add("d-none");
        emptyImg.classList.add("d-none");
        errorImg.classList.add("d-none");
        bookCardGrid.classList.add("d-none");
        pagination.classList.add("d-none");
    }

    // 에러 알림창 표시
    function showEmptyKeywordToast() {
        // 텍스트가 빈 값이라면 에러 알림창 표시
        if (keywordText == "") {
            // 알림창 띄우기
            toastList[0].show();
            // 기본 이미지 보여주기
            defaultImg.classList.remove("d-none");
            return;
        }
    }

    // 그리드 그리기
    function drawGrid(page) {
        bookCardGrid.innerHTML = "";
        pagination.innerHTML = "";
        // console.log(keywordText, page);
        api({ params: { query: keywordText, size: 12, page: page } })
            .then(function (response) {
                // console.log(response);
                // 카드
                const documents = response.data.documents;
                if (documents.length == 0) {
                    emptyImg.classList.remove("d-none");
                    return;
                }
                // console.log(documents.length);
                documents.forEach(
                    (e) =>
                        bookCardGrid.appendChild(
                            drawCard(e)
                        ));
                // 페이지
                const meta = response.data.meta;
                // console.log(meta);
                const last = Math.ceil(meta.pageable_count / 12);
                pagination.appendChild(drawPagination(page, last));
                // 표시하기
                bookCardGrid.classList.remove("d-none");
                pagination.classList.remove("d-none");
            })
            .catch(function (error) {
                // console.log(error);
                errorImg.classList.remove("d-none");
            });
    }

    // 카드 그리기
    function drawCard(data) {
        // 이미지
        const img = document.createElement("img");
        img.setAttribute("src", data.thumbnail ? data.thumbnail : '/01_finder/img/no_thumbnail.png');
        img.classList.add("card-img-top");

        // 카드 바디
        const body = document.createElement("div");
        body.classList.add("card-body");
        // - 타이틀 (책 이름)
        const title = document.createElement("h5");
        title.classList.add("card-text");
        title.classList.add("bold");
        title.innerText = data.title;
        body.appendChild(title);
        // - 저자
        const authors = document.createElement("p");
        authors.classList.add("card-text");
        authors.innerText = data.authors.join(" / ");
        body.appendChild(authors);
        // - 더보기
        const more = document.createElement("a");
        more.classList.add("btn");
        more.classList.add("btn-sm");
        more.classList.add("btn-secondary");
        more.classList.add("mt-1");
        more.setAttribute("href", data.url);
        more.setAttribute("target", "_blank");
        more.innerText = "자세히 보기";
        body.appendChild(more);

        // 카드 요소
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("h-100");
        card.appendChild(img);
        card.appendChild(body);

        // 그리드 열
        const col = document.createElement("div");
        col.classList.add("col");
        col.appendChild(card);
        // console.log(col);
        return col;
    }

    // 페이지네이션 그리기
    function drawPagination(page, last) {
        const ul = document.createElement("ul");
        ul.classList.add("pagination");
        // 5개를 표시한다
        let startIdx = page - 2;
        if (startIdx < 1) {
            startIdx = 1;
        }
        for (let i = 0; i < 5; i++) {
            const idx = startIdx + i;
            // console.log(idx);
            const li = document.createElement("li");
            li.classList.add("page-item");
            if (idx == page) {
                li.classList.add("active");
            } else if (idx > last) {
                li.classList.add("disabled");
            }
            li.innerHTML = `<a class="page-link" href="#">${idx}</a>`;
            if (idx <= last) {
                li.addEventListener("click", () => drawGrid(idx));
            }
            ul.appendChild(li);
        }
        return ul;
    }
};
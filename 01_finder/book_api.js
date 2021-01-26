// 알림창
const toastElList = [].slice.call(document.querySelectorAll('.toast'))
const toastList = toastElList.map(function (toastEl) {
    return new bootstrap.Toast(toastEl)
})

// 검색창
const keyword = document.querySelector("#keyword");
// 이벤트 리스터 추가
keyword.addEventListener(
    "keydown", (e) => {
        if (e.keyCode == 13) {
            find();
        }
    }
);

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
        return;
    }

    console.log(keywordText);

    api({ params: { query: keywordText } })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

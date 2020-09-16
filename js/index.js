var map = L.map('map').setView([0,0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

const marker = L.marker([0,0]).addTo(map);

// 定位使用者
if(navigator.geolocation) {
    // 執行要權限的function
    navigator.geolocation.getCurrentPosition(pos=>{
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;
        map.setView([userLat, userLng], 16);
        // marker.setLatLng([userLat, userLng]).bindPopup("你的位置").openPopup();
    });
} else {
    alert('Sorry, 你的裝置不支援地理位置功能。')
}

// 新增定位
// let geoBtn = document.querySelector("#jsGeoBtn");
// geoBtn.addEventListener("click", function(){
//     map.setView([userLat, userLng], 16);
//     marker.setLatLng([userLat, userLng]).bindPopup("你的位置").openPopup();
// }, false);

// about time
function renderTime(){
    let date = new Date();
    let time;
    console.log(date);
    let mins = date.getMinutes();
    if(mins < 10) {
        mins = "0"+mins;
    }
    let hrs = date.getHours();
    if(hrs < 10) {
        hrs = "0"+hrs;
    }
    document.querySelector(".time").textContent = hrs+":"+mins;
    time = setTimeout(renderTime, 1000);
    document.querySelector(".date").textContent = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}/${date.getDate()}` : `${date.getMonth()+1}/${date.getDate()}`;
    
    let day = date.getDay();
    // let day = 2;
    if(day === 1 || day === 3 || day === 5){
        document.querySelector(".odd").style.display="inline-block";
        document.querySelector(".otherday").style.display="inline-block";
    } else if(day === 2 || day === 4 || day === 6){
        document.querySelector(".even").style.display="inline-block";
        document.querySelector(".otherday").style.display="inline-block";
    } else{
        document.querySelector(".all").style.display="inline-block";
        document.querySelector(".sunday").style.display="inline-block";
    }
    // console.log(day);
    switch(day) {
        case 0:
            day = "日";
            break;
        case 1:
            day = "一";
            break;
        case 2:
            day = "二";
            break;
        case 3:
            day = "三";
            break;
        case 4:
            day = "四";
            break;
        case 5:
            day = "五";
            break;
        case 6:
            day = "六";
            break;
    }
    document.querySelector(".day").textContent = `星期${day}`;
}

var data;

var blueIcon = new L.icon({
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3Aabb29054-dcf5-4306-89b5-a5aedf4dbf45&params=version%3A0&token=1600331139_da39a3ee_15af070838a1176975192454c4471d65ff303750&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [29, 41]
});
var yellowIcon = new L.icon({
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3Acbf096b9-550f-4e78-a2fb-7ae392d3063a&params=version%3A0&token=1600305501_da39a3ee_03861adc5767e95028eb7fd6d3346b46197525cf&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var redIcon = new L.icon({
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3A08388ab3-8c10-45db-ab10-30ac88829ed0&params=version%3A0&token=1600305501_da39a3ee_03861adc5767e95028eb7fd6d3346b46197525cf&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var grayIcon = new L.icon({
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3Aacded1e2-2120-4784-af9a-2754759d68a7&params=version%3A0&token=1600305501_da39a3ee_03861adc5767e95028eb7fd6d3346b46197525cf&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var markers = new L.MarkerClusterGroup().addTo(map);
var xhr = new XMLHttpRequest();
xhr.open("get", "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
xhr.send();
xhr.onload = function(){
    document.querySelector(".loading").style.display = "none";
    data = JSON.parse(xhr.responseText).features;
    // console.log(JSON.parse(xhr.responseText));
    renderList();
    renderMarker();
    addCity();
    // console.log(data);
}
map.addLayer(markers);

function renderMarker(){
    data.forEach(item=>{
        let mask;
        if(item.properties.mask_adult > 100 && item.properties.mask_child > 100){
            mask = blueIcon;
        } else if(item.properties.mask_adult > 0 && item.properties.mask_child > 0){
            mask = yellowIcon;
        } else if(item.properties.mask_adult > 0 || item.properties.mask_child > 0){
            mask = redIcon;
        } else {
            mask = grayIcon;
        }
        markers.addLayer(L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]], {icon: mask}).bindPopup(
            `<li class="info-card">
            <div class="info-top">
                <div class="info-title">${item.properties.name}</div>
                <div class="info-content">
                    <div class="tel">${item.properties.phone}</div>
                    <div class="address">${item.properties.address}</div>
                </div>
                <div class="call">
                    <a href="tel:${item.properties.phone}" class="btn-phone">
                        <img src="./img/btn_phone.svg" alt="">
                    </a>
                </div>
            </div>
            <div class="info-inventory">
                <div class="info-left">
                    成人：<span class="adult-num">${item.properties.mask_adult}</span>
                </div>
                <div class="info-right">
                    兒童：<span class="adult-num">${item.properties.mask_child}</span>
                </div>
            </div>
        </li>`
        ));
    })
}

function renderList(){
    console.log(data);
    let str = "";
    data.forEach(item =>{
        str+= `<li class="info-card">
        <div class="info-top">
            <div class="info-title">${item.properties.name}</div>
            <div class="info-content">
                <div class="tel">${item.properties.phone}</div>
                <div class="address">${item.properties.address}</div>
            </div>
            <div class="call">
                <a href="tel:${item.properties.phone}" class="btn-phone">
                    <img src="./img/btn_phone.svg" alt="">
                </a>
            </div>
        </div>
        <div class="info-inventory">
            <div class="info-left">
                成人：<span class="adult-num">${item.properties.mask_adult}</span>
            </div>
            <div class="info-right">
                兒童：<span class="adult-num">${item.properties.mask_child}</span>
            </div>
        </div>
    </li>`;
    });
    document.querySelector(".force-overflow").innerHTML = str;

    // update date
    document.querySelector(".update").textContent = data[0].properties.updated;
    // console.log(data[0].properrties.updated);
}

// 選單
const cityList = document.querySelector("#cityList");
const countryList = document.querySelector("#countryList");
function addCity(){
    let allZone = [];
    let str = "";
    str = `<option selected disabled value="">請選擇縣市</option>`;
    data.forEach(item=>{
        let cityName = item.properties.county;
        if(allZone.indexOf(cityName) === -1 && cityName !== ""){
            allZone.push(cityName);
            str += `<option value="${cityName}">${cityName}</option>`;
        }
    })
    cityList.innerHTML = str;
}
cityList.addEventListener("change", addCountry);
countryList.innerHTML = `<option selected disabled value="">請選擇鄉鎮市區</option>`;

function addCountry(e){
    let value = e.target.value;
    let str = `<option selected disabled value="">請選擇鄉鎮市區</option>`;
    let allZone = [];
    let newStr = "";
    data.forEach(item=>{
        let countryMatch = item.properties.county;
        if(value === countryMatch){
            allZone.push(item.properties.town);
        }
    })
    newStr = new  Set(allZone);
    newStr = Array.from(newStr);
    newStr.forEach(item=>{
        str += `<option value="${item}">${item}</option>`;
    })
    countryList.innerHTML = str;
    countryList.addEventListener("change", goDistrict);
}

// 定位區域
function goDistrict(e){
    let dist = e.target.value;
    let distLatLng = [];
    let city = "";

    data.forEach(item=>{
        if(item.properties.town === dist && item.properties.county === cityList.value){
            distLatLng = [item.geometry.coordinates[1], item.geometry.coordinates[0]];
            city = item.properties.county;
        }
    })
    map.setView(distLatLng, 16);
    filterList(city, dist);
}

function filterList(city, dist){
    let str = "";
    data.filter(item =>{
        if(item.properties.county === city && item.properties.town === dist){
            console.log(item);
            str+= `<li class="info-card">
            <div class="info-top">
                <div class="info-title">${item.properties.name}</div>
                <div class="info-content">
                    <div class="tel">${item.properties.phone}</div>
                    <div class="address">${item.properties.address}</div>
                </div>
                <div class="call">
                    <a href="tel:${item.properties.phone}" class="btn-phone">
                        <img src="./img/btn_phone.svg" alt="">
                    </a>
                </div>
            </div>
            <div class="info-inventory">
                <div class="info-left">
                    成人：<span class="adult-num">${item.properties.mask_adult}</span>
                </div>
                <div class="info-right">
                    兒童：<span class="adult-num">${item.properties.mask_child}</span>
                </div>
            </div>
        </li>`;
        }
    });
    document.querySelector(".force-overflow").innerHTML = str;

    // update date
    document.querySelector(".update").textContent = data[0].properties.updated;
}

renderTime();
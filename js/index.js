const toggler = document.querySelector("#toggler");
// const mapDom = document.querySelector("#map");
const headerDom = document.querySelector("#header");
toggler.addEventListener("click", function(){
    toggler.parentElement.classList.toggle("active");
    // mapDom.classList.toggle("active");
    headerDom.classList.toggle("active");
    // console.log(toggler.parentElement);
})

var map = L.map('map').setView([0,0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors。版面由UI設計師 <a href="https://www.facebook.com/K.T1003">K.T</a> 提供。'
    }).addTo(map);

const marker = L.marker([0,0]).addTo(map);
let userLat;
let userLng;

// 定位使用者
if(navigator.geolocation) {
    // 執行要權限的function
    navigator.geolocation.getCurrentPosition(pos=>{
        userLat = pos.coords.latitude;
        userLng = pos.coords.longitude;
        map.setView([userLat, userLng], 16);
        marker.setLatLng([userLat, userLng]).bindPopup("<b>你的位置</b>").openPopup();
    });
} else {
    alert('Sorry, 你的裝置不支援地理位置功能。')
}

// 新增定位
let geoBtn = document.querySelector("#jsGeoBtn");
geoBtn.addEventListener("click", function(){
    map.setView([userLat, userLng], 16);
    marker.setLatLng([userLat, userLng]).bindPopup("<b>你的位置</b>").openPopup();
}, false);

// about time
function renderTime(){
    let date = new Date();
    let time;
    // console.log(date);
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
    
    // let day = date.getDay();
    let day = 0;
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
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3Ac8493ec6-f5bf-418d-acd5-24176c8f5943&params=version%3A0&token=1600414285_da39a3ee_db0e28fc272362b09e6c2828f48547667b30afae&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [29, 41]
});
var yellowIcon = new L.icon({
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3A669ebf6b-a97a-4ad8-8259-bc1f48fff75d&params=version%3A0&token=1600414285_da39a3ee_db0e28fc272362b09e6c2828f48547667b30afae&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var redIcon = new L.icon({
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3A6fa9b21f-143e-44aa-a1bb-2dcfa5fbdce5&params=version%3A0&token=1600414285_da39a3ee_db0e28fc272362b09e6c2828f48547667b30afae&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
var grayIcon = new L.icon({
    iconUrl: 'https://public-v2links.adobecc.com/ed8ebf4f-653e-4a8e-764b-1f5e33f4fefb/component?params=component_id%3A9652be29-fff5-4afc-b981-53010fa869cf&params=version%3A0&token=1600414285_da39a3ee_db0e28fc272362b09e6c2828f48547667b30afae&api_key=CometServer1',
    // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/iamges/marker-shadow.png',
    iconSize: [29, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var markers = new L.MarkerClusterGroup().addTo(map);
function getData(){
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
}

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
            `<li class="info-card" data-lat="${item.geometry.coordinates[1]}" data-lng="${item.geometry.coordinates[0]}">
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
        str+= `<li class="info-card" data-lat="${item.geometry.coordinates[1]}" data-lng="${item.geometry.coordinates[0]}">
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
    // 點選卡片掉到地圖定點 1
    let infoCard = document.querySelectorAll(".force-overflow > .info-card");
    clickCard(infoCard);

    // update date
    document.querySelector(".update").textContent = data[0].properties.updated;
    // console.log(data[0].properrties.updated);
}

// 點選卡片掉到地圖定點 2
function clickCard(infoCard){
    infoCard.forEach(item=>{
        item.addEventListener("click", function(e){
            console.log("listen");
            let lat = Number(e.currentTarget.dataset.lat);
            let lng = Number(e.currentTarget.dataset.lng);
            map.setView([lat, lng], 18);
            markers.eachLayer(function(layer){
                const layerLatLng = layer.getLatLng();
                if(layerLatLng.lat === lat && layerLatLng.lng === lng){
                    layer.openPopup();
                }
            })
        })
    })
}

// 選單
const cityList = document.querySelector("#cityList");
const countryList = document.querySelector("#countryList");
function addCity(){
    let allZone = [];
    let str = "";
    str = `<option selected disabled value="">請選擇</option>`;
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
countryList.innerHTML = `<option selected disabled value="">請選擇</option>`;

function addCountry(e){
    let value = e.target.value;
    let str = `<option selected disabled value="">請選擇</option>`;
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
            // console.log(item);
            str+= `<li class="info-card" data-lat="${item.geometry.coordinates[1]}" data-lng="${item.geometry.coordinates[0]}">
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
    let infoCard = document.querySelectorAll(".force-overflow > .info-card");
    clickCard(infoCard);

    // update date
    document.querySelector(".update").textContent = data[0].properties.updated;
}

function init(){
    renderTime();
    getData();
}

init();
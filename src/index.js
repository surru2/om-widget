
const uuid = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
let objectId, cadNum, clientID, upload = false, sections = [], newUrls = []
const headers = { 'Content-Type': 'application/json' }
const object = {
    building: {
        description: 'Дом, в котором расположена квартира/комната/апартаменты',
        items: {
            facade: {
                description: 'Фасад жилого дома',
                shortDescription: 'Фасад жилого дома',
                photos: [],
                required: true
            },
            houseNumber: {
                description: 'Табличка с адресным ориентиром дома',
                shortDescription: 'Табличка с адресным ориентиром дома',
                photos: [],
                required: false
            },
            porch: {
                description: 'Вид со стороны подъезда',
                shortDescription: 'Вид со стороны подъезда',
                photos: [],
                required: false
            },
            porchDoor: {
                description: 'Входная дверь в подъезд (с захватом таблички с номером подъезда, при наличии таблички)',
                shortDescription: 'Входная дверь в подъезд',
                photos: [],
                required: false
            },
            houseNumberPlate: {
                description: 'Вывеска с адресом и номером дома (при наличии)',
                shortDescription: 'Вывеска с адресом и номером дома',
                photos: [],
                required: false
            },
            firstFloor: {
                description: 'Подъезд на 1-м этаже',
                shortDescription: 'Подъезд на 1-м этаже',
                photos: [],
                required: false
            },
            apartmentFloor: {
                description: 'Подъезд на этаже квартиры',
                shortDescription: 'Подъезд на этаже квартиры',
                photos: [],
                required: false
            },
            elevator: {
                description: 'Лифт (при наличии)',
                shortDescription: 'Лифт',
                photos: [],
                required: false
            }
        }
    },
    apartment: {
        description: 'Квартира',
        items: {
            entranceDoor: {
                description: 'Входная дверь в квартиру (снаружи)',
                shortDescription: 'Дверь в квартиру',
                photos: [],
                required: false
            },
            corridor: {
                description: ' Коридор: фото в обе стороны, чтобы было видно дверные проёмы в другие части квартиры',
                shortDescription: 'Коридор',
                photos: [],
                required: false
            },
            bathroom: {               
                description: 'Ванная комната: общий вид с захватом расположения раковины и ванны на одном фото (если с/у совмещен, должно быть идентифицируемо на фото)',
                shortDescription: 'Ванная комната',
                photos: [],
                required: false
            },
            porchDoor: {
                description: 'Входная дверь в подъезд (с захватом таблички с номером подъезда, при наличии таблички)',
                shortDescription: 'Дверь в подъезд',
                photos: [],
                required: false
            },
            wc: {
                description: 'Уборная – WC (если с/у совмещен, должно быть идентифицируемо на фото)',
                shortDescription: 'Уборная',
                photos: [],
                required: false
            },
            kitchen: {
                description: 'Кухня: фото в обе стороны (общий вид с захватом оконного проема и общий вид в обратную сторону с захватом дверного проема)',
                shortDescription: 'Кухня',
                photos: [],
                required: false
            },
            kitchenSet: {
                description: 'Фото плиты (ракурс обзора кухонного гарнитура)',
                shortDescription: 'Плита',
                photos: [],
                required: false
            },
            balcony: {
                description: 'Балкон на кухне (при наличии, фото должно идентифицировать наличие/отсутствие факта совмещения лоджии и кухни)',
                shortDescription: 'Балкон',
                photos: [],
                required: false
            },
            kitchenRadiator: {
                description: 'Батарея на кухне',
                shortDescription: 'Батарея на кухне',
                photos: [],
                required: false
            },
            rooms: {
                description: 'По каждой жилой комнате: общий вид в обе стороны, оконный проем (фото должно идентифицировать наличие/отсутствие факта совмещения лоджии и жилого помещения), батарея отопления, вид из окна',
                shortDescription: 'Жилая комната',
                photos: [],
                addMore: false,
                required: false
            },
            utilityRoom: {
                description: 'Подсобные помещения: общий вид в обе стороны',
                shortDescription: 'Подсобное помещение',
                photos: [],
                required: false
            }
        }
    },
    video: {
        description: 'Видео',
        items: {
            video: {
                description: 'Короткое видео квартиры с отражением: входная дверь, коридор, с/у, кухня, жилые помещения',
                shortDescription: 'Видео квартиры',
                photos: [],
                required: false
            }
        }
    }
}

const setBody = (object) => {
    const photos = localStorage.getItem(cadNum) ? JSON.parse(localStorage.getItem(cadNum)) : null
    clientID = photos ? JSON.parse(localStorage.getItem(cadNum)).clientID : uuid()
    clientID = uuid()
    let card = ``
    /*let success = true;
    if (photos) {
        Object.keys(object).forEach(function (_item) {
            Object.keys(object[_item].items).forEach(function (key) {
                const reqItem = object[_item].items[key]
                if (reqItem.required)
                    if (!photos[_item] || !photos[_item][key] || (reqItem.required && !photos[_item][key].length)) success = false
            })
        })
        if (success) document.getElementById('uploadBtn').style.display = "block"
    }*/
    Object.keys(object).forEach(function (_item) {
        sections.push({ id: _item, index: 0 })
        card +=    
        `<article class="card radius shadow" id="${_item}">`;
        Object.keys(object[_item].items).forEach(function (key, index, arr) {
        card +=` 
            <section id="${_item}.${key}">
                <div class="card_padding" style="text-decoration: none; color: #444;transition: all 0.5s ease;">
                <div class="card_add">
                    ${index ? '<span class="prev-toggle icon prevBtn"></span>' : ''}                            
                    ${index < arr.length - 1 ? '<span class="next-toggle icon nextBtn"></span>' : ''}           
                </div>
                ${object[_item].items[key].description}
                <div class="photo_controls">
                    <span id="add" class="close-toggle controls"></span>
                    <span id="add" class="remove-toggle controls"></span>
                </div>
                </div>
                <div class="photos height">`
            if (photos && _item in photos)
                if (key in photos[_item])
                    photos[_item][key].forEach(photo => {
                        card += `<div class="photo card_padding"><img id="${photo.id}" class="photoImg" src="${_item === 'video' ? '/images/video.png' : photo.url}"></div>`
                    })    
        card +=`              
                </div>
                <div class="card_image border-tlr-radius" style="display:none;">
                    <img src="" alt="image" class="border-tlr-radius">
                </div>  
                <div class="card_content card_padding">
                    <div class="card_add uploadBtn">
                        <input class="uploadInput" style="display:none;" type="file" id="${_item}.${key}.upload">
                        <span id="add" class="add-toggle plus"></span>
                    </div>

                    <article>
                    <p>${object[_item].description}</p>
                    </article>
                </div>
            </section>`
        })
        card+=`</article>`
    });
    document.getElementById('content').innerHTML = card;
    sections.map(section =>document.querySelector(`#${section.id}>section`).style.display = "block")
    
    document.getElementById('uploadBtn').addEventListener('click', e => uploadPhotos(e))

    Array.from(document.getElementsByClassName('close-toggle')).forEach(close => 
        close.addEventListener('click', e => closePhoto(e))
    )

    Array.from(document.getElementsByClassName('remove-toggle')).forEach(remove => 
        remove.addEventListener('click', e => removeImg(e))    
    )

    Array.from(document.getElementsByClassName('nextBtn')).forEach(nextBtn => 
        nextBtn.addEventListener('click', e => nextSection(e))
    )

    Array.from(document.getElementsByClassName('prevBtn')).forEach(prevBtn => 
        prevBtn.addEventListener('click', e => prevSection(e))
    )

    Array.from(document.getElementsByClassName('photoImg')).forEach(photoImg => 
        photoImg.addEventListener('click', e => showPhoto(e))
    )

    Array.from(document.getElementsByClassName('uploadBtn')).forEach(uploadBtn => 
        uploadBtn.addEventListener('click', e =>{ e.target.parentNode.querySelector('input').click()})
    )

    Array.from(document.getElementsByClassName('deleteImg')).forEach(deleteImg => 
        deleteImg.addEventListener('change', e => showRemoveBtn(e))
    )

    Array.from(document.getElementsByClassName('uploadInput')).forEach(uploadInput => {
        uploadInput.addEventListener("change", async function (e) {
            if (!this.files.length) return
            if (!~this.files[0].type.indexOf('video') && this.id.split('.')[0] === 'video') {
                showSnackbar('Данный формат видео не поддерживается')
                return
            }
            if (!~this.files[0].type.indexOf('image') && this.id.split('.')[0] !== 'video') {
                showSnackbar('Данный формат изображения не поддерживается')
                return
            }
            const photos = this.parentElement.parentElement
            const div = document.createElement('div')
            div.classList.add('photo')
            div.classList.add('card_padding')
            div.classList.add('lds-dual-ring')

            document.querySelector(`#${this.id.split('.')[0]}>section[id="${this.id.split('.')[0]}.${this.id.split('.')[1]}"]>.photos`).append(div)

            const picId = uuid()
            const type = this.files[0].name.split('.')[this.files[0].name.split('.').length - 1]
            const filePath = `om-zenit/${clientID}/${picId}.${type}`
            let url = `https://storage.yandexcloud.net/${filePath}`
            let a = await fetch(url, { method: 'PUT', body: this.files[0] })
            if(!a.ok){
                showSnackbar('Не удалось загрузить фото, попробуйте ещё раз')
                return
            }
            div.classList.remove("lds-dual-ring")
            div.innerHTML = `<img id="${picId}" src="${this.id.split('.')[0] === 'video' ? '/images/video.png' : url}">`
            div.querySelector('img').addEventListener('click', e => showPhoto(e))

            let captionObj = this.id
            let caption = object[captionObj.split('.')[0]].items[captionObj.split('.')[1]].shortDescription
            let addMore = object[captionObj.split('.')[0]].items[captionObj.split('.')[1]].addMore
   
            let picture
            if (localStorage.getItem(cadNum)) {
                picture = JSON.parse(localStorage.getItem(cadNum))
                if (!picture[this.id.split('.')[0]]) {
                    picture[this.id.split('.')[0]] = JSON.parse(`{
                                "${this.id.split('.')[1]}": [{
                                    "caption": "${caption}",
                                    "src": "zenit.ru",
                                    "url": "${url}",
                                    "name": "${this.files[0].name}",
                                    "type": "${this.files[0].type}",
                                    "size": ${this.files[0].size},
                                    "modified": "${new Date().toISOString()}"
                                }]
                            }`)
                } else {
                    if (!picture[this.id.split('.')[0]][this.id.split('.')[1]]) {
                        Object.assign(picture[this.id.split('.')[0]], JSON.parse(`{
                                    "${this.id.split('.')[1]}": [{
                                        "caption": "${caption}",
                                        "src": "zenit.ru",
                                        "url": "${url}",
                                        "name": "${this.files[0].name}",
                                        "type": "${this.files[0].type}",
                                        "size": ${this.files[0].size},
                                        "modified": "${new Date().toISOString()}"
                                    }]
                                }`));
                    } else {
                        picture[this.id.split('.')[0]][this.id.split('.')[1]].push({
                            "caption": caption,
                            "src": "zenit.ru",
                            "url": url,
                            "name": this.files[0].name,
                            "type": this.files[0].type,
                            "size": this.files[0].size,
                            "modified": new Date().toISOString()
                        })
                    }
                }
            } else {
                picture = JSON.parse(`{"${this.id.split('.')[0]}": 
                            {
                                "${this.id.split('.')[1]}": [{
                                    "caption": "${caption}",
                                    "src": "zenit.ru",
                                    "url": "${url}",
                                    "name": "${this.files[0].name}",
                                    "type": "${this.files[0].type}",
                                    "size": ${this.files[0].size},
                                    "modified": "${new Date().toISOString()}"
                                }]
                            },
                            "clientID": "${clientID}"
                        }`)
            }
            localStorage.setItem(cadNum, JSON.stringify(picture));
            let success = true
            /*Object.keys(object).forEach(function (_item) {
                Object.keys(object[_item].items).forEach(function (key) {
                    const reqItem = object[_item].items[key]
                    if (reqItem.required)
                        if (!picture[_item] || !picture[_item][key] || (reqItem.required && !picture[_item][key].length)) success = false
                })
            })*/
            if (success) document.getElementById('uploadBtn').style.display = "block"
            newUrls.push(picId)
            if (addMore) {
                    document.getElementById('addMore').style.display = 'block'
                    document.getElementById('yesBtn').onclick = () => {
                    document.getElementById(this.id).click()
                    document.getElementById('addMore').style.display = 'none'
                }
            }
        })
    })
}
document.addEventListener('DOMContentLoaded', async () => {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        var viewportmeta = document.querySelector('meta[name="viewport"]');
        if (viewportmeta) {
            viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
            document.body.addEventListener('gesturestart', function () {
                viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
            }, false);
        }
    }

    document.getElementById('cadNum').addEventListener('keyup', e => {
        if (!e.target.checkValidity()) {
            document.getElementById('formCadNum').reportValidity()
            e.target.value = e.target.value.slice(0, -1)
        }
    })

    document.getElementById('noBtn').addEventListener('click', e => document.getElementById('addMore').style.display='none')
    
    document.querySelector('#searchBtn').addEventListener('click', async e => {
        document.body.style.webkitTransform = 1;    // Chrome, Opera, Safari
        document.body.style.msTransform = 1;       // IE 9
        document.body.style.transform = 1;     // General
        const cadnum = document.getElementById('cadNum').value
        if (!cadnum.match(/^\s*0{0,10}\d{1,10}:0{0,10}\d{1,10}:0{0,10}\d{1,10}:0{0,10}\d{1,10}\s*$/)) {
            showSnackbar('Неверный формат ввода')
            return;
        }
        cadNum = cadnum.split(':').reduce((x, i) => {
            return x += parseInt(i) + ':'
        }, '').slice(0, -1)
        let response = await fetch(`/.netlify/functions/searchZenitByCadNum?cadNum=${cadNum}`)
        response = await response.json();
        if (response.error){
            document.getElementById('content').innerHTML = ''
            showSnackbar(response.error)
            return
        }
        if (response.id) {
            objectId = response.id
            setBody(object)
        } else {
            showSnackbar('Кредитная заявка с указанным кадастровым номером не найдена. Проверьте номер или обратитесь к вашему кредитному менеджеру.')
        }
    })
});

const showPhoto = (e) => {
    const parent = e.target.parentNode.parentNode.parentNode
    parent.querySelector('div>.photo_controls').style.display = 'block'
    parent.querySelector('.photos').style.display = 'none'
    parent.querySelector('.card_image').style.display = 'block'
    parent.querySelector('.card_image>img').src = e.target.src
    parent.querySelector('.card_image>img').name = e.target.id
}

const closePhoto = (e) => {
    const parent = e.target.parentNode.parentNode
    parent.querySelector('div>.photo_controls').style.display = 'none'
    parent.parentNode.querySelector('.photos').style.display = 'grid'
    parent.parentNode.querySelector('.card_image').style.display = 'none'
    parent.parentNode.querySelector('.card_image>img').src = '' 
    parent.parentNode.querySelector('.card_image>img').name = '' 
}

const removeImg = async (e) => {
    const parent = e.target.parentNode.parentNode.parentNode
    const type = parent.id
    const photosDiv = parent.querySelector('.photos')
    const photoId = parent.querySelector('.card_image>img').name
    const photoDiv = photosDiv.querySelector(`.photo>img[id="${photoId}"]`).parentNode

    photosDiv.removeChild(photoDiv)

    let obj = JSON.parse(localStorage.getItem(cadNum))
    let rmIndex = obj[type.split('.')[0]][type.split('.')[1]].findIndex(i => i.id == photoId)
    obj[type.split('.')[0]][type.split('.')[1]].splice(rmIndex, 1)
    localStorage.setItem(cadNum, JSON.stringify(obj))

    if (~newUrls.indexOf(photoId))
        newUrls.splice(newUrls.indexOf(photoId), 1)
    if (!newUrls.length) document.getElementById('uploadBtn').style.display = "none"
    /*let success = true
    Object.keys(object).forEach(function (_item) {
        Object.keys(object[_item].items).forEach(function (key) {
            const reqItem = object[_item].items[key]
            if (reqItem.required)
                if (!obj[_item] || !obj[_item][key] || (reqItem.required && !obj[_item][key].length)) success = false
        })
    })
    if (!success) document.getElementById('uploadBtn').style.display = "none"*/
    closePhoto(e)
}

const showSnackbar = (message) => {
    const snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = message;
    snackbar.className = "show";
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

const nextSection = (e) => {
    let id = e.target.parentElement.parentElement.parentElement.parentElement.id
    let sectionElem = document.querySelectorAll(`#${id}>section`)
    if (sections[sections.findIndex(i => i.id == id)].index < sectionElem.length - 1) {
        sectionElem[sections[sections.findIndex(i => i.id == id)].index].style.display = "none"
        sections[sections.findIndex(i => i.id == id)].index += 1
        sectionElem[sections[sections.findIndex(i => i.id == id)].index].style.display = "block"
    }
    closePhoto(e)
}

const prevSection = (e) => {
    let id = e.target.parentElement.parentElement.parentElement.parentElement.id
    let sectionElem = document.querySelectorAll(`#${id}>section`)
    if (sections[sections.findIndex(i => i.id == id)].index < sectionElem.length && sections[sections.findIndex(i => i.id == id)].index > 0) {
        sectionElem[sections[sections.findIndex(i => i.id == id)].index].style.display = "none"
        sections[sections.findIndex(i => i.id == id)].index -= 1
        sectionElem[sections[sections.findIndex(i => i.id == id)].index].style.display = "block"
    }
    closePhoto(e)
}

const uploadPhotos = async (e) => {
    if(upload) return
    let pictures = JSON.parse(localStorage.getItem(cadNum))
    const photoArray = []
    Object.keys(pictures).forEach(function (_item) {
        if (typeof pictures[_item]==='object')
            Object.keys(pictures[_item]).forEach(key=>{
                pictures[_item][key].forEach(x => photoArray.push(x))
            })
    })
    upload = true
    let api = await fetch('/.netlify/functions/postZenitFiles', { method: 'POST', headers, body: JSON.stringify({ id: objectId, photoArray }) })
    api = await api.json()
    upload = false
    api.status ? document.getElementById('content').innerHTML = `<span class="reportDone">Фотографии успешно добавлены</span>` : (showSnackbar(api.error))
    api.status && (document.getElementById('uploadBtn').style.display = "none")
    api.status && localStorage.removeItem(cadNum);
}


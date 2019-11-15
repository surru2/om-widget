"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var uuid = function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
  });
};

var objectId,
    cadNum,
    clientID,
    upload = false,
    sections = [],
    newUrls = [];
var headers = {
  'Content-Type': 'application/json'
};
var object = {
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
};

var setBody = function setBody(object) {
  var photos = localStorage.getItem(cadNum) ? JSON.parse(localStorage.getItem(cadNum)) : null;
  clientID = photos ? JSON.parse(localStorage.getItem(cadNum)).clientID : uuid();
  clientID = uuid();
  var card = "";
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
    sections.push({
      id: _item,
      index: 0
    });
    card += "<article class=\"card radius shadow\" id=\"".concat(_item, "\">");
    Object.keys(object[_item].items).forEach(function (key, index, arr) {
      card += " \n            <section id=\"".concat(_item, ".").concat(key, "\">\n                <div class=\"card_padding\" style=\"text-decoration: none; color: #444;transition: all 0.5s ease;\">\n                <div class=\"card_add\">\n                    ").concat(index ? '<span class="prev-toggle icon prevBtn"></span>' : '', "                            \n                    ").concat(index < arr.length - 1 ? '<span class="next-toggle icon nextBtn"></span>' : '', "           \n                </div>\n                ").concat(object[_item].items[key].description, "\n                <div class=\"photo_controls\">\n                    <span id=\"add\" class=\"close-toggle controls\"></span>\n                    <span id=\"add\" class=\"remove-toggle controls\"></span>\n                </div>\n                </div>\n                <div class=\"photos height\">");
      if (photos && _item in photos) if (key in photos[_item]) photos[_item][key].forEach(function (photo) {
        card += "<div class=\"photo card_padding\"><img id=\"".concat(photo.id, "\" class=\"photoImg\" src=\"").concat(_item === 'video' ? '/images/video.png' : photo.url, "\"></div>");
      });
      card += "              \n                </div>\n                <div class=\"card_image border-tlr-radius\" style=\"display:none;\">\n                    <img src=\"\" alt=\"image\" class=\"border-tlr-radius\">\n                </div>  \n                <div class=\"card_content card_padding\">\n                    <div class=\"card_add uploadBtn\">\n                        <input class=\"uploadInput\" style=\"display:none;\" type=\"file\" id=\"".concat(_item, ".").concat(key, ".upload\">\n                        <span id=\"add\" class=\"add-toggle plus\"></span>\n                    </div>\n\n                    <article>\n                    <p>").concat(object[_item].description, "</p>\n                    </article>\n                </div>\n            </section>");
    });
    card += "</article>";
  });
  document.getElementById('content').innerHTML = card;
  sections.map(function (section) {
    return document.querySelector("#".concat(section.id, ">section")).style.display = "block";
  });
  document.getElementById('uploadBtn').addEventListener('click', function (e) {
    return uploadPhotos(e);
  });
  Array.from(document.getElementsByClassName('close-toggle')).forEach(function (close) {
    return close.addEventListener('click', function (e) {
      return closePhoto(e);
    });
  });
  Array.from(document.getElementsByClassName('remove-toggle')).forEach(function (remove) {
    return remove.addEventListener('click', function (e) {
      return removeImg(e);
    });
  });
  Array.from(document.getElementsByClassName('nextBtn')).forEach(function (nextBtn) {
    return nextBtn.addEventListener('click', function (e) {
      return nextSection(e);
    });
  });
  Array.from(document.getElementsByClassName('prevBtn')).forEach(function (prevBtn) {
    return prevBtn.addEventListener('click', function (e) {
      return prevSection(e);
    });
  });
  Array.from(document.getElementsByClassName('photoImg')).forEach(function (photoImg) {
    return photoImg.addEventListener('click', function (e) {
      return showPhoto(e);
    });
  });
  Array.from(document.getElementsByClassName('uploadBtn')).forEach(function (uploadBtn) {
    return uploadBtn.addEventListener('click', function (e) {
      e.target.parentNode.querySelector('input').click();
    });
  });
  Array.from(document.getElementsByClassName('deleteImg')).forEach(function (deleteImg) {
    return deleteImg.addEventListener('change', function (e) {
      return showRemoveBtn(e);
    });
  });
  Array.from(document.getElementsByClassName('uploadInput')).forEach(function (uploadInput) {
    uploadInput.addEventListener("change", function (e) {
      return new Promise(function ($return, $error) {
        var _this, photos, div, picId, type, filePath, url, a, captionObj, caption, addMore, picture, success;

        _this = this;
        if (!this.files.length) return $return();

        if (!~this.files[0].type.indexOf('video') && this.id.split('.')[0] === 'video') {
          showSnackbar('Данный формат видео не поддерживается');
          return $return();
        }

        if (!~this.files[0].type.indexOf('image') && this.id.split('.')[0] !== 'video') {
          showSnackbar('Данный формат изображения не поддерживается');
          return $return();
        }

        photos = this.parentElement.parentElement;
        div = document.createElement('div');
        div.classList.add('photo');
        div.classList.add('card_padding');
        div.classList.add('lds-dual-ring');
        document.querySelector("#".concat(this.id.split('.')[0], ">section[id=\"").concat(this.id.split('.')[0], ".").concat(this.id.split('.')[1], "\"]>.photos")).append(div);
        picId = uuid();
        type = this.files[0].name.split('.')[this.files[0].name.split('.').length - 1];
        filePath = "om-zenit/".concat(clientID, "/").concat(picId, ".").concat(type);
        url = "https://storage.yandexcloud.net/".concat(filePath);
        return Promise.resolve(fetch(url, {
          method: 'PUT',
          body: this.files[0]
        })).then(function ($await_1) {
          try {
            a = $await_1;

            if (!a.ok) {
              showSnackbar('Не удалось загрузить фото, попробуйте ещё раз');
              return $return();
            }

            div.classList.remove("lds-dual-ring");
            div.innerHTML = "<img id=\"".concat(picId, "\" src=\"").concat(this.id.split('.')[0] === 'video' ? '/images/video.png' : url, "\">");
            div.querySelector('img').addEventListener('click', function (e) {
              return showPhoto(e);
            });
            captionObj = this.id;
            caption = object[captionObj.split('.')[0]].items[captionObj.split('.')[1]].shortDescription;
            addMore = object[captionObj.split('.')[0]].items[captionObj.split('.')[1]].addMore;

            if (localStorage.getItem(cadNum)) {
              picture = JSON.parse(localStorage.getItem(cadNum));

              if (!picture[this.id.split('.')[0]]) {
                picture[this.id.split('.')[0]] = JSON.parse("{\n                                \"".concat(this.id.split('.')[1], "\": [{\n                                    \"caption\": \"").concat(caption, "\",\n                                    \"src\": \"zenit.ru\",\n                                    \"url\": \"").concat(url, "\",\n                                    \"name\": \"").concat(this.files[0].name, "\",\n                                    \"type\": \"").concat(this.files[0].type, "\",\n                                    \"size\": ").concat(this.files[0].size, ",\n                                    \"modified\": \"").concat(new Date().toISOString(), "\"\n                                }]\n                            }"));
              } else {
                if (!picture[this.id.split('.')[0]][this.id.split('.')[1]]) {
                  Object.assign(picture[this.id.split('.')[0]], JSON.parse("{\n                                    \"".concat(this.id.split('.')[1], "\": [{\n                                        \"caption\": \"").concat(caption, "\",\n                                        \"src\": \"zenit.ru\",\n                                        \"url\": \"").concat(url, "\",\n                                        \"name\": \"").concat(this.files[0].name, "\",\n                                        \"type\": \"").concat(this.files[0].type, "\",\n                                        \"size\": ").concat(this.files[0].size, ",\n                                        \"modified\": \"").concat(new Date().toISOString(), "\"\n                                    }]\n                                }")));
                } else {
                  picture[this.id.split('.')[0]][this.id.split('.')[1]].push({
                    "caption": caption,
                    "src": "zenit.ru",
                    "url": url,
                    "name": this.files[0].name,
                    "type": this.files[0].type,
                    "size": this.files[0].size,
                    "modified": new Date().toISOString()
                  });
                }
              }
            } else {
              picture = JSON.parse("{\"".concat(this.id.split('.')[0], "\": \n                            {\n                                \"").concat(this.id.split('.')[1], "\": [{\n                                    \"caption\": \"").concat(caption, "\",\n                                    \"src\": \"zenit.ru\",\n                                    \"url\": \"").concat(url, "\",\n                                    \"name\": \"").concat(this.files[0].name, "\",\n                                    \"type\": \"").concat(this.files[0].type, "\",\n                                    \"size\": ").concat(this.files[0].size, ",\n                                    \"modified\": \"").concat(new Date().toISOString(), "\"\n                                }]\n                            },\n                            \"clientID\": \"").concat(clientID, "\"\n                        }"));
            }

            localStorage.setItem(cadNum, JSON.stringify(picture));
            success = true;

            /*Object.keys(object).forEach(function (_item) {
                Object.keys(object[_item].items).forEach(function (key) {
                    const reqItem = object[_item].items[key]
                    if (reqItem.required)
                        if (!picture[_item] || !picture[_item][key] || (reqItem.required && !picture[_item][key].length)) success = false
                })
            })*/
            if (success) document.getElementById('uploadBtn').style.display = "block";
            newUrls.push(picId);

            if (addMore) {
              document.getElementById('addMore').style.display = 'block';

              document.getElementById('yesBtn').onclick = function () {
                document.getElementById(_this.id).click();
                document.getElementById('addMore').style.display = 'none';
              };
            }

            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }.bind(this), $error);
      }.bind(this));
    });
  });
};

document.addEventListener('DOMContentLoaded', function () {
  return new Promise(function ($return, $error) {
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
      var viewportmeta = document.querySelector('meta[name="viewport"]');

      if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
        document.body.addEventListener('gesturestart', function () {
          viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
        }, false);
      }
    }

    document.getElementById('cadNum').addEventListener('keyup', function (e) {
      if (!e.target.checkValidity()) {
        document.getElementById('formCadNum').reportValidity();
        e.target.value = e.target.value.slice(0, -1);
      }
    });
    document.getElementById('noBtn').addEventListener('click', function (e) {
      return document.getElementById('addMore').style.display = 'none';
    });
    document.querySelector('#searchBtn').addEventListener('click', function (e) {
      return new Promise(function ($return, $error) {
        var cadnum, response;
        document.body.style.webkitTransform = 1; // Chrome, Opera, Safari

        document.body.style.msTransform = 1; // IE 9

        document.body.style.transform = 1; // General

        cadnum = document.getElementById('cadNum').value;

        if (!cadnum.match(/^\s*0{0,10}\d{1,10}:0{0,10}\d{1,10}:0{0,10}\d{1,10}:0{0,10}\d{1,10}\s*$/)) {
          showSnackbar('Неверный формат ввода');
          return $return();
        }

        cadNum = cadnum.split(':').reduce(function (x, i) {
          return x += parseInt(i) + ':';
        }, '').slice(0, -1);
        return Promise.resolve(fetch("/.netlify/functions/searchZenitByCadNum?cadNum=".concat(cadNum))).then(function ($await_2) {
          try {
            response = $await_2;
            return Promise.resolve(response.json()).then(function ($await_3) {
              try {
                response = $await_3;

                if (response.error) {
                  document.getElementById('content').innerHTML = '';
                  showSnackbar(response.error);
                  return $return();
                }

                if (response.id) {
                  objectId = response.id;
                  setBody(object);
                } else {
                  showSnackbar('Кредитная заявка с указанным кадастровым номером не найдена. Проверьте номер или обратитесь к вашему кредитному менеджеру.');
                }

                return $return();
              } catch ($boundEx) {
                return $error($boundEx);
              }
            }, $error);
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      });
    });
    return $return();
  });
});

var showPhoto = function showPhoto(e) {
  var parent = e.target.parentNode.parentNode.parentNode;
  parent.querySelector('div>.photo_controls').style.display = 'block';
  parent.querySelector('.photos').style.display = 'none';
  parent.querySelector('.card_image').style.display = 'block';
  parent.querySelector('.card_image>img').src = e.target.src;
  parent.querySelector('.card_image>img').name = e.target.id;
};

var closePhoto = function closePhoto(e) {
  var parent = e.target.parentNode.parentNode;
  parent.querySelector('div>.photo_controls').style.display = 'none';
  parent.parentNode.querySelector('.photos').style.display = 'grid';
  parent.parentNode.querySelector('.card_image').style.display = 'none';
  parent.parentNode.querySelector('.card_image>img').src = '';
  parent.parentNode.querySelector('.card_image>img').name = '';
};

var removeImg = function removeImg(e) {
  return new Promise(function ($return, $error) {
    var parent = e.target.parentNode.parentNode.parentNode;
    var type = parent.id;
    var photosDiv = parent.querySelector('.photos');
    var photoId = parent.querySelector('.card_image>img').name;
    var photoDiv = photosDiv.querySelector(".photo>img[id=\"".concat(photoId, "\"]")).parentNode;
    photosDiv.removeChild(photoDiv);
    var obj = JSON.parse(localStorage.getItem(cadNum));
    var rmIndex = obj[type.split('.')[0]][type.split('.')[1]].findIndex(function (i) {
      return i.id == photoId;
    });
    obj[type.split('.')[0]][type.split('.')[1]].splice(rmIndex, 1);
    localStorage.setItem(cadNum, JSON.stringify(obj));
    if (~newUrls.indexOf(photoId)) newUrls.splice(newUrls.indexOf(photoId), 1);
    if (!newUrls.length) document.getElementById('uploadBtn').style.display = "none";
    /*let success = true
    Object.keys(object).forEach(function (_item) {
        Object.keys(object[_item].items).forEach(function (key) {
            const reqItem = object[_item].items[key]
            if (reqItem.required)
                if (!obj[_item] || !obj[_item][key] || (reqItem.required && !obj[_item][key].length)) success = false
        })
    })
    if (!success) document.getElementById('uploadBtn').style.display = "none"*/

    closePhoto(e);
    return $return();
  });
};

var showSnackbar = function showSnackbar(message) {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerHTML = message;
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
};

var nextSection = function nextSection(e) {
  var id = e.target.parentElement.parentElement.parentElement.parentElement.id;
  var sectionElem = document.querySelectorAll("#".concat(id, ">section"));

  if (sections[sections.findIndex(function (i) {
    return i.id == id;
  })].index < sectionElem.length - 1) {
    sectionElem[sections[sections.findIndex(function (i) {
      return i.id == id;
    })].index].style.display = "none";
    sections[sections.findIndex(function (i) {
      return i.id == id;
    })].index += 1;
    sectionElem[sections[sections.findIndex(function (i) {
      return i.id == id;
    })].index].style.display = "block";
  }

  closePhoto(e);
};

var prevSection = function prevSection(e) {
  var id = e.target.parentElement.parentElement.parentElement.parentElement.id;
  var sectionElem = document.querySelectorAll("#".concat(id, ">section"));

  if (sections[sections.findIndex(function (i) {
    return i.id == id;
  })].index < sectionElem.length && sections[sections.findIndex(function (i) {
    return i.id == id;
  })].index > 0) {
    sectionElem[sections[sections.findIndex(function (i) {
      return i.id == id;
    })].index].style.display = "none";
    sections[sections.findIndex(function (i) {
      return i.id == id;
    })].index -= 1;
    sectionElem[sections[sections.findIndex(function (i) {
      return i.id == id;
    })].index].style.display = "block";
  }

  closePhoto(e);
};

var uploadPhotos = function uploadPhotos(e) {
  return new Promise(function ($return, $error) {
    var pictures, photoArray, api;
    if (upload) return $return();
    pictures = JSON.parse(localStorage.getItem(cadNum));
    photoArray = [];
    Object.keys(pictures).forEach(function (_item) {
      if (_typeof(pictures[_item]) === 'object') Object.keys(pictures[_item]).forEach(function (key) {
        pictures[_item][key].forEach(function (x) {
          return photoArray.push(x);
        });
      });
    });
    upload = true;
    return Promise.resolve(fetch('/.netlify/functions/postZenitFiles', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        id: objectId,
        photoArray: photoArray
      })
    })).then(function ($await_4) {
      try {
        api = $await_4;
        return Promise.resolve(api.json()).then(function ($await_5) {
          try {
            api = $await_5;
            upload = false;
            api.status ? document.getElementById('content').innerHTML = "<span class=\"reportDone\">\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B</span>" : showSnackbar(api.error);
            api.status && (document.getElementById('uploadBtn').style.display = "none");
            api.status && localStorage.removeItem(cadNum);
            return $return();
          } catch ($boundEx) {
            return $error($boundEx);
          }
        }, $error);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }, $error);
  });
};
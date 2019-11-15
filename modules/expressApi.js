const mongo = require('mongodb');
const sendMail = require('./mailer.js');
const searchZenitByCadNum = async (cadNum,db) => {
    cadNum = cadNum.split(':')
    const que = new RegExp(String.raw`^\s*0{0,10}${parseInt(cadNum[0])}:0{0,10}${parseInt(cadNum[1])}:0{0,10}${parseInt(cadNum[2])}:0{0,10}${parseInt(cadNum[3])}\s*$`)
    const id = await db.collection('req').find({ 
        $or: [{ 'to.org._id': '59b6749f69d50a1ca9751c40' }, { 'to.org._id': '5ced3678f08c7479a98ffaf6'}],
        'params.cadNum': que
    }).toArray()
    return {
        id: id.length ? id[0]._id : null,
        error: id[0] ? (id[0].files && id[0].files.length ? 'В кредитной заявке уже имеются фотографии, загрузка невозможна. Обратитесь к вашему менеджеру' : null) : 'Кредитная заявка с указанным кадастровым номером не найдена. Проверьте номер или обратитесь к вашему кредитному менеджеру.' 
    }
}

const postZenitFiles = async (id, photoArray, db) => {
    const get = await db.collection('req').find({
        $or: [{ 'to.org._id': '59b6749f69d50a1ca9751c40' }, { 'to.org._id': '5ced3678f08c7479a98ffaf6' }],
        '_id': new mongo.ObjectID(id),
    }).toArray()
    if(get[0].files && get[0].files.length)
        return {
            status: false,
            error: 'В кредитной заявке уже имеются фотографии, загрузка невозможна. Обратитесь к вашему менеджеру'
        }
    const set = await db.collection('req').updateOne({
        $or: [{ 'to.org._id': '59b6749f69d50a1ca9751c40' }, { 'to.org._id': '5ced3678f08c7479a98ffaf6' }],
        '_id': new mongo.ObjectID(id),
    },{
        $set:{
            files: photoArray
        }
    })
    const status = {
        status: set.result.ok ? true : false,
        error: set.result.ok ? 'Ошибка: фотографии не были добавлены' : null
    }
    if (set.result.ok) sendMail(get[0])
    return status
}

module.exports.searchZenitByCadNum = searchZenitByCadNum
module.exports.postZenitFiles = postZenitFiles
import orgs from './orgIDs';

const searchZenitByCadNum = async (cadNum, db) => {
  cadNum = cadNum.split(':')
  const que = new RegExp(String.raw`^\s*0{0,10}${parseInt(cadNum[0])}:0{0,10}${parseInt(cadNum[1])}:0{0,10}${parseInt(cadNum[2])}:0{0,10}${parseInt(cadNum[3])}\s*$`)
  const id = await db.collection('req').find({
    'to.org._id': {$in: [orgs.Zenit, orgs.TestBank]},
    'status': {$ne: 'cancelled'},
    //'files.0': {$exists: false},
    'params.cadNum': que
  }).sort({_id: -1}).project({files: 1,params:1}).toArray()
  return {
    id: id.length ? id[0]._id : null,
    error: id[0] ? (id[0].params && id[0].params.attachment && id[0].params.attachment.length > 40 ? 'Извините, в заявке по указанному номеру уже есть фотографии. Обратитесь к менеджеру банка' : null) : 'Кредитная заявка с указанным кадастровым номером не найдена. Проверьте номер или обратитесь к вашему кредитному менеджеру.'
  }
}

export default searchZenitByCadNum;

import mongo from 'mongodb';
import sendMail from './mailer.js';
import orgs from './orgIDs';

const postZenitFiles = async (id, photoArray, db) => {
  const get = await db.collection('req').find({
    $or: [{ 'to.org._id': orgs.Zenit }, { 'to.org._id': orgs.TestBank }],
    '_id': new mongo.ObjectID(id),
  }).toArray()
  if (get[0].params.attachment && get[0].params.attachment.length>40)
    return {
      status: false,
      error: 'Извините, в заявке по указанному номеру уже есть фотографии. Обратитесь к менеджеру банка.'
    }
  if (get[0].params && get[0].params.attachment)
    photoArray = get[0].params.attachment.concat(photoArray.filter(e => !get[0].params.attachment.filter(x => x.url === e.url).length))
 
  const set = await db.collection('req').updateOne({
    $or: [{ 'to.org._id': orgs.Zenit }, { 'to.org._id': orgs.TestBank }],
    '_id': new mongo.ObjectID(id),
  }, {
    $set: {
      'params.attachment': photoArray
    }
  })
  const status = {
    status: set.result.ok ? true : false,
    error: set.result.ok ? 'Ошибка: фотографии не были добавлены' : null
  }
  if (status.status) sendMail(get[0])
  return status
}

export default postZenitFiles;

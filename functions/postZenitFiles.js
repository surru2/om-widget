import postZenitFiles from '../lib/postZenitFiles';
import getDb from '../lib/getDb';

exports.handler = async (event, context) => {

  try {
    const db = await getDb();

    const { id, photoArray } = JSON.parse(event.body);

    if(!id || !Array.isArray(photoArray))
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'incorrect input' })
      }

    const result = await postZenitFiles(id, photoArray, db);

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result)
    };

    return response;
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Server error' })
    }
  }
}

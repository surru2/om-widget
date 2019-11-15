import searchZenitByCadNum from '../lib/searchZenitByCadNum';
import getDb from '../lib/getDb';

exports.handler = async (event, context) => {

  try {
    const db = await getDb();

    const { cadNum } = event.queryStringParameters;

    const result = await searchZenitByCadNum(cadNum, db);

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result)
    };

    return response;
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Server error' })
    }
  }

}


require('dotenv').config();
const SES = require('aws-sdk').SES
const sesClient = new SES({
  region: process.env.AWS_ACCESSKEY_REGION,
  accessKeyId: process.env.SES_ACCESS_KEY,
  secretAccessKey: process.env.SES_SECRET
})

module.exports = async (item) => {
  const emailOptions = {
    Destination: {
      //ToAddresses: ['panov.va@mail.ru'],
      ToAddresses: ['zenit@ocenka.mobi'],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'utf-8',
          Data: `Загружены фотографии к кредитной заявке, адрес ${item.params.address}.
          <br>Вы можете просмотреть заявку по ссылке: <a href="https://express.ocenka.mobi/#view/${item._id}" target="_blank">https://express.ocenka.mobi/#view/${item._id}</a>`
        }
      },
      Subject: {
        Data: `Загружены фотографии`,
        Charset: 'utf-8'
      }
    },
    Source: '=?UTF-8?B?0JzQvtCx0LjQu9GM0L3Ri9C5INCe0YbQtdC90YnQuNC6?= <support@ocenka.mobi>'
  }
  await sesClient.sendEmail(emailOptions).promise()
}
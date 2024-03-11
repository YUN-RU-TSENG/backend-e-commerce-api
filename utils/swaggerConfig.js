const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'e-commerce api doc',
      version: '1.0.0',
      description: 'API Documentation',
    },
  },
  apis: ['./routes/*.js', './routes/**/*.js'], // 指定路徑以及文件類型
  tags: [
    {
      name: 'FrontAPI',
      description: '一般前台使用的 API',
    },
    {
      name: 'AdminAPI',
      description: '管理員後台使用的 API',
    },
  ],
}

const specs = swaggerJsdoc(options)

module.exports = specs

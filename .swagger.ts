// eslint-disable-next-line n/no-unpublished-import
import swaggerAutogen from 'swagger-autogen';

const swaggerOptions = {
  info: {
    title: 'Metalworks Wrapper API',
    description: 'API for Metalworks wrapper running on Metalworks Droplets',
    contact: {
      name: 'Tenzin Pelletier',
    },
    version: '0.0.0',
  },
  servers: [
    {
      url: 'http://localhost:8081/api/',
    },
  ],
};

const outputFile = './src/swagger.json';
const endpointsFiles = ['./src/routes/index.ts'];
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, swaggerOptions);

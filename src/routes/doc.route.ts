import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiDocs from '../api-docs.json';
import path from 'path';

export function setupDocRoutes(app: Express) {
  if (process.env.DISPLAY_SWAGGER === 'true') {
    app.use(
      '/swagger',
      swaggerUi.serve,
      swaggerUi.setup(apiDocs, {
        swaggerOptions: {
          persistAuthorization: true,
          displayOperationId: false,
          filter: true,
        },
      }),
    );
  }

  if (process.env.DISPLAY_REDOC === 'true') {
    app.get('/redoc', (_, res) => {
      const redocHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redoc</title>
        </head>
        <body>
          <redoc spec-url="/api-docs.json"></redoc>
          <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
        </body>
      </html>
    `;
      res.send(redocHtml);
    });
  }

  if (
    process.env.DISPLAY_SWAGGER === 'true' ||
    process.env.DISPLAY_REDOC === 'true'
  ) {
    // Serve the api-docs.json file
    app.get('/api-docs.json', (_, res) => {
      res.sendFile(path.join(__dirname, '../api-docs.json'));
    });
  }
}

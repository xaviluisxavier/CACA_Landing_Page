# Landing Page - Centro Académico Clínico dos Açores (CACA)

## Identificação do Grupo
**Projeto de Equipa 3 (PE3) - Tecnologias Web 2025/2026 | Grupo 13**

* **Aluno 1:** Luis Xavier da Silva Pacheco - 2024114400
* **Aluno 2:** David Jorge Repolho Cardoso - 2024108757
* **Aluno 3:** Tomás Raposo Pacheco - 2024111792

---

## Integração de Web APIs e Persistência de Dados (Entrega 3)

Nesta terceira e última fase do projeto, o foco foi elevar a landing page a uma aplicação web dinâmica (Web App), implementando persistência de dados local, assincronismo (`Promises`, `async/await`) e consumo de APIs externas. A arquitetura foi estritamente modular, garantindo a separação de responsabilidades (Separation of Concerns).

### Arquitetura Core, CRUD e IndexedDB
Implementámos um motor centralizado de base de dados para garantir que os dados não se perdem ao recarregar a página.

* **Módulo de Base de Dados (`db.js`):** Criação de um *wrapper* sobre a API nativa da **IndexedDB** (`CACA_DB`). Este módulo gere transações assíncronas e expõe funções genéricas (`addRecord`, `getAllRecords`, `updateRecord`, `deleteRecord`) para serem consumidas pelo resto da aplicação. Foram criados dois *object stores*: `eventos` e `newsletter`.
* **Backoffice / Dashboard de Administração (`admin.js`):** Desenvolvimento de uma área reservada aos administradores do CACA.
    * **CRUD de Eventos:** Permite Adicionar, Visualizar, Editar e Remover eventos, definindo datas, horas, locais e coordenadas geográficas (lat/lng).
    * **Gestão de Subscritores:** Permite visualizar a lista de subscritores da newsletter, remover contactos e exportar a lista em formato CSV para uso em campanhas de marketing.

### Integração de Web APIs (Meteorologia e Mapas)
A secção de eventos da página principal (`eventos-page.js`) foi transformada para consumir dados dinâmicos das APIs externas em tempo real, baseando-se nos registos guardados na base de dados.

* **API de Mapas (Leaflet / OpenStreetMap):** O módulo `mapa.js` gera mapas interativos para cada evento. Se o administrador fornecer coordenadas exatas, o mapa centra-se nesse ponto; caso contrário, utiliza a geocodificação da cidade.
* **API de Previsão Meteorológica (OpenWeatherMap):** O módulo `meteorologia.js` faz pedidos assíncronos à API para obter o estado do tempo (temperatura, vento, ícones descritivos) para a localização de cada evento, seja por pesquisa pelo nome da cidade ou pesquisa direta por coordenadas GPS.
* **UI/UX e Tratamento de Erros:** A renderização inclui *Loading Skeletons* enquanto as APIs respondem, *badges* de datas sobre os mapas e tratamentos de erro (ex: mostrar "Sem previsão" caso a API falhe, sem quebrar o resto do site).

### Subscrição de Newsletter Modular
* **Módulo Dedicado (`newsletter.js`):** Implementação de um sistema de subscrição no rodapé da página principal.
* **Validação e Persistência:** Utiliza RegEx para validar os dados do utilizador (incluindo restrição de domínios de email) e comunica diretamente com o `db.js` para persistir o email na IndexedDB (que garante que não há emails duplicados via `keyPath` e restrições de integridade).
* **Feedback Visual:** Integração perfeita com o Design System do site, alterando as cores das bordas do formulário dinamicamente em tempo real (Verde/Vermelho) e emitindo alertas nativos.

## Arquitetura e Backend (Porquê Node.js?)

A implementação de um servidor **Node.js com Express** atua como *Proxy* entre o site e os serviços externos. Esta decisão técnica baseou-se em três motivos principais:

* **1. Segurança de Chaves (API Keys):** Mantém as chaves da *GNews API* e *OpenWeather API* ocultas e seguras no servidor (via `.env`), evitando que fiquem expostas publicamente no código do browser.
* **2. Ultrapassar Bloqueios CORS:** Como os pedidos aos jornais e APIs são feitos pelo servidor e não pelo browser do utilizador, evitamos os bloqueios automáticos de segurança (CORS) impostos pelas fontes de notícias.
* **3. Otimização de Performance:** O servidor atua como um filtro. Em vez de enviar ficheiros JSON grandes para o cliente, o Node.js envia apenas os dados necessários (título, imagem, temperatura) e entrega um pacote leve, tornando o site muito mais rápido.

---

## Novas Funcionalidades e Interatividade (Entrega 2)

Nesta segunda fase do projeto, integrámos JavaScript para adicionar interatividade e dinamismo à landing page, melhorando a experiência do utilizador. O código foi estruturado de forma modular e incluído em vários ficheiros externos (com a separação de ficheiros CSS e módulos JS documentados com JSDoc), garantindo a sua clareza, legibilidade e adoção de boas práticas de desenvolvimento.

### Formulário de Contacto
Adicionámos um formulário funcional focado no contacto direto com o CACA.
* **Campos Múltiplos:** O formulário contém 6 campos distintos (nome, email, telemóvel, morada, assunto, mensagem). Inclui ainda a injeção de uma mensagem pré-definida consoante o assunto selecionado.
* **Validação do lado do cliente:** Implementámos validação com JavaScript (recorrendo a Expressões Regulares - RegEx) para garantir que os dados inseridos são válidos. O sistema valida domínios específicos de email (`@uac.pt`, `@gmail.com`, `@outlook.com`) e o formato/tamanho de números de telemóvel portugueses e internacionais.
* **Feedback ao Utilizador:** O sistema fornece feedback visual (através de validação visual nas bordas e alertas nativos) sobre o sucesso ou falha da submissão. A submissão simula o envio de dados e limpa os campos automaticamente após a confirmação.

### Animações Dinâmicas e UI
Integrámos animações.
* **Logótipo 3D (Three.js):** Criámos uma animação 3D de um logótipo rotativo do CACA que figura como elemento de destaque no cabeçalho da página.
* **Visualização de Dados (D3.js):** Desenvolvemos o "Gráfico de Oportunidades", um gráfico de barras dinâmico construído com a biblioteca D3.js que ilustra os valores de forma animada quando a página ou o gráfico são carregados.
* **Iconografia Profissional:** Substituição de emojis nativos por uma biblioteca de ícones profissionais (Flaticon/Uicons) para um design mais coeso.

### Gestão de Eventos DOM
A página monitoriza ativamente as interações do utilizador para melhorar a usabilidade geral, respondendo a múltiplos eventos distintos:
* **Botão "Conheça as Nossas Áreas" (Saber Mais):** Revela a secção de investigação (previamente oculta) com uma transição suave de scroll.
* **Carrossel de Imagens:** Implementámos um carrossel dinâmico na secção de destaque que alterna automaticamente as imagens, permitindo uma navegação visual fluida.
* **Botão "Voltar ao Topo" (Scroll-to-top):** Um botão que aparece dinamicamente apenas quando o utilizador faz scroll para baixo na página.
* **Menu Mobile:** Gestão de eventos para abrir e fechar o menu de navegação em ecrãs menores, reforçando a responsividade.

> **Acessibilidade:** Garantimos que as novas funcionalidades em JavaScript continuam a respeitar as regras de acessibilidade, mantendo a navegação por teclado (Tab/Focus) nos novos elementos interativos.
---

## Identidade Visual e Layout (Entrega 1)
A identidade visual do **CACA** foi concebida para transmitir profissionalismo académico e confiança na área da saúde, integrando elementos regionais dos Açores.

### Paleta de Cores
* **Azul primário (#1976D2 / #003882):** Representa confiança, saúde e o oceano Atlântico que rodeia as ilhas.
* **Verde secundário (#43A047 / #FFD100):** Simboliza a area da saúde.
* **Cores de destaque (laranja, roxo, vermelho):** Utilizadas para diferenciar áreas de investigação.

### Tipografia
* **Display:** Playfair Display (usada em títulos institucionais).
* **Corpo:** Source Sans 3 (otimizada para leitura de conteúdo).

### Acessibilidade e Responsividade (WCAG)
* **Contraste de cores:** Testado para garantir ratio mínimo 4.5:1 (texto normal) e 3:1 (texto grande).
* **Responsividade (Mobile-first):** Layout adaptável com `CSS Grid` e `Flexbox`. Breakpoints definidos em 480px, 768px e 1024px.
* **Hierarquia semântica:** Uso rigoroso de tags HTML5 apropriadas (header, nav, section, article, footer).
* **Atributos alt:** Incluídos em todas as imagens relevantes.

---
*Este projeto foi desenvolvido para a disciplina de Tecnologias Web 2025/2026.*

# Planeamento e Distribuição de Tarefas - PEI3 (Melhoria com Web APIs)
**Grupo 13**

## Elementos do Grupo
* **David Jorge Repolho Cardoso** (2024108757) - PL1
* **Luis Xavier da Silva Pacheco** (2024114400) - PL2
* **Tomás Raposo Pacheco** (2024111792) - PL1
* **Samuel Nunes Jorge** (2021115669) - PL2

---

## Divisão de Tarefas

De forma a garantir que todos os elementos participam em todas as etapas (como recomendado no enunciado), as tarefas foram divididas por módulos funcionais. 

### 1. Arquitetura Core, CRUD e Sincronização de APIs
**Responsável Principal:** David Jorge Repolho Cardoso
* **Arquitetura IndexedDB Global:** Configuração avançada da base de dados local, englobando a criação de múltiplos *object stores* (Eventos e Newsletter), gestão de transações assíncronas e versionamento.
* **Motor CRUD de Eventos:** Implementação da lógica pesada de Adicionar, Visualizar, Editar e Remover eventos.
* **Sincronização de Estado:** Garantir que, ao renderizar os eventos guardados localmente, o sistema faz chamadas assíncronas e dinâmicas às APIs de Meteorologia e Mapas (desenvolvidas pelo Tomás), lidando com *promises*, gestão de erros de rede e *loading states* na interface.

### 2. Integração de Web APIs (Meteorologia e Mapas)
**Responsável Principal:** Tomás Raposo Pacheco
* **API de Previsão Meteorológica:** Desenvolver o módulo de comunicação com a API (ex: OpenWeatherMap) para receber coordenadas/cidades e devolver os dados climáticos formatados.
* **API de Mapas:** Configurar e integrar o motor de mapas (ex: Leaflet/OpenStreetMap ou Google Maps) para gerar mapas interativos baseados nos locais dos eventos.
* **Passagem de Dados:** Fornecer as funções modulares destas APIs para que o David as possa integrar no motor do CRUD.

### 3. Subscrição de Newsletter e UI/UX Global
**Responsável Principal:** Luis Xavier da Silva Pacheco
* **Subscrição de Newsletter:** Criação do formulário (nome e e-mail) com validações robustas em JavaScript (RegEx).
* **Persistência da Newsletter:** Ligar o formulário ao *object store* da Newsletter criado na IndexedDB, garantindo feedback visual (sucesso/erro).
* **UI/UX dos Formulários:** Desenhar a interface dos formulários (Eventos e Newsletter) garantindo que são responsivos e seguem a identidade visual da landing page (PEI1/PEI2).

### 4. API de Notícias/RSS, Acessibilidade e Documentação
**Responsável Principal:** Samuel Nunes Jorge
* **API de Notícias/RSS Feeds:** Integração de uma API externa (ex: NewsAPI) ou feed RSS público para exibir dinamicamente um feed de notícias de saúde na página.
* **Acessibilidade (a11y):** Revisão transversal do projeto para garantir navegação por teclado nos novos formulários e listas dinâmicas, *aria-labels*, e *alt text* adequado.
* **Documentação Completa (README.md):** Redação da arquitetura da IndexedDB, justificação das decisões de design, instruções de execução e documentação das APIs externas utilizadas.



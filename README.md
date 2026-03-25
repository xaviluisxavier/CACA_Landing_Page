# Landing Page - Centro Académico Clínico dos Açores (CACA)

## Identificação do Grupo
**Projeto de Equipa 2 (PE2) - Tecnologias Web 2025/2026 | Grupo 3**

* **Aluno 1:** Luis Xavier da Silva Pacheco - 2024114400
* **Aluno 2:** António Rui Serpa Reis - 2022113330
* **Aluno 3:** Rafael Miguel Dias - 2024110297

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

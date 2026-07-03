# Relatório de Desenvolvimento do Frontend — Reparações Eletrónicas

Este relatório descreve o desenvolvimento do cliente web em ReactJS, a sua estrutura de ficheiros modular, o fluxo de controlo de acessos (RBAC), as decisões de design de interface (UI/UX) e o painel de auditoria técnica.

---

## 1. Tecnologias e Configuração
O cliente web foi desenvolvido com foco numa experiência de utilizador rápida, reativa e visualmente apelativa:
*   **Biblioteca**: **ReactJS** (focado no paradigma de componentes declarativos).
*   **Builder**: **Vite** (fornecendo Hot Module Replacement instantâneo e compilações rápidas).
*   **Ícones**: **Lucide React** (para ícones vetoriais modernos e consistentes).
*   **Estilização**: **Vanilla CSS**, com folha de estilos unificada em `index.css`.
*   **Roteamento**: Controlo de navegação baseado em estados internos (`useState`), o que previne dessincronizações de sessão na cache do navegador.

---

## 2. Estrutura Modular de Pastas
Para garantir a legibilidade do código, a escalabilidade da aplicação e boas práticas de arquitetura de software, o código da pasta `src/` foi dividido em módulos:

*   **[`src/services/api.js`](file:///C:/Users/User/Desktop/TRAB_ARTUR/frontend/src/services/api.js)**: Serviço central para chamadas assíncronas à API HTTP, gestão local do Bearer Token JWT e comunicação de eventos para a consola de auditoria.
*   **`src/components/` (Componentes reutilizáveis)**:
    *   `Sidebar.jsx`: Menu lateral dinâmico de navegação com dados do utilizador.
    *   `Metrics.jsx`: Painel gráfico de cartões estatísticos.
    *   `Notification.jsx`: Banner flutuante para erros e sucessos.
    *   `ApiConsole.jsx`: Consola de rodapé para simulação e visualização de tráfego.
    *   `EquipmentFormModal.jsx`, `RepairFormModal.jsx`, `UserFormModal.jsx`: Modais de criação e edição com validações visuais.
*   **`src/pages/` (Ecrãs principais)**:
    *   `Login.jsx` e `Register.jsx`: Interfaces de controlo de acessos.
    *   `Dashboard.jsx`: Agregador das listas de dados, filtros de tipo, estado e barra de pesquisa global em tempo real.

---

## 3. Experiência Visual e Design System (UI/UX)
Adotou-se uma estética contemporânea escura inspirada nos dark mode convencionais.
*   **Cores Principais**: Fundo escuro profundo (`#0b0f19`) combinado com cartões translúcidos (`#151c2c`).
*   **Acentos**: Gradiente futurista com as cores Índigo (`#6366f1`) e Violeta.
*   **Estados (Badges)**: Cores com opacidade semântica para indicar o progresso (Verde para concluído/aprovado, Vermelho para rejeitado/não aprovado, Amarelo para pendente/em espera).
*   **Tipografia**: Utilização da fonte moderna *Outfit* (via Google Fonts).

---

## 4. Regras de Interface e Permissões por Papel (RBAC)
A interface altera-se dinamicamente com base nas credenciais do utilizador autenticado obtidas através do token JWT descodificado:

### 4.1. Perfil Cliente
*   **Equipamentos**: Apenas visualiza os seus dispositivos. Ao tentar editar, o ecrã abre apenas a opção de **Aprovar ou Rejeitar o orçamento** (os campos de marca, modelo e número de série ficam bloqueados para escrita). Não vê botões de eliminação.
*   **Reparações**: Apenas observa os registos de intervenção dos seus equipamentos. As colunas de ação (Editar/Eliminar) são ocultadas da tabela. Não pode registar novas reparações.

### 4.2. Perfil Técnico (Reparador)
*   Visualiza e pesquisa todos os equipamentos e reparações na oficina.
*   Pode atualizar o estado da reparação e técnico encarregue.
*   Pode aceder ao ecrã de **Utilizadores** para registar novos clientes. O formulário bloqueia a criação de outros técnicos ou administradores para evitar escalabilidade de privilégios.

### 4.3. Perfil Administrador
*   Tem acesso total de gestão. Vê os botões de eliminação de equipamentos, reparações e utilizadores, e pode criar novos administradores e técnicos na interface.

---

## 5. Painel de Auditoria de Chamadas API (Console Dev)
Idealizado para auditorias técnicas e defesa do projeto, a consola no rodapé escuta em segundo plano todas as interações do frontend com a API REST:
*   Mostra o método HTTP, o caminho da rota consultada, o status HTTP da resposta e a hora do pedido.
*   Permite visualizar o JSON exato enviado no pedido (*Request Body*) e o JSON de retorno do servidor (*Response Body*).

---

## 6. Como Iniciar a Aplicação
1.  Navegar no terminal até à pasta `frontend`:
    `cd frontend`
2.  Iniciar o servidor Vite:
    `npm run dev`
3.  Aceder ao endereço indicado (por padrão, `http://localhost:5173`).

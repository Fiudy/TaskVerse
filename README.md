# 🎮 TaskVerse – Plataforma Gamificada de Missões Educacionais

**TaskVerse — Sua Jornada Gamificada de Aprendizagem**

Este projeto é um MVP gamificado baseado na abordagem de Aprendizagem Baseada em Projetos e Problemas (PBL).  
O sistema permite que **alunos** realizem missões e **professores** criem, editem e avaliem atividades, tudo com um toque de gamificação utilizando XP.

---

## 🚀 Funcionalidades Principais

### 👨‍🎓 Para o Aluno
- Visualizar missões organizadas por matérias.
- Entregar missões via texto ou link.
- Receber XP por atividades aprovadas.
- Ver progresso total no painel.
- Dashboard organizado com filtro por matéria/professor.

### 👨‍🏫 Para o Professor
- Criar, editar e excluir missões.
- Atribuir missões a alunos específicos.
- Visualizar todas as entregas dos alunos.
- Aprovar missões e conceder XP.
- Dashboard completo com overview das atividades.
- Banco de perguntas pré-definidas por matéria.

---

## 🧩 Tecnologias Utilizadas
- **React 18** + **Vite 5**: SPA com build rápido e DX moderna.
- **TypeScript**: tipagem estática para maior segurança e manutenção.
- **TailwindCSS**, **shadcn/ui** e **Radix UI**: design system e componentes acessíveis.
- **react-router-dom**: navegação no cliente entre páginas.
- **react-hook-form** + **zod**: formulários com validação declarativa.
- **sonner**: toasts e feedback ao usuário.
- **lucide-react**: ícones.
- **Supabase** (PostgreSQL + `@supabase/supabase-js`): backend como serviço, banco de dados e políticas RLS.
- **PostCSS/Autoprefixer**: pipeline de CSS.
- **ESLint** + **TypeScript**: análise estática e qualidade de código.
- **Lovable**: aceleração de scaffolding e setup inicial.

## 📝 Linguagens de Programação
- **TypeScript**: linguagem principal do frontend (componentes, páginas e integrações).
- **JavaScript**: ecossistema de bibliotecas e runtime do bundler.
- **SQL**: migrações e definição do esquema no Supabase.
- **CSS**: estilização via utilitários do TailwindCSS (sem expor código).

---

## 🔐 Logins Padrão Para Testes

| Tipo | Login | Senha |
|------|--------|-------------|
| **Aluno** | `aluno` | `aluno@123` |
| **Professor** | `professor` | `professor@123` |

---

## 📌 Missões Pré-definidas por Matéria

O sistema já vem com **5 missões para cada uma das seguintes matérias**:

### 💻 Programação
1. Criar um algoritmo simples utilizando estruturas condicionais.
2. Explicar o conceito de variáveis e constantes.
3. Desenvolver uma função que calcule a média de três números.
4. Identificar erros em um código e corrigi-los.
5. Criar um mini-programa de cadastro usando arrays.

### 📐 Matemática
1. Resolver um sistema linear simples.
2. Explicar o Teorema de Pitágoras.
3. Calcular juros simples em um exemplo prático.
4. Converter frações em números decimais.
5. Resolver uma equação de 2º grau.

### 🌎 Geografia
1. Explicar o que é latitude e longitude.
2. Definir clima e tempo meteorológico.
3. Pesquisar as principais regiões brasileiras.
4. Identificar países do hemisfério sul.
5. Explicar o funcionamento das estações do ano.

### 📜 História
1. Resumir o período da Idade Média.
2. Explicar a Revolução Industrial.
3. Citar causas da Primeira Guerra Mundial.
4. Identificar civilizações antigas.
5. Explicar o conceito de cidadania na Grécia Antiga.

### 🔬 Ciências
1. Explicar o ciclo da água.
2. Definir célula e suas partes.
3. Classificar animais vertebrados e invertebrados.
4. Explicar fotossíntese.
5. Descrever estados físicos da matéria.

Todas essas missões podem ser **visualizadas, editadas e atribuídas pelo professor**.

---

## 📁 Estrutura do Projeto


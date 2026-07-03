# Imagem base oficial do Node.js leve
FROM node:20-alpine

# Diretório de trabalho dentro do contentor
WORKDIR /usr/src/app

# Copia os ficheiros de dependências
COPY package*.json ./

# Instala as dependências do frontend
RUN npm install

# Copia todo o código-fonte do frontend
COPY . .

# Expõe a porta padrão do servidor de desenvolvimento do Vite
EXPOSE 5173

# Executa o servidor de desenvolvimento do Vite escutando em todas as interfaces da rede do contentor (--host)
CMD ["npm", "run", "dev", "--", "--host"]

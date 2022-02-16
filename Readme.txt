# Requisitos
Para rodar o programa é necessário instalar os seguintes programas:
    - Node js (https://nodejs.org/en/)
    - NPM (gerenciador de pacotes node, contido no instalador do node)
    - Qualquer navegador web (chrome, firefox, etc)


# Instalação das dependências
Na raíz do projeto:
    - Entrar na pasta "frontend" via linha de comando
    - Executar o comando: npm install 

# Rodando o programa
Na raíz do projeto:
    - Entrar na pasta "frontend" via linha de comando
    - Executar o comando: npm start
    - Abrir o navegador no seguinte endereço: http://localhost:3000
    - Seguir as instruções mostradas na interface

# Formato do arquivo de entrada
O arquivo de entrada deve conter as conexões das salas escritas no formato pode_ir(nome_sala, nome_sala, distancia)
seguidos pelas distancias em linha reta entre todas as salas.

 - Arquivos de exemplo na pasta "examples"

Exemplo:

pode_ir(nome_sala1, nome_sala2, distancia)
pode_ir(nome_sala1, nome_sala3, distancia)
pode_ir(nome_sala3, nome_sala2, distancia)
.
.
.
h(nome_sala1, nome_sala2, distancia)
h(nome_sala1, nome_sala3, distancia)
h(nome_sala2, nome_sala3, distancia)
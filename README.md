### Agendamentos
Base URL: `/api/agendamentos`

- **GET**
  Recupera todos os agendamentos (apenas para administradores).  
  **Query Parameters:**  
  Nenhum -> Todos os agendamentos. <br/>
  UserID -> Todos agendamentos do usuario.

- **POST** 
  Criação de um novo agendamento.  
  **Body:**
  ```json
  {
    "user": "ID do Usuario",
    "name": "Nome da pessoa",
    "date": "New Date()"
  }
  ```

- **DELETE**
  Exclusão de um agendamento.
  **Query Parameters:**  
  ID do Agendamento -> Para dar um SoftDelete no agendamento. 
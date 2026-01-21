import { useState, useEffect } from "react";
import ModalForm from "../../components/menu/ModalForm.jsx";
import { formAddUser, formEditUser, formDeleteUser } from "./Forms.js";
import { Button, Card, Badge, Spinner, Form } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { SlPencil, SlTrash  } from "react-icons/sl";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { useCustomers } from "../../contexts";

export default function UsersPage() {
  const { customers, loading, error, fetchCustomers } = useCustomers();
  const [menuAddUserAtivo, setMenuAddUserAtivo] = useState(false);
  const [menuEditUserAtivo, setMenuEditUserAtivo] = useState(false);
  const [menuDeleteUserAtivo, setMenuDeleteUserAtivo] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [busca, setBusca] = useState("");

  const { titleFormAddUser, fieldsFormAddUser, handleSubmitFormAddUser, messageFormAddUser, setMessageFormAddUser, messageTypeFormAddUser } = formAddUser({
    onSuccess: () => {
      setMenuAddUserAtivo(false);
      setMessageFormAddUser("");
      fetchCustomers();
    },
  });  

  const { titleFormEditUser, fieldsFormEditUser, handleSubmitFormEditUser, messageFormEditUser, setMessageFormEditUser, messageTypeFormEditUser } = formEditUser({
    onSuccess: () => {
      setMenuEditUserAtivo(false);
      setMessageFormEditUser("");
      fetchCustomers();
    },
    selectedUser
  });  

  const { titleFormDeleteUser, handleSubmitFormDeleteUser, messageFormDeleteUser, setMessageFormDeleteUser, messageTypeFormDeleteUser } = formDeleteUser({
    onSuccess: () => {
      setMenuDeleteUserAtivo(false);
      setMessageFormDeleteUser("");
      fetchCustomers();
    },
    selectedUser
  });

  useEffect(() => {
    if (customers.length === 0) {
      fetchCustomers();
    }
  }, []);

  const clientesNumerados = customers.map((cliente, index) => ({
    ...cliente,
    numero: index + 1,
  }));

  const clientesFiltrados = clientesNumerados.filter((customer) =>
    customer.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading && customers.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spinner animation="border" role="status" />
        <span>Carregando clientes</span>
      </div>
    )
  }

  if (error && customers.length === 0) {
    return(
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: "48px", color: "#dc3545" }} />
        <span style={{ color: "#666" }}>{error}</span>
        <Button onClick={fetchCustomers} variant="outline-primary">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className={`w-100 min-vh-100 bg-light ${menuAddUserAtivo || menuEditUserAtivo || menuDeleteUserAtivo ? "opacity-50" : ""}`} style={{ fontFamily: "Roboto, sans-serif" }}>
        <div style={{ padding: "35px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
            <div>
              <h1 style={{ color: "#212121", marginBottom: "5px", fontWeight: "bold" }}>Clientes</h1>
              <p style={{ color: "#666", margin: 0 }}>Gerencie sua base de clientes</p>
            </div>
            <Button 
              style={{ padding: "10px 20px", borderRadius: "8px" }}
              onClick={() => setMenuAddUserAtivo(true)}
              variant="outline-success"
            >
              + Novo Cliente
            </Button>
          </div>

          <div style={{ marginBottom: "30px", position: "relative", maxWidth: "300px" }}>
            <CiSearch size={20} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }} />
            <Form.Control
              type="text" 
              placeholder="Buscar clientes..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{ paddingLeft: "45px", width: "100%", borderRadius: "10px", border: "1px solid #ddd", padding: "12px 12px 12px 45px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)",  gap: "20px" }}>
            {clientesFiltrados.map((customer) => {
              const getInitials = (name) => {
                const names = name.split(' ');
                return names.length > 1 
                  ? names[0][0] + names[names.length - 1][0] 
                  : names[0][0];
              };

              const getAvatarColor = (index) => {
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
                return colors[index % colors.length];
              };

              return (
                <Card key={customer.id} className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-start mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: getAvatarColor(customer.numero),
                          fontSize: "18px"
                        }}
                      >
                        {getInitials(customer.nome)}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <Card.Title className="mb-1 h5">{customer.nome}</Card.Title>
                        <Badge bg="" className="text-muted p-0">
                          Cliente #{customer.numero.toString().padStart(4, '0')}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2 text-muted">
                        <MdEmail size={18} className="me-2" />
                        <small>{customer.email || "Não informado"}</small>
                      </div>
                      <div className="d-flex align-items-center mb-2 text-muted">
                        <MdPhone size={18} className="me-2" />
                        <small>{customer.telefone || "Não informado"}</small>
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <MdLocationOn size={18} className="me-2" />
                        <small>{customer.endereco || "Não informado"}</small>
                      </div>
                    </div>
                  </Card.Body>

                  <Card.Footer className="bg-white border-top d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-4">
                      <div>
                        <div className="fs-4 fw-bold text-dark">-</div>
                        <small className="text-muted">Pedidos</small>
                      </div>
                      <div>
                        <div className="fs-4 fw-bold text-success">R$ -</div>
                        <small className="text-muted">Total Gasto</small>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(customer);
                          setMenuEditUserAtivo(true);
                        }}
                        title="Editar cliente"
                      >
                        <SlPencil /> Editar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(customer);
                          setMenuDeleteUserAtivo(true);
                        }}
                        title="Excluir cliente"
                      >
                        <SlTrash /> Excluir
                      </Button>
                    </div>
                  </Card.Footer>
                </Card>
              );
            })}
          </div>

          {clientesFiltrados.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <i className="bi bi-people" style={{ fontSize: "48px", marginBottom: "16px", display: "block" }} />
              <p>Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      </div>

      {menuAddUserAtivo && (
        <ModalForm
          title={titleFormAddUser}
          visible={menuAddUserAtivo}
          setVisible={setMenuAddUserAtivo}
          fields={fieldsFormAddUser}
          onSubmit={handleSubmitFormAddUser}
          message={messageFormAddUser}
          messageType={messageTypeFormAddUser}
          action={"add"}
        />
      )}

      {selectedUser && menuEditUserAtivo && (
        <ModalForm
          title={titleFormEditUser}
          visible={menuEditUserAtivo}
          setVisible={setMenuEditUserAtivo}
          fields={fieldsFormEditUser}
          onSubmit={handleSubmitFormEditUser}
          message={messageFormEditUser}
          messageType={messageTypeFormEditUser}
          action={"edit"}
        />
      )}

      {selectedUser && menuDeleteUserAtivo && (
        <ModalForm
          title={titleFormDeleteUser}
          visible={menuDeleteUserAtivo}
          setVisible={setMenuDeleteUserAtivo}
          onSubmit={handleSubmitFormDeleteUser}
          message={messageFormDeleteUser}
          messageType={messageTypeFormDeleteUser}
          action={"delete"}
        />
      )}
    </>
  );
}

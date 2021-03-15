import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  CardBody,
  Button,
  ButtonGroup,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  CardSubtitle,
  FormGroup,
  Label,
} from "reactstrap";

const url = "http://localhost:5000/api/task";

class Todo extends Component {
  state = {
    data: [],

    ModaLinsert: false,
    ModalDelete: false,

    form: {
      _id: "",
      name: "",
      description: "",
      typeModal: "",
    },
  };

  requestGet = () => {
    axios
      .get(url + "/list")
      .then((res) => {
        this.setState({ data: res.data });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  requestPost = async () => {
    delete this.state.form._id;
    await axios
      .post(url + "/create", this.state.form)
      .then((res) => {
        this.ModaLinsert();
        this.requestGet();

        // clearing the values
        // this.state.form.name = "";
        //this.state.form.description = "";
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  requestPut = () => {
    axios.put(url + "/" + this.state.form._id, this.state.form).then((res) => {
      this.ModaLinsert();
      this.requestGet();
    });
  };

  requestDelete = () => {
    axios.delete(url + "/" + this.state.form._id).then((res) => {
      this.setState({ ModalDelete: false });
      this.requestGet();
    });
  };

  ModaLinsert = () => {
    this.setState({ ModaLinsert: !this.state.ModaLinsert });
  };

  selectTask = (task) => {
    this.setState({
      typeModal: "actualizar",
      form: {
        _id: task._id,
        name: task.name,
        description: task.description,
      },
    });
  };

  handleChange = async (e) => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  componentDidMount() {
    this.requestGet();
  }

  render() {
    const { form } = this.state;

    return (
      <div className="container h-100 mt-5">
        <div className="row justify-content-center h-100">
          <div className="col-12 col-sm-12 col-md-8 col-lg-5 align-self-center">
            <button
              className="btn btn-success"
              onClick={() => {
                this.setState({ form: null, typeModal: "insertar" });
                this.ModaLinsert();
              }}
            >
              Agregar Tarea
            </button>
            <div
              className="card shadow-lg p-3 mb-5 rounded "
              style={{ backgroundColor: "#F0F0F2" }}
            >
              {this.state.data.length > 0 ? (
                this.state.data.map((task) => {
                  return (
                    <Card className="shadow-lg p-3 mb-2  bg-white rounded border-info">
                      <CardBody className="pb-0">
                        <div>
                          <h4 style={{ color: "#0E1626" }}>{task.name}</h4>

                          <CardSubtitle className="pt-3 pb-3">
                            <h5>{task.description}</h5>
                          </CardSubtitle>

                          <ButtonGroup className=" bg-primary float-right">
                            <Button
                              className="btn btn-info"
                              onClick={() => {
                                this.selectTask(task);
                                this.ModaLinsert();
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              className="btn btn-danger"
                              onClick={() => {
                                this.selectTask(task);
                                this.setState({ ModalDelete: true });
                              }}
                            >
                              Eliminar
                            </Button>
                          </ButtonGroup>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              ) : (
                <h1>No hay tareas......</h1>
              )}
            </div>
          </div>
        </div>

        <Modal isOpen={this.state.ModaLinsert}>
          <ModalBody>
            <FormGroup>
              <Label>Nombre:</Label>
              <Input
                autoComplete="off"
                className="form-control"
                type="text"
                name="name"
                id="name"
                onChange={this.handleChange}
                value={form ? form.name : ""}
              ></Input>
              <div className="mt-2">
                <Label>Descripción:</Label>
                <Input
                  autoComplete="off"
                  className="form-control"
                  type="textarea"
                  rows="5"
                  cols="20"
                  name="description"
                  id="description"
                  onChange={this.handleChange}
                  value={form ? form.description : ""}
                ></Input>
              </div>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            {this.state.typeModal === "insertar" ? (
              <Button
                className="btn btn-sucess"
                onClick={() => this.requestPost()}
              >
                Insertar
              </Button>
            ) : (
              <Button
                className="btn btn-sucess"
                onClick={() => this.requestPut()}
              >
                actualizar
              </Button>
            )}

            <Button
              className="btn btn-danger"
              onClick={() => this.ModaLinsert()}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.ModalDelete}>
          <ModalBody>Estás seguro de eliminar?</ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() => this.requestDelete()}
            >
              Sí
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => this.setState({ ModalDelete: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Todo;

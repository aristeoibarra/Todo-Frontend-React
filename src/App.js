import "./App.css";
import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";


const url = "http://localhost:5000/api/task";

class App extends Component {
  state = {
    data: [],

    modalInsertar: false,
    modalEliminar: false,

    form:{
      _id: "",
      name: "",
      description:"",
      tipoModal: ""
    }
  };

  peticionGet = () => {
    axios
      .get(url + "/list")
      .then((res) => {
        this.setState({ data: res.data });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  peticionPost=async()=>{
    delete this.state.form._id;
   await axios.post(url + "/create",this.state.form).then(res=>{
      this.modalInsertar();
      this.peticionGet();

        // clearing the values
       // this.state.form.name = "";
        //this.state.form.description = "";

    }).catch(err=>{
      console.log(err.message);
    })
  }

  peticionPut=()=>{
    axios.put(url + "/" + this.state.form._id, this.state.form).then(res=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url + "/" + this.state.form._id).then(res=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }
  

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

seleccionarTask=(task)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
      _id: task._id,
      name: task.name,
      description: task.description
    }
  })
}

handleChange=async e=>{
  e.persist();
  await this.setState({
    form:{
      ...this.state.form,
      [e.target.name]: e.target.value
    }
  });
  console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const {form} = this.state;
    return (
      <div className="container-sm">
        <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>
          Agregar Tarea
        </button>

        <table className="table table-striped table-hover ">
          <thead className="table-primary">
            <tr>
              <th>Tarea</th>
              <th>Descripción</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((task) => {
              return (
                <tr>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>
                    <button className="btn btn-primary" onClick={()=>{this.seleccionarTask(task); this.modalInsertar()}}>Editar</button>{" "}
                    <button className="btn btn-danger" onClick={()=>{this.seleccionarTask(task); this.setState({modalEliminar: true})}}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Modal isOpen={this.state.modalInsertar}>
            <ModalHeader style={{display:"block"}}>
              <span style={{float: "right"}} onClick={()=>this.modalInsertar()}>X</span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">

         

                <label htmlFor="name">titulo</label>
                <Input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={form ? form.name : ""}/>
                
                <label htmlFor="description" className="mt-3">Descripción</label>
                <Input className="form-control" type="text" name="description" id="description" onChange={this.handleChange} value={form ? form.description: ""} />
           </div>
            </ModalBody>

            <ModalFooter>
            {this.state.tipoModal === "insertar" 
              ? <button className="btn btn-sucess" onClick={()=>this.peticionPost()} >Insertar</button> 
              : <button className="btn btn-sucess" onClick={()=>this.peticionPut()} >actualizar</button>         
            }
              
              <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>  
            </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar a la empresa {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>

      </div>
    );
  }
}

export default App;

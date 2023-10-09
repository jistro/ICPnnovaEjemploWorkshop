import * as React from "react";
import { createRoot } from "react-dom/client";
import { workshopCOLLEDGE_backend as canister } from "../../declarations/workshopCOLLEDGE_backend";



const Empleado = () => {// funcion main
  const [empleadoSearch, setEmpleadoSearch] = React.useState(null);

  const buscarEmpleado = () => {
    const inputIds = ["idEmpleado"];
    const inputs = inputIds.map(id => document.getElementById(id));
    const [idEmpleado] = inputs.map(input => input.value);
    console.log(idEmpleado);
    if (idEmpleado === "") {
      alert("Debe ingresar un id de empleado");
      return;
    }

    canister.obtenerEmpleado(idEmpleado).then((result) => {
      console.log(result);
      setEmpleadoSearch(result);
    }).catch((err) => {
      console.log(err);
      alert("Error en la busqueda del empleado");
    });
  }

  const crearEmpleado = () => {
    const inputIds = [
      "crearEmpleado_id",
      "crearEmpleado_nombre",
      "crearEmpleado_apellidoPaterno",
      "crearEmpleado_apellidoMaterno",
      "crearEmpleado_nacimientoFecha",
    ];
    const inputs = inputIds.map(id => document.getElementById(id));
    const [idEmpleado, nombre, apellidoPaterno, apellidoMaterno, nacimientoFecha] = inputs.map(input => input.value);
    console.log(idEmpleado, nombre, apellidoPaterno, apellidoMaterno, nacimientoFecha);
    if (inputs.some(input => input.value === "")) {
      alert("Debe llenar todos los campos");
      return;
    }
    const nacimientoFechaDate = new Date(nacimientoFecha);
    const diaNacimientoInt = nacimientoFechaDate.getDate() + 1;
    const mesNacimientoInt = nacimientoFechaDate.getMonth() + 1;
    const anioNacimientoInt = nacimientoFechaDate.getFullYear();
    console.log(diaNacimientoInt, mesNacimientoInt, anioNacimientoInt);

    // mayores de edad
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate() + 1;
    const mesActual = fechaActual.getMonth() + 1;
    const anioActual = fechaActual.getFullYear();
    console.log(diaActual, mesActual, anioActual);
    if (anioNacimientoInt > anioActual) {
      alert("Año de nacimiento no valido");
      return;
    }
    if (anioNacimientoInt === anioActual && mesNacimientoInt > mesActual) {
      alert("Mes de nacimiento no valido");
      return;
    }

    if (anioNacimientoInt === anioActual && mesNacimientoInt === mesActual && diaNacimientoInt > diaActual) {
      alert("Dia de nacimiento no valido");
      return;
    }

    canister.nuevoEmpleado(
      idEmpleado,{
        anioNacimiento: anioNacimientoInt,
        apellidoMaterno: apellidoMaterno,
        apellidoPaterno: apellidoPaterno,
        diaNacimiento: diaNacimientoInt,
        mesNacimiento: mesNacimientoInt,
        nombre: nombre,
      }
    ).then((result) => {
      alert("Empleado creado");
    }).catch((err) => {
      console.log(err);
      alert("Error en la creacion del empleado");
    });
  }

  const borrarEmpleado = () => {
    const inputIds = ["borrarEmpleado_id"];
    const inputs = inputIds.map(id => document.getElementById(id));
    const [idEmpleado] = inputs.map(input => input.value);
    console.log(idEmpleado);
    if (idEmpleado === "") {
      alert("Debe ingresar un id de empleado");
      return;
    }
    // confirmacion de borrar empleado
    const confirmacion = confirm("¿Esta seguro de borrar el empleado?");
    if (!confirmacion) {
      return;
    }

    canister.eliminarEmpleado(idEmpleado).then(() => {
      alert("Empleado borrado");
    }).catch((err) => {
      console.log(err);
      alert("Error en el borrado del empleado");
    });
  }

  return (
    <div>
      <h2>Buscar Empleado</h2>
      <div>
        {empleadoSearch && empleadoSearch.nombre !== "" ? (
          <div>
            <p>Nombre: {`${empleadoSearch.nombre} ${empleadoSearch.apellidoPaterno} ${empleadoSearch.apellidoMaterno}`}</p>
            <p>Fecha de nacimiento: {`${empleadoSearch.diaNacimiento}/${empleadoSearch.mesNacimiento}/${empleadoSearch.anioNacimiento}`}</p>
            <button onClick={() => setEmpleadoSearch(null)}>Limpiar</button>
          </div>
        ) : (
          <>
            <input id="idEmpleado" type="text" placeholder="Ingrese id de empleado" />
            <button onClick={buscarEmpleado}>Buscar Empleado</button>
          </>
        )}
      </div>
      <h2>Crear Empleado</h2>
      <div>
        <input id="crearEmpleado_id" type="text" placeholder="Ingrese id de empleado" />
        <input id="crearEmpleado_nombre" type="text" placeholder="Ingrese nombre" />
        <input id="crearEmpleado_apellidoPaterno" type="text" placeholder="Ingrese apellido paterno" />
        <input id="crearEmpleado_apellidoMaterno" type="text" placeholder="Ingrese apellido materno" />
        <input id="crearEmpleado_nacimientoFecha" type="date" placeholder="Ingrese fecha de nacimiento" />
        <button onClick={crearEmpleado}>Crear Empleado</button>
      </div>
      <h2>Borrar empleado</h2>
      <div>
        <input id="borrarEmpleado_id" type="text" placeholder="Ingrese id de empleado" />
        <button onClick={borrarEmpleado}>Borrar Empleado</button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Empleado />);
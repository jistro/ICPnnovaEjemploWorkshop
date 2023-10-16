import * as React from "react";
import { createRoot } from "react-dom/client";
import { workshopCOLLEDGE_backend as canister, createActor } from "../../declarations/workshopCOLLEDGE_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { ethers } from "ethers";

let actor = canister;

const Empleado = () => {// funcion main
  const [empleadoSearch, setEmpleadoSearch] = React.useState(null);
  const [empleadoSearchWithId, setEmpleadoSearchWithId] = React.useState(null);
  const [whoami, setWhoami] = React.useState(null);
  const [evmAddress, setEvmAddress] = React.useState(null);

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

  const buscarEmpleadoConId = (idEmpleado) => {
    canister.obtenerEmpleado(idEmpleado).then((result) => {
      console.log(result);
      setEmpleadoSearchWithId(result);
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
      idEmpleado, {
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

  const local_ii_url = `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

  const callInternetIdentity = async () => {
    let iiUrl;
    if (process.env.DFX_NETWORK === "local") {
      iiUrl = local_ii_url;
    } else if (process.env.DFX_NETWORK === "ic") {
      //llama a 
      iiUrl = `https://identity.ic0.app`;
    } else {
      iiUrl = local_ii_url;
    }
    const authClient = await AuthClient.create();

    await new Promise((resolve) => {
      authClient.login({
        identityProvider: iiUrl,
        onSuccess: resolve,
        onError: () => {
          alert('Login error');
        },
      });
    });

    const identity = await authClient.getIdentity();
    const agent = new HttpAgent({ identity });

    actor = createActor(process.env.CANISTER_ID_WORKSHOPCOLLEDGE_BACKEND, {
      agent,
    });

    const principal = await actor.whoami();
    console.log(principal.toString());
    setWhoami(principal.toString());

  };

  const getEVMAddressWithMetaMask = async () => {
    if (window.ethereum) {
      console.log("MetaMask is installed!");
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
        setEvmAddress(accounts[0]);
      } catch (error) {}
    } else {
      console.log("MetaMask not installed!");
    }
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
      <h2>LogIn</h2>
      {/* verificar si se logeo con internet identioty o metamask */}
      {whoami || evmAddress ? (
      <div>
        <p>Logeado con {whoami ? `Internet identity` : `Metamask`}</p>
        <p>{whoami ? whoami : evmAddress}</p>
        <button onClick={() => { setWhoami(null); setEvmAddress(null); }}>LogOut</button>
      </div>
      ) : (
        <div>
          <button onClick={callInternetIdentity}>
            LogIn with Internet Identity ∞
          </button>
          <h2>MetaMask</h2>
          <div>
            <button onClick={getEVMAddressWithMetaMask}>
              LogIn with Ethereum in MetaMask Ξ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById("app"));
root.render(<Empleado />);